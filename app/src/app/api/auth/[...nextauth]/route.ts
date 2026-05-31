import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/db-users";
import { ensureNextAuthUrl, nextAuthSecret } from "@/lib/auth-constants";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// Dynamically resolve deployment URL if running on Vercel and NEXTAUTH_URL is pointing to localhost or missing
ensureNextAuthUrl();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        emailOrPhone: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        authType: { label: "Auth Type", type: "text" }
      },
      async authorize(credentials) {
        // Check for password + passcode Multi-Factor Authentication (MFA)
        if (credentials?.authType === "mfa") {
          const email = credentials.email;
          const password = credentials.password;
          const otp = credentials.otp;

          if (!email || !password || !otp) {
            throw new Error("Please enter your email, password, and verification passcode.");
          }

          const user = await getUserByEmail(email);
          if (!user) {
            throw new Error("Invalid email or password.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid email or password.");
          }

          const { verifyOtp } = await import("@/lib/otp-service");
          const isValid = await verifyOtp(email, otp);

          if (!isValid) {
            throw new Error("Invalid or expired verification passcode.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            shippingAddress: user.shippingAddress,
            city: user.city,
            postalCode: user.postalCode
          };
        }

        // Check for passwordless OTP authorization
        if (credentials?.authType === "otp") {
          const input = credentials.emailOrPhone;
          const otp = credentials.otp;

          if (!input || !otp) {
            throw new Error("Please enter verification details.");
          }

          const { verifyOtp } = await import("@/lib/otp-service");
          const isValid = await verifyOtp(input, otp);

          if (!isValid) {
            throw new Error("Invalid or expired verification passcode.");
          }

          const isEmail = input.includes("@");
          const { getUserByEmail, getUserByPhone, registerPasswordlessUser } = await import("@/lib/db-users");

          let user;
          if (isEmail) {
            user = await getUserByEmail(input);
          } else {
            user = await getUserByPhone(input);
          }

          if (!user) {
            user = await registerPasswordlessUser(input, isEmail);
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            shippingAddress: user.shippingAddress,
            city: user.city,
            postalCode: user.postalCode
          };
        }

        // Standard Email + Password Credentials Login
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password.");
        }

        // Return user details with role
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          shippingAddress: user.shippingAddress,
          city: user.city,
          postalCode: user.postalCode
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.role = u.role;
        token.phone = u.phone;
        token.shippingAddress = u.shippingAddress;
        token.city = u.city;
        token.postalCode = u.postalCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any;
        u.role = token.role as string;
        u.phone = token.phone as string;
        u.shippingAddress = token.shippingAddress as string;
        u.city = token.city as string;
        u.postalCode = token.postalCode as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  session: {
    strategy: "jwt"
  },
  secret: nextAuthSecret
});

export { handler as GET, handler as POST };
