import { NextRequest, NextResponse } from "next/server";
import { getOrders, updateOrderStatus } from "@/lib/db-orders";
import { getProductById, updateProduct } from "@/lib/db-products";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    // 1. Verify Webhook Signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "mockwebhooksecret123";
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isSignatureValid = expectedSignature === signature;

    if (!isSignatureValid) {
      console.error("[api-webhooks-razorpay] Signature verification failed");
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    // 2. Parse Webhook Event Body
    const body = JSON.parse(rawBody);
    const event = body.event;
    console.log(`[api-webhooks-razorpay] Received event: ${event}`);

    // 3. Process Events
    if (event === "payment.captured") {
      const payment = body.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      if (!razorpayOrderId) {
        return NextResponse.json({ error: "No order ID in payment entity" }, { status: 400 });
      }

      // Lookup the order pre-created in database containing the Razorpay Order ID
      const orders = await getOrders();
      const order = orders.find((o) => o.shippingAddress.includes(razorpayOrderId));

      if (order) {
        // Idempotency check: If already paid, do nothing
        if (order.paymentStatus === "paid") {
          console.log(`[api-webhooks-razorpay] Order ${order.id} already paid. Skipping webhook logic.`);
          return NextResponse.json({ received: true });
        }

        // Update payment and order status
        const updatedOrder = await updateOrderStatus(order.id, "processing", "paid");
        if (updatedOrder) {
          // Adjust inventory levels
          for (const item of updatedOrder.items) {
            const product = await getProductById(item.productId);
            if (product) {
              await updateProduct(item.productId, {
                stock: Math.max(0, product.stock - item.qty)
              });
            }
          }

          // Trigger invoice email notification
          await sendOrderConfirmationEmail(updatedOrder);
          console.log(`[api-webhooks-razorpay] Webhook successfully processed payment for Order: ${order.id}`);
        }
      } else {
        console.warn(`[api-webhooks-razorpay] Order record not found in database for Order ID: ${razorpayOrderId}`);
      }
    } else if (event === "payment.failed") {
      const payment = body.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      if (razorpayOrderId) {
        const orders = await getOrders();
        const order = orders.find((o) => o.shippingAddress.includes(razorpayOrderId));

        if (order && order.paymentStatus !== "paid") {
          await updateOrderStatus(order.id, "cancelled", "failed");
          console.log(`[api-webhooks-razorpay] Updated order ${order.id} to failed state.`);
        }
      }
    } else if (event === "refund.processed") {
      const refund = body.payload.refund.entity;
      const paymentId = refund.payment_id;

      // Find order by Payment ID
      const orders = await getOrders();
      const order = orders.find((o) => o.shippingAddress.includes(paymentId));

      if (order) {
        // Mark payment as refunded and order as cancelled
        const updatedOrder = await updateOrderStatus(order.id, "cancelled", "refunded");
        if (updatedOrder) {
          // Restock product inventory
          for (const item of updatedOrder.items) {
            const product = await getProductById(item.productId);
            if (product) {
              await updateProduct(item.productId, {
                stock: product.stock + item.qty
              });
            }
          }
          console.log(`[api-webhooks-razorpay] Processed refund for Order ${order.id} and restocked products.`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[api-webhooks-razorpay] Webhook processing failed:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
