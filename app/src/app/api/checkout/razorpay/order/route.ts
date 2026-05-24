import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/db-products";
import { getCoupons } from "@/lib/db-coupons";
import { createOrder } from "@/lib/db-orders";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid12345",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mocksecretkey54321"
});

export async function POST(req: NextRequest) {
  try {
    const { items, couponCode, shippingDetails } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingDetails || !shippingDetails.name || !shippingDetails.email || !shippingDetails.address) {
      return NextResponse.json({ error: "Missing shipping details" }, { status: 400 });
    }

    // 1. Calculate the subtotal on the server
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (product.stock < item.qty) {
        return NextResponse.json({ error: `Insufficient stock for ${product.title}` }, { status: 400 });
      }

      const itemTotal = product.price * item.qty;
      subtotal += itemTotal;
      validatedItems.push({
        productId: item.productId,
        title: product.title,
        price: product.price,
        qty: item.qty,
        size: item.size,
        image: item.image || product.images[0] || "",
        slug: product.slug
      });
    }

    // 2. Validate Coupon and calculate discount securely
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

    // 3. Create the Razorpay Order
    const amountInPaise = Math.round(totalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Math.random().toString(36).substring(2, 15)}`,
      notes: {
        couponCode: couponCode || "",
        discount: discount.toString(),
        subtotal: subtotal.toString(),
        customerEmail: shippingDetails.email
      }
    };

    const order = await razorpay.orders.create(options);

    // 4. Pre-create the pending unpaid order in our database
    const formattedAddress = `${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pin}\n[Razorpay Order ID: ${order.id}]`;

    await createOrder({
      customerName: shippingDetails.name,
      customerEmail: shippingDetails.email,
      customerPhone: shippingDetails.phone || "",
      items: validatedItems,
      totalAmount: totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
      shippingAddress: formattedAddress
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid12345"
    });
  } catch (error: any) {
    console.error("[api-checkout-razorpay-order] Error creating order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}

