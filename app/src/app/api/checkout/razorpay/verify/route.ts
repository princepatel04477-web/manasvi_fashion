import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus } from "@/lib/db-orders";
import { getProductById, updateProduct } from "@/lib/db-products";
import { getCoupons } from "@/lib/db-coupons";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import { sendOrderWhatsappNotification } from "@/lib/whatsapp-service";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    console.log("[api-checkout-razorpay-verify] Received verification payload:", JSON.stringify(requestBody, null, 2));

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingDetails,
      cartItems,
      couponCode,
      isMock
    } = requestBody;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("[api-checkout-razorpay-verify] Validation error: Missing required Razorpay details");
      return NextResponse.json({ error: "Missing Razorpay details" }, { status: 400 });
    }

    if (!shippingDetails || !cartItems || !Array.isArray(cartItems)) {
      console.warn("[api-checkout-razorpay-verify] Validation error: Invalid order payload structure");
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    // 1. Verify Razorpay Payment Signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!isMock && !keySecret) {
      console.error("[api-checkout-razorpay-verify] Missing RAZORPAY_KEY_SECRET for live verification");
      return NextResponse.json({ error: "Razorpay verification is not configured" }, { status: 500 });
    }
    const bodyText = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", keySecret || "")
      .update(bodyText)
      .digest("hex");

    const isSignatureValid =
      isMock === true ? razorpay_signature === "mock_sig" : expectedSignature === razorpay_signature;

    console.log("[api-checkout-razorpay-verify] Signature validation parameters:", {
      razorpay_order_id,
      razorpay_payment_id,
      isMock,
      expectedSignature,
      receivedSignature: razorpay_signature,
      isSignatureValid
    });

    if (!isSignatureValid) {
      console.error("[api-checkout-razorpay-verify] Invalid signature verification failed!");
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Lookup pre-created order by Razorpay Order ID in shippingAddress
    console.log("[api-checkout-razorpay-verify] Checking for pre-created order in database with Razorpay Order ID:", razorpay_order_id);
    const orders = await getOrders();
    const existingOrder = orders.find(
      (o) => o.shippingAddress.includes(razorpay_order_id)
    );

    if (existingOrder) {
      console.log("[api-checkout-razorpay-verify] Found pre-created order:", existingOrder.id);
      
      // Idempotency: If already paid, return success immediately
      if (existingOrder.paymentStatus === "paid") {
        console.log("[api-checkout-razorpay-verify] Order was already marked as paid. Returning success (Idempotent). ID:", existingOrder.id);
        return NextResponse.json({
          ok: true,
          orderId: existingOrder.id
        });
      }

      // Update order status to paid and processing
      console.log("[api-checkout-razorpay-verify] Updating order status in DB to processing/paid for Order:", existingOrder.id);
      const updatedOrder = await updateOrderStatus(existingOrder.id, "processing", "paid");
      if (updatedOrder) {
        console.log("[api-checkout-razorpay-verify] Order status updated successfully in DB:", updatedOrder.id);
        
        // Update stock
        for (const item of updatedOrder.items) {
          const product = await getProductById(item.productId);
          if (product) {
            console.log(`[api-checkout-razorpay-verify] Adjusting stock for product ${product.title} (ID: ${item.productId}) from ${product.stock} to ${Math.max(0, product.stock - item.qty)}`);
            await updateProduct(item.productId, {
              stock: Math.max(0, product.stock - item.qty)
            });
          }
        }

        // Send confirmation email
        console.log("[api-checkout-razorpay-verify] Triggering order confirmation email to:", updatedOrder.customerEmail);
        await sendOrderConfirmationEmail(updatedOrder);

        // WhatsApp owner notification (non-blocking on failure)
        const waResult = await sendOrderWhatsappNotification(updatedOrder);
        console.log("[api-checkout-razorpay-verify] WhatsApp notification result:", waResult);

        return NextResponse.json({
          ok: true,
          orderId: updatedOrder.id
        });
      }
    }

    // 3. Fallback: Create order if not pre-created (e.g. if order API failed but user completed direct payment)
    console.log("[api-checkout-razorpay-verify] Pre-created order not found. Falling back to creating new paid order directly.");
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await getProductById(item.productId);
      if (!product) {
        console.error(`[api-checkout-razorpay-verify] Product not found in DB during fallback creation: ${item.productId}`);
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      
      const price = product.price;
      subtotal += price * item.qty;

      orderItems.push({
        productId: item.productId,
        title: `${product.title}`,
        price: price,
        qty: item.qty,
        size: item.size,
        image: item.image || product.images[0] || "",
        slug: product.slug
      });
    }

    let discount = 0;
    if (couponCode) {
      const coupons = await getCoupons();
      const coupon = coupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active
      );

      if (coupon) {
        const now = new Date();
        const expiry = new Date(coupon.expiryDate);
        const isExpired = now > expiry;
        const meetsMinOrder = !coupon.minOrderValue || subtotal >= coupon.minOrderValue;
        const meetsLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;

        if (!isExpired && meetsMinOrder && meetsLimit) {
          if (coupon.discountType === "percentage") {
            discount = Math.floor(subtotal * (coupon.discountValue / 100));
          } else {
            discount = coupon.discountValue;
          }
        }
      }
    }

    const shippingCharge = subtotal > 0 ? 150 : 0;
    const totalAmount = Math.max(0, subtotal - discount + shippingCharge);
    const formattedAddress = `${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pin}\n[Razorpay Order ID: ${razorpay_order_id} | Payment ID: ${razorpay_payment_id}]`;

    console.log("[api-checkout-razorpay-verify] Creating fallback paid order in DB for:", shippingDetails.email);
    const order = await createOrder({
      customerName: shippingDetails.name,
      customerEmail: shippingDetails.email,
      customerPhone: shippingDetails.phone || "",
      items: orderItems,
      totalAmount: totalAmount,
      status: "processing",
      paymentStatus: razorpay_payment_id.startsWith("pay_cod_") ? "unpaid" : "paid",
      shippingAddress: formattedAddress
    });
    console.log("[api-checkout-razorpay-verify] Fallback paid order created successfully in DB with ID:", order.id);

    for (const item of orderItems) {
      const product = await getProductById(item.productId);
      if (product) {
        console.log(`[api-checkout-razorpay-verify] Adjusting stock for product ${product.title} (ID: ${item.productId}) from ${product.stock} to ${Math.max(0, product.stock - item.qty)}`);
        await updateProduct(item.productId, {
          stock: Math.max(0, product.stock - item.qty)
        });
      }
    }

    console.log("[api-checkout-razorpay-verify] Triggering order confirmation email for fallback order to:", order.customerEmail);
    await sendOrderConfirmationEmail(order);

    // WhatsApp owner notification (non-blocking on failure)
    const waResultFallback = await sendOrderWhatsappNotification(order);
    console.log("[api-checkout-razorpay-verify] WhatsApp notification result (fallback):", waResultFallback);

    return NextResponse.json({
      ok: true,
      orderId: order.id
    });
  } catch (error: any) {
    console.error("[api-checkout-razorpay-verify] Unexpected Verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
