import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken");

  const protectedPaths = ["/booking"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // without a refresh token, redirect to signin
  if (isProtectedPath && !refreshToken) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  const authPaths = ["/signin", "/signup"];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPath && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/booking/:path*", "/signin", "/signup"],
};
