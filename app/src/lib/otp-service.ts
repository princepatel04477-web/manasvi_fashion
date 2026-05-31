import { supabase } from "./supabase";

const globalForOtp = global as unknown as {
  otpCache?: Record<string, { code: string; expiresAt: number }>;
};

if (!globalForOtp.otpCache) {
  globalForOtp.otpCache = {};
}

const otpCache = globalForOtp.otpCache;

export async function generateOtp(emailOrPhone: string): Promise<string> {
  const input = emailOrPhone.trim();
  const isEmail = input.includes("@");

  if (supabase) {
    try {
      let result;
      if (isEmail) {
        result = await supabase.auth.signInWithOtp({
          email: input,
          options: {
            shouldCreateUser: true
          }
        });
      } else {
        result = await supabase.auth.signInWithOtp({
          phone: input,
          options: {
            shouldCreateUser: true
          }
        });
      }

      if (result.error) {
        throw new Error(result.error.message);
      }
      console.log(`[Supabase Auth] Verification request sent successfully to ${input}`);
      return "SUPABASE_HANDLED";
    } catch (err) {
      console.warn("[Supabase Auth] Failed to request OTP via Supabase. Falling back to local simulator:", err);
    }
  }

  // Generate a secure 6-digit OTP fallback
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

  const key = input.toLowerCase();
  otpCache[key] = { code, expiresAt };

  return code;
}

export async function verifyOtp(emailOrPhone: string, code: string): Promise<boolean> {
  const input = emailOrPhone.trim();
  const isEmail = input.includes("@");

  if (supabase) {
    try {
      let result;
      if (isEmail) {
        result = await supabase.auth.verifyOtp({
          email: input,
          token: code,
          type: "email"
        });
      } else {
        result = await supabase.auth.verifyOtp({
          phone: input,
          token: code,
          type: "sms"
        });
      }

      if (!result.error && (result.data?.session || result.data?.user)) {
        console.log(`[Supabase Auth] Verification successful for ${input}`);
        return true;
      }
      console.warn(`[Supabase Auth] Verification failed for ${input}:`, result.error?.message);
    } catch (err) {
      console.warn("[Supabase Auth] Verification error, falling back to local verification:", err);
    }
  }

  const key = input.toLowerCase();
  const cached = otpCache[key];

  if (!cached) {
    return false;
  }

  // Check expiration
  if (Date.now() > cached.expiresAt) {
    delete otpCache[key];
    return false;
  }

  // Compare codes (strip spaces if any)
  const isMatch = cached.code.replace(/\s+/g, "") === code.replace(/\s+/g, "");

  if (isMatch) {
    // Delete OTP after successful verification to prevent reuse
    delete otpCache[key];
    return true;
  }

  return false;
}

export async function sendOtpEmail(email: string, code: string, nextauthUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const magicLink = `${nextauthUrl.replace(/\/$/, "")}/auth/signin?email=${encodeURIComponent(email)}&otp=${code}&autoSubmit=true`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Session — Manasvi Fashion</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: sans-serif; color: #3B2B28; -webkit-font-smoothing: antialiased;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 40px auto; border: 1px solid #E7C2B8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 74, 68, 0.05);">
          <!-- HEADER -->
          <tr>
            <td style="background-color: #3B2B28; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #FAF7F2; font-weight: 300; letter-spacing: 0.15em; text-transform: uppercase;">
                MANASVI FASHION
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #C98E87; letter-spacing: 0.25em; text-transform: uppercase;">
                Atelier & Cinematic Boutique
              </p>
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="margin-top: 0; font-family: Georgia, serif; font-size: 20px; font-weight: normal; color: #3B2B28; padding-bottom: 10px;">
                Your Boutique Passcode
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #5C4A44; margin-bottom: 25px;">
                You requested a verification link/code to sign into your account. Use the passcode below or click the direct button to log in automatically.
              </p>
              
              <!-- PASSCODE BOX -->
              <div style="background-color: #FAF7F2; border: 1px dashed #E7C2B8; border-radius: 8px; padding: 15px 30px; display: inline-block; margin-bottom: 30px;">
                <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 0.2em; color: #3B2B28;">${code}</span>
              </div>

              <!-- MAGIC LINK CTA BUTTON -->
              <div style="margin: 20px 0 35px 0;">
                <a href="${magicLink}" style="background-color: #3B2B28; color: #FAF7F2; padding: 15px 35px; text-decoration: none; font-size: 11px; font-family: sans-serif; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 50px; display: inline-block; box-shadow: 0 4px 12px rgba(59, 43, 40, 0.15);">
                  Secure Sign In Link
                </a>
              </div>

              <p style="font-size: 11px; color: #8B6B61; margin-top: 20px;">
                This verification link and passcode will expire in 10 minutes. If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 25px 20px; text-align: center; border-top: 1px solid #E7C2B8;">
              <p style="margin: 0; font-size: 11px; color: #8B6B61; letter-spacing: 0.05em;">
                &copy; ${new Date().getFullYear()} Manasvi Fashion. All Rights Reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: "Manasvi Fashion <auth@manasvifashion.com>",
          to: email,
          subject: "Verify Your Sign In — Manasvi Fashion",
          html: emailHtml
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[OTP Service] Resend API failed:", errorText);
      } else {
        console.log(`[OTP Service] Success: Verification email sent to ${email}`);
      }
    } catch (err) {
      console.error("[OTP Service] Error sending email via Resend:", err);
    }
  } else {
    // Beautiful local logging for development/simulated environment
    console.log("=========================================================================");
    console.log("             [SIMULATED EMAIL] VERIFICATION PASSCODE SENT                 ");
    console.log("=========================================================================");
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Sign In — Manasvi Fashion`);
    console.log(`Verification Code: ${code}`);
    console.log(`Magic Link: ${magicLink}`);
    console.log("=========================================================================");
  }
}

export async function sendOtpSms(phone: string, code: string, nextauthUrl: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const magicLink = `${nextauthUrl.replace(/\/$/, "")}/auth/signin?phone=${encodeURIComponent(phone)}&otp=${code}&autoSubmit=true`;

  const messageText = `Manasvi Fashion: Your verification passcode is ${code}. Click to log in automatically: ${magicLink}`;

  if (accountSid && authToken && fromNumber) {
    try {
      // Use native fetch to hit Twilio API to prevent package dependency bloat
      const authHeader = "Basic " + Buffer.from(accountSid + ":" + authToken).toString("base64");
      const body = new URLSearchParams({
        To: phone,
        From: fromNumber,
        Body: messageText
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: authHeader
          },
          body: body.toString()
        }
      );

      if (!response.ok) {
        const errorJson = await response.json();
        console.error("[OTP Service] Twilio API failed:", errorJson);
      } else {
        console.log(`[OTP Service] Success: Verification SMS sent to ${phone}`);
      }
    } catch (err) {
      console.error("[OTP Service] Error sending SMS via Twilio:", err);
    }
  } else {
    // Beautiful local logging for development/simulated environment
    console.log("=========================================================================");
    console.log("              [SIMULATED SMS] VERIFICATION PASSCODE SENT                  ");
    console.log("=========================================================================");
    console.log(`To: ${phone}`);
    console.log(`Message: ${messageText}`);
    console.log("=========================================================================");
  }
}
