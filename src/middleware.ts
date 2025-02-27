import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Redirect to login if no token and trying to access protected routes
  if (!token) {
    if (
      pathname.startsWith("/employee") ||
      pathname.startsWith("/citizen") ||
      pathname.startsWith("/monitor")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userType = payload.userType as string;

    // Check if user is accessing the correct dashboard
    if (pathname.startsWith("/employee") && userType !== "employee") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/citizen") && userType !== "citizen") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/monitor") && userType !== "monitor") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If already authenticated and trying to access login/signup
    if (pathname === "/login" || pathname === "/signup") {
      // Redirect to appropriate dashboard
      switch (userType) {
        case "employee":
          return NextResponse.redirect(
            new URL("/employee/dashboard", request.url),
          );
        case "citizen":
          return NextResponse.redirect(
            new URL("/citizen/dashboard", request.url),
          );
        case "monitor":
          return NextResponse.redirect(
            new URL("/monitor/dashboard", request.url),
          );
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    console.error("Error verifying token:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    "/employee/:path*",
    "/citizen/:path*",
    "/monitor/:path*",
    "/login",
    "/signup",
  ],
};
