import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db-users";
import bcrypt from "bcryptjs";
import { generateOtp, sendOtpEmail, sendOtpSms } from "@/lib/otp-service";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter your email and password." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Credentials are correct! Generate and dispatch 2FA verification OTP
    const code = await generateOtp(email);

    // Resolve base nextauth url
    let nextauthUrl = process.env.NEXTAUTH_URL || "";
    if (!nextauthUrl) {
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      nextauthUrl = `${protocol}://${host}`;
    }

    let sentToPhone = false;
    if (code !== "SUPABASE_HANDLED") {
      // Send code to email
      await sendOtpEmail(email, code, nextauthUrl);

      // Send code to phone if registered on user profile
      if (user.phone) {
        await sendOtpSms(user.phone, code, nextauthUrl);
        sentToPhone = true;
      }
    } else {
      sentToPhone = !!user.phone;
    }

    const sentToMessage = sentToPhone 
      ? `your registered email (${email}) and phone (${user.phone})`
      : `your registered email (${email})`;

    const passcodeFeedback = (code !== "SUPABASE_HANDLED" && !process.env.RESEND_API_KEY) ? code : undefined;

    return NextResponse.json({
      success: true,
      mfaRequired: true,
      sentTo: sentToMessage,
      passcode: passcodeFeedback
    });
  } catch (error) {
    console.error("[Verify Credentials MFA Error]:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during authentication." },
      { status: 500 }
    );
  }
}
