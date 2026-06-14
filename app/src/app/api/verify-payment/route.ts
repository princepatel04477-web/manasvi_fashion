import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    console.log("[Verify Payment API] Received body payload:", JSON.stringify(body, null, 2));

    // Validate missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("[Verify Payment API] Missing fields validation failed");
      return NextResponse.json(
        { error: "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature are required" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("[Verify Payment API] Missing Razorpay Key Secret");
      return NextResponse.json({ error: "Authentication failed: Missing API credentials" }, { status: 401 });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    console.log("[Verify Payment API] Signature comparison:", {
      text,
      expectedSignature,
      receivedSignature: razorpay_signature,
      isSignatureValid
    });

    if (!isSignatureValid) {
      console.error("[Verify Payment API] Signature mismatch!");
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: "Payment verified successfully"
    });
  } catch (error: any) {
    console.error("[Verify Payment] Unexpected Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
