import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
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
    
    // Block unauthorized customer sessions trying to invoke admin endpoints
    if (path.startsWith("/api/admin") && !isAuthorized) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized. Admin role required." }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Ensure the user is logged in (has a JWT token) to invoke the middleware function
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin"
    }
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
