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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
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
