import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateOtp, sendOtpEmail, sendOtpSms } from "@/lib/otp-service";

const sendOtpSchema = z.object({
  emailOrPhone: z.string().min(3, "Input is too short"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = sendOtpSchema.parse(body);
    const input = validated.emailOrPhone.trim();

    // Check if input is email or phone
    const isEmail = input.includes("@");
    const code = await generateOtp(input);

    // Resolve base nextauth url for direct login links
    let nextauthUrl = process.env.NEXTAUTH_URL || "";
    if (!nextauthUrl) {
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      nextauthUrl = `${protocol}://${host}`;
    }

    if (code !== "SUPABASE_HANDLED") {
      if (isEmail) {
        await sendOtpEmail(input, code, nextauthUrl);
      } else {
        // Normalize phone number (strip spaces, symbols, ensure it has country code if needed or keep raw input)
        await sendOtpSms(input, code, nextauthUrl);
      }
    }

    const passcodeFeedback = (code !== "SUPABASE_HANDLED" && !process.env.RESEND_API_KEY) ? code : undefined;

    return NextResponse.json({
      success: true,
      isEmail,
      message: isEmail
        ? "Verification link and passcode sent to email."
        : "Verification passcode sent to phone number.",
      passcode: passcodeFeedback
    });
  } catch (error) {
    console.error("[Send OTP API Error]:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to send verification code." },
      { status: 400 }
    );
  }
}
