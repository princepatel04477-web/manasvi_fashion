import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/db-products";
import { getCoupons } from "@/lib/db-coupons";
import { createOrder } from "@/lib/db-orders";
import Razorpay from "razorpay";

type RazorpayRouteError = {
  statusCode?: number;
  message?: string;
  error?: {
    description?: string;
    code?: string;
  };
};

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

function isAuthenticationFailure(error: unknown) {
  const razorpayError = error as RazorpayRouteError;
  const description = razorpayError.error?.description;

  return (
    razorpayError.statusCode === 401 ||
    description?.toLowerCase?.().includes("auth") === true ||
    (razorpayError.error?.code === "BAD_REQUEST_ERROR" && description === "Authentication failed")
  );
}

export async function POST(req: NextRequest) {
  try {
    const razorpay = getRazorpayClient();
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

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Minimum order amount is 100 paise (1 INR)" },
        { status: 400 }
      );
    }

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

    console.log("[api-checkout-razorpay-order] Creating Razorpay order with options:", JSON.stringify(options, null, 2));
    const order = await razorpay.orders.create(options);
    console.log("[api-checkout-razorpay-order] Complete Razorpay order response:", JSON.stringify(order, null, 2));

    // 4. Pre-create the pending unpaid order in our database
    const formattedAddress = `${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pin}\n[Razorpay Order ID: ${order.id}]`;

    console.log("[api-checkout-razorpay-order] Pre-creating pending unpaid order in database for customer:", shippingDetails.email);
    const dbOrder = await createOrder({
      customerName: shippingDetails.name,
      customerEmail: shippingDetails.email,
      customerPhone: shippingDetails.phone || "",
      items: validatedItems,
      totalAmount: totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
      shippingAddress: formattedAddress
    });
    console.log("[api-checkout-razorpay-order] Pre-created database order successfully with Local ID:", dbOrder.id);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error: unknown) {
    const razorpayError = error as RazorpayRouteError;
    console.error("[api-checkout-razorpay-order] Error creating order:", razorpayError);
    const isAuthFailure = isAuthenticationFailure(razorpayError);
    
    if (isAuthFailure) {
      return NextResponse.json(
        { error: razorpayError.error?.description || "Authentication failed" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: razorpayError.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
