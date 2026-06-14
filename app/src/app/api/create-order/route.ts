import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, receipt } = body;

    // Validate amount >= 100 paise
    if (amount === undefined || amount === null) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }
    if (typeof amount !== "number" || amount < 100) {
      return NextResponse.json({ error: "Minimum amount is 100 paise" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Handle authentication failures (missing API keys)
    if (!keyId || !keySecret) {
      console.error("[Create Order] Missing Razorpay Key ID or Key Secret");
      return NextResponse.json({ error: "Authentication failed: Missing API credentials" }, { status: 401 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const createOptions = {
      amount: Math.round(amount),
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Math.random().toString(36).substring(2, 15)}`
    };

    try {
      console.log("[Create Order API] Calling Razorpay orders.create with options:", JSON.stringify(createOptions, null, 2));
      const order = await razorpay.orders.create(createOptions);
      console.log("[Create Order API] Complete Razorpay orders.create response:", JSON.stringify(order, null, 2));

      return NextResponse.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } catch (razorpayError: any) {
      console.error("[Create Order] Razorpay API Error:", razorpayError);
      const isAuthFailure = razorpayError?.statusCode === 401 || 
                            razorpayError?.error?.description?.toLowerCase().includes("auth") ||
                            razorpayError?.error?.code === "BAD_REQUEST_ERROR" && razorpayError?.error?.description === "Authentication failed";
      
      if (isAuthFailure) {
        return NextResponse.json(
          { error: razorpayError?.error?.description || "Authentication failed" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: razorpayError?.message || "Razorpay API error" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Create Order] Unexpected Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
