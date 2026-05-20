import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (credentials?.email) return { id: "1", name: "Manasvi User", email: credentials.email as string };
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
