import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { createSupabaseProxyClient } from "./lib/supabase/proxy";

const intlMiddleware = createMiddleware(routing);

const INTERNAL_ADMIN_PREFIX = "/admin-console";

function addAdminSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, private");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === INTERNAL_ADMIN_PREFIX ||
    pathname.startsWith(INTERNAL_ADMIN_PREFIX + "/")
  ) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  if (pathname.startsWith("/api/internal-admin") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const adminConsolePath = (process.env.ADMIN_CONSOLE_PATH ?? "").trim();

  if (adminConsolePath && pathname.startsWith(adminConsolePath)) {
    const remaining = pathname.slice(adminConsolePath.length) || "/";
    const isSignIn =
      remaining === "/sign-in" || remaining === "/sign-in/";

    if (!isSignIn) {
      const { client: supabase, response: supabaseResponse } =
        createSupabaseProxyClient(request);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const signInUrl = new URL(adminConsolePath + "/sign-in", request.url);
        signInUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(signInUrl);
      }

      const url = request.nextUrl.clone();
      url.pathname = INTERNAL_ADMIN_PREFIX + remaining;
      const rewriteResponse = NextResponse.rewrite(url);

      supabaseResponse.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie.name, cookie.value);
      });

      return addAdminSecurityHeaders(rewriteResponse);
    }

    const url = request.nextUrl.clone();
    url.pathname = INTERNAL_ADMIN_PREFIX + remaining;
    const response = NextResponse.rewrite(url);
    return addAdminSecurityHeaders(response);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
