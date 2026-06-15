import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { nextAuthSecret } from "@/lib/auth-constants";

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    const ALLOWED_SELLERS = [
      "varunyatechnologies@gmail.com",
      "manasvifashion1515@gmail.com"
    ];

    // Allow access-denied page without redirection loops
    if (path === "/dashboard/access-denied") {
      return NextResponse.next();
    }

    const role = token?.role;
    const isAuthorized = role === "admin" || role === "seller";
    
    // Redirect unauthorized customer sessions trying to view admin dashboard
    if (path.startsWith("/dashboard") && !isAuthorized) {
      return NextResponse.redirect(new URL("/dashboard/access-denied", req.url));
    }

    // Redirect unauthorized seller sessions trying to view seller dashboard
    if (path.startsWith("/seller") && path !== "/seller/login") {
      const email = token?.email?.toLowerCase();
      const isAllowedSeller = email && ALLOWED_SELLERS.includes(email);
      if (!isAllowedSeller) {
        return NextResponse.redirect(new URL("/seller/login", req.url));
      }
    }
    
    // Block unauthorized customer sessions trying to invoke admin endpoints
    if (path.startsWith("/api/admin") && !isAuthorized) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized. Admin role required." }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Block unauthorized sessions trying to invoke seller endpoints
    if (path.startsWith("/api/seller")) {
      const email = token?.email?.toLowerCase();
      const isAllowedSeller = email && ALLOWED_SELLERS.includes(email);
      if (!isAllowedSeller) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Unauthorized. Seller credentials required." }),
          { status: 401, headers: { "content-type": "application/json" } }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Ensure the user is logged in (has a JWT token) to invoke the middleware function, unless it's the login page
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/seller/login") return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin"
    },
    secret: nextAuthSecret
  }
);

export default async function middleware(req: any, event: any) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  if (host) {
    process.env.NEXTAUTH_URL = `${protocol}://${host}`;
  }
  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/dashboard/:path*", "/seller/:path*", "/api/admin/:path*", "/api/seller/:path*"],
};
