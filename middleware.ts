import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Skip static files and API routes
  const isAsset = pathname.startsWith("/_next") ||
                  pathname.startsWith("/api") ||
                  pathname.startsWith("/favicon.ico") ||
                  pathname.startsWith("/images") ||
                  pathname.startsWith("/public");

  if (isAsset) {
    return NextResponse.next();
  }

  // ✅ Check token in cookies
  const token = req.cookies.get("access_token")?.value;

  // ✅ Check if the route is publicly accessible
  const isPublicRoute = PUBLIC_ROUTES.some(
    (publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );

  // ✅ Redirect unauthenticated users away from protected pages
  if (!token && !isPublicRoute) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname); // for redirect after login
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Prevent logged-in users from accessing login/register pages
  if (token && isPublicRoute) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  // ✅ Continue to requested page
  return NextResponse.next();
}

// ✅ Apply middleware to all routes except static files and APIs
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|public|api/.*).*)"],
};
