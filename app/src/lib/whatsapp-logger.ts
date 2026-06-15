/**
 * whatsapp-logger.ts
 * ------------------------------------------------------------------
 * Append-only structured logger for WhatsApp notification attempts.
 * - Writes a row to Supabase table `whatsapp_notifications` when available.
 * - Always mirrors to console with a `[wa-notify]` prefix for Vercel logs.
 * - Never throws — logging failure must not break the order flow.
 * ------------------------------------------------------------------
 */

import { supabaseAdmin } from "./supabase";

export type NotifyStatus =
  | "skipped_disabled"
  | "skipped_no_config"
  | "success"
  | "failed"
  | "retrying";

export interface NotifyLogEntry {
  orderId?: string | null;
  status: NotifyStatus;
  attempt: number;
  httpStatus?: number;
  errorMessage?: string;
  durationMs: number;
  recipient: string;
  messageLength: number;
  meta?: Record<string, unknown>;
}

export async function logWhatsappAttempt(entry: NotifyLogEntry): Promise<void> {
  const stamp = new Date().toISOString();
  const consoleLine = `[wa-notify] ${stamp} order=${entry.orderId ?? "n/a"} status=${entry.status} attempt=${entry.attempt} http=${entry.httpStatus ?? "-"} dur=${entry.durationMs}ms recip=${entry.recipient} len=${entry.messageLength}${entry.errorMessage ? ` err=${entry.errorMessage}` : ""}`;

  // 1) Always log to console (Vercel captures stdout)
  if (entry.status === "failed") {
    console.error(consoleLine);
  } else {
    console.log(consoleLine);
  }

  // 2) Best-effort write to Supabase (non-blocking, swallow errors)
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("whatsapp_notifications").insert({
        order_id: entry.orderId ?? null,
        status: entry.status,
        attempt: entry.attempt,
        http_status: entry.httpStatus ?? null,
        error_message: entry.errorMessage ?? null,
        duration_ms: entry.durationMs,
        recipient: entry.recipient,
        message_length: entry.messageLength,
        meta: entry.meta ?? {},
        created_at: stamp,
      });
    } catch (e) {
      // Never throw — log and move on
      console.warn("[wa-notify] Supabase log write failed (non-fatal):", e);
    }
  }
}
