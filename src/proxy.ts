import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The middleware gates on the refresh token, NOT the access token.
 *
 * The access token is short-lived and the browser deletes it when it
 * expires. Using it as the "logged in" signal causes spurious redirects
 * because the middleware runs before the client-side refresh flow can
 * run. The refresh token is long-lived and is the correct signal for
 * "there is a session the client can renew".
 */
const REFRESH_TOKEN_COOKIE = "refresh_token";

const PROTECTED_ROUTES = ["/dashboard"] as const;
const AUTH_ROUTES = ["/login", "/register"] as const;

function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasRefreshToken = Boolean(
    request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
  );

  const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES);
  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTES);

  /**
   * Protected routes: redirect only if there is no refresh token.
   *
   * Do NOT check the access token here. An expired access token is
   * expected — the client-side API layer refreshes it transparently
   * on the first 401. The middleware runs before that flow and cannot
   * wait for it, so it must not depend on the access token's presence.
   */
  if (isProtectedRoute && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Auth routes: keep authenticated users away from login/register.
   */
  if (isAuthRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
