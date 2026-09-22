import { NextResponse, type NextRequest } from "next/server";

import { HOME_ROUTE, routes } from "@/config/routes";
import { getValidToken } from "@/lib/session-token";

export async function proxy(request: NextRequest) {
  const token = await getValidToken(request);
  const isLoginPage = request.nextUrl.pathname === routes.login;

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL(routes.login, request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ignora rotas de API (autenticadas no próprio handler) e arquivos estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
