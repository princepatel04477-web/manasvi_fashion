import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus } from "@/lib/db-orders";
import { getProductById, updateProduct } from "@/lib/db-products";
import { getCoupons } from "@/lib/db-coupons";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingDetails,
      cartItems,
      couponCode
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing Razorpay details" }, { status: 400 });
    }

    if (!shippingDetails || !cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    // 1. Verify Razorpay Payment Signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "mocksecretkey54321";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error("[api-checkout-razorpay-verify] Invalid signature verification failed");
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Lookup pre-created order by Razorpay Order ID in shippingAddress
    const orders = await getOrders();
    const existingOrder = orders.find(
      (o) => o.shippingAddress.includes(razorpay_order_id)
    );

    if (existingOrder) {
      // Idempotency: If already paid, return success immediately
      if (existingOrder.paymentStatus === "paid") {
        return NextResponse.json({
          ok: true,
          orderId: existingOrder.id
        });
      }

      // Update order status to paid and processing
      const updatedOrder = await updateOrderStatus(existingOrder.id, "processing", "paid");
      if (updatedOrder) {
        // Update stock
        for (const item of updatedOrder.items) {
          const product = await getProductById(item.productId);
          if (product) {
            await updateProduct(item.productId, {
              stock: Math.max(0, product.stock - item.qty)
            });
          }
        }

        // Send confirmation email
        await sendOrderConfirmationEmail(updatedOrder);

        return NextResponse.json({
          ok: true,
          orderId: updatedOrder.id
        });
      }
    }

    // 3. Fallback: Create order if not pre-created
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await getProductById(item.productId);
      if (!product) {
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

    const totalAmount = Math.max(0, subtotal - discount);
    const formattedAddress = `${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pin}\n[Razorpay Order ID: ${razorpay_order_id} | Payment ID: ${razorpay_payment_id}]`;

    const order = await createOrder({
      customerName: shippingDetails.name,
      customerEmail: shippingDetails.email,
      customerPhone: shippingDetails.phone || "",
      items: orderItems,
      totalAmount: totalAmount,
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: formattedAddress
    });

    for (const item of orderItems) {
      const product = await getProductById(item.productId);
      if (product) {
        await updateProduct(item.productId, {
          stock: Math.max(0, product.stock - item.qty)
        });
      }
    }

    await sendOrderConfirmationEmail(order);

    return NextResponse.json({
      ok: true,
      orderId: order.id
    });
  } catch (error: any) {
    console.error("[api-checkout-razorpay-verify] Verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
