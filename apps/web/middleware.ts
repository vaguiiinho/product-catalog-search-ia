import { NextResponse, type NextRequest } from "next/server";

const authCookieName = "admin_access_token";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") && !request.cookies.get(authCookieName)?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
