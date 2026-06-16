import { NextRequest, NextResponse } from "next/server";
import { verificarToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/session";
import { ADMIN_COOKIE } from "@/lib/admin";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verificarToken(token) : null;

  if (pathname.startsWith("/escola/painel") && payload?.tipo !== "escola") {
    return NextResponse.redirect(new URL("/escola/login", request.url));
  }

  if (pathname.startsWith("/papelaria/painel") && payload?.tipo !== "papelaria") {
    return NextResponse.redirect(new URL("/papelaria/login", request.url));
  }

  if (pathname.startsWith("/admin/painel")) {
    const senhaAdmin = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!senhaAdmin || senhaAdmin !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/escola/painel/:path*", "/papelaria/painel/:path*", "/admin/painel/:path*"],
};
