/**
 * whatsapp-service.ts
 * ------------------------------------------------------------------
 * Sends WhatsApp order notifications via the official Meta Cloud API.
 *
 * Design rules (per client spec):
 *  - Min-invasive: caller (Razorpay verify/webhook) passes an Order
 *    object it already has. No DOM scraping, no client-side code.
 *  - Safe-by-default: if env vars are missing, the function logs and
 *    resolves (does not throw). This lets you deploy the code first
 *    and configure the secrets later without breaking checkout.
 *  - Resilient: 3 attempts with exponential backoff for 5xx + 429.
 *  - Auditable: every attempt is logged via whatsapp-logger.
 *  - Secure: tokens live in env vars only; never logged in plaintext.
 * ------------------------------------------------------------------
 */

import type { Order } from "./db-orders";
import { getProductById } from "./db-products";
import { logWhatsappAttempt, type NotifyStatus } from "./whatsapp-logger";

const META_GRAPH_VERSION = "v21.0"; // Pin a stable version; bump deliberately.
const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 800; // 800ms, 1.6s, 3.2s

interface SendResult {
  sent: boolean;
  status: NotifyStatus;
  attempts: number;
  httpStatus?: number;
  errorMessage?: string;
  messageId?: string;
}

interface CloudApiResponse {
  messages?: Array<{ id: string }>;
  error?: { code?: number; message?: string; type?: string };
}

function buildOwnerPhone(): string | null {
  const raw = process.env.WHATSAPP_OWNER_PHONE;
  if (!raw) return null;
  // Strip everything except digits — Meta requires E.164 without '+'
  return raw.replace(/\D/g, "");
}

function ownerDisplayPhone(): string {
  return process.env.WHATSAPP_OWNER_PHONE_DISPLAY || "+91 9099369035";
}

/* ------------------------------------------------------------------ */
/* Order → pretty message                                              */
/* ------------------------------------------------------------------ */

function escapeWhatsapp(text: string): string {
  // WhatsApp formatting: *bold*, _italic_, ~strike~, ```mono```.
  // We avoid inserting those characters in product names; escape minimally.
  return text.replace(/\*/g, "∗").replace(/_/g, "＿");
}

function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

async function buildMessage(order: Order): Promise<string> {
  const orderIdLine = order.id ? `🆔 *Order ID:* ${escapeWhatsapp(order.id)}` : "🆔 *Order ID:* (pending)";
  const customerLine = `👤 *Customer:* ${escapeWhatsapp(order.customerName || "Unknown")}`;
  const phoneLine = order.customerPhone
    ? `📞 *Phone:* ${escapeWhatsapp(order.customerPhone)}`
    : "📞 *Phone:* (not provided)";
  const emailLine = `📧 *Email:* ${escapeWhatsapp(order.customerEmail || "n/a")}`;

  // Build the line items block, including color/SKU/stock when available
  const itemLines: string[] = [];
  let idx = 1;
  for (const it of order.items) {
    let design = "—";
    let colorLabel = "—";
    let sku = "—";
    let stockInfo = "";

    try {
      const product = await getProductById(it.productId);
      if (product) {
        // Try to find the variant the customer selected
        // Cart items store size; color lives on the order item as well in many setups.
        // We surface the base product color, the variant match, and current stock.
        colorLabel = (product as any).color || "—";
        design = product.title || it.title || "—";

        // SKU — prefer per-color variant SKU if we can match
        const variants: any[] = (product as any).colorVariants || [];
        const matched = variants.find(
          (v) =>
            v?.name?.toLowerCase() === (it as any).color?.toLowerCase() ||
            v?.slug?.toLowerCase() === (it as any).color?.toLowerCase()
        );
        if (matched?.sku) sku = matched.sku;
        else if ((product as any).sku) sku = (product as any).sku;

        // Stock: total stock; per-variant stock if matched
        if (matched && typeof matched.stock === "number") {
          stockInfo = `   📦 *Stock (${matched.name}):* ${matched.stock}`;
        } else if (typeof (product as any).stock === "number") {
          stockInfo = `   📦 *Stock:* ${(product as any).stock}`;
        }
      }
    } catch {
      // Product lookup failure is non-fatal for the message
    }

    itemLines.push(
      [
        `*${idx}.* ${escapeWhatsapp(it.title || design)}`,
        `   • 🎨 *Color/Variant:* ${escapeWhatsapp((it as any).color || colorLabel)}`,
        `   • 🔖 *Design/SKU:* ${escapeWhatsapp(sku)}`,
        `   • 📏 *Size:* ${escapeWhatsapp(it.size || "—")}`,
        `   • 🔢 *Qty:* ${it.qty}`,
        `   • 💰 *Price:* ${inr(it.price)} × ${it.qty} = ${inr(it.price * it.qty)}`,
        stockInfo,
      ]
        .filter(Boolean)
        .join("\n")
    );
    idx += 1;
  }

  const totalLine = `💵 *Total Amount:* ${inr(order.totalAmount)}`;
  const paymentLine = `💳 *Payment:* ${order.paymentStatus === "paid" ? "✅ Paid" : `⏳ ${order.paymentStatus}`}`;
  const addressLine = `📍 *Ship To:*\n${escapeWhatsapp(order.shippingAddress || "—")}`;

  return [
    "✅ *New Order Received!*",
    "━━━━━━━━━━━━━━━━━━",
    orderIdLine,
    customerLine,
    phoneLine,
    emailLine,
    "",
    "🛍️ *Items Ordered:*",
    ...itemLines,
    "",
    totalLine,
    paymentLine,
    "",
    addressLine,
    "",
    `🕒 _Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}_`,
    `📲 _Auto-notification to ${ownerDisplayPhone()}_`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Transport                                                            */
/* ------------------------------------------------------------------ */

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function isRetriable(httpStatus: number, errBody?: string): boolean {
  if (httpStatus === 429) return true; // rate-limited
  if (httpStatus >= 500 && httpStatus < 600) return true; // server error
  if (httpStatus === 408) return true; // request timeout
  // 400 with "rate limit" wording in error body
  if (httpStatus === 400 && /rate.?limit/i.test(errBody || "")) return true;
  return false;
}

async function postOnce(
  phoneNumberId: string,
  accessToken: string,
  recipient: string,
  message: string
): Promise<{ ok: boolean; httpStatus: number; body: CloudApiResponse; rawText: string }> {
  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: { body: message, preview_url: false },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await res.text();
  let body: CloudApiResponse = {};
  try {
    body = rawText ? JSON.parse(rawText) : {};
  } catch {
    // Non-JSON body — treat as error
  }

  return { ok: res.ok, httpStatus: res.status, body, rawText };
}

/* ------------------------------------------------------------------ */
/* Public API                                                           */
/* ------------------------------------------------------------------ */

/**
 * Send a WhatsApp notification for a newly paid order.
 * Never throws — returns a SendResult so the caller can decide.
 */
export async function sendOrderWhatsappNotification(
  order: Order
): Promise<SendResult> {
  const start = Date.now();
  const recipient = buildOwnerPhone();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const enabled = (process.env.WHATSAPP_ENABLED || "").toLowerCase() === "true";

  // 1) Feature flag
  if (!enabled) {
    await logWhatsappAttempt({
      orderId: order?.id ?? null,
      status: "skipped_disabled",
      attempt: 0,
      durationMs: Date.now() - start,
      recipient: recipient ?? "n/a",
      messageLength: 0,
    });
    return { sent: false, status: "skipped_disabled", attempts: 0 };
  }

  // 2) Config check
  if (!recipient || !phoneNumberId || !accessToken) {
    const message = `Missing config: recipient=${!!recipient} phoneId=${!!phoneNumberId} token=${!!accessToken}`;
    await logWhatsappAttempt({
      orderId: order?.id ?? null,
      status: "skipped_no_config",
      attempt: 0,
      durationMs: Date.now() - start,
      recipient: recipient ?? "n/a",
      messageLength: 0,
      errorMessage: message,
    });
    console.warn(`[wa-notify] ${message}`);
    return { sent: false, status: "skipped_no_config", attempts: 0, errorMessage: message };
  }

  // 3) Build message
  let message: string;
  try {
    message = await buildMessage(order);
  } catch (e: any) {
    const errMessage = e?.message || "buildMessage failed";
    await logWhatsappAttempt({
      orderId: order?.id ?? null,
      status: "failed",
      attempt: 0,
      durationMs: Date.now() - start,
      recipient,
      messageLength: 0,
      errorMessage: errMessage,
    });
    return { sent: false, status: "failed", attempts: 0, errorMessage: errMessage };
  }

  // 4) Send with retries
  let lastHttp = 0;
  let lastErr = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const t0 = Date.now();
    try {
      const { ok, httpStatus, body, rawText } = await postOnce(
        phoneNumberId,
        accessToken,
        recipient,
        message
      );

      if (ok && body.messages?.[0]?.id) {
        const dur = Date.now() - t0;
        await logWhatsappAttempt({
          orderId: order?.id ?? null,
          status: "success",
          attempt,
          httpStatus,
          durationMs: dur,
          recipient,
          messageLength: message.length,
          meta: { messageId: body.messages[0].id },
        });
        return {
          sent: true,
          status: "success",
          attempts: attempt,
          httpStatus,
          messageId: body.messages[0].id,
        };
      }

      lastHttp = httpStatus;
      lastErr = body?.error?.message || rawText || `HTTP ${httpStatus}`;

      // Log this attempt as failed/retrying
      await logWhatsappAttempt({
        orderId: order?.id ?? null,
        status: attempt < MAX_ATTEMPTS ? "retrying" : "failed",
        attempt,
        httpStatus,
        durationMs: Date.now() - t0,
        recipient,
        messageLength: message.length,
        errorMessage: lastErr,
      });

      if (attempt < MAX_ATTEMPTS && isRetriable(httpStatus, rawText)) {
        await sleep(RETRY_BASE_MS * Math.pow(2, attempt - 1));
        continue;
      }
      // Non-retriable — break out
      break;
    } catch (e: any) {
      lastHttp = 0;
      lastErr = e?.message || "network error";
      await logWhatsappAttempt({
        orderId: order?.id ?? null,
        status: attempt < MAX_ATTEMPTS ? "retrying" : "failed",
        attempt,
        durationMs: Date.now() - t0,
        recipient,
        messageLength: message.length,
        errorMessage: lastErr,
      });
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_MS * Math.pow(2, attempt - 1));
        continue;
      }
      break;
    }
  }

  return {
    sent: false,
    status: "failed",
    attempts: MAX_ATTEMPTS,
    httpStatus: lastHttp,
    errorMessage: lastErr,
  };
}
