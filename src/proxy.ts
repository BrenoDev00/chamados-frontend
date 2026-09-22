import { NextResponse, type NextRequest } from "next/server";

import { getValidToken } from "@/lib/session-token";

const LOGIN_PATH = "/login";
const HOME_PATH = "/";

export async function proxy(request: NextRequest) {
  const token = await getValidToken(request);
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ignora rotas de API (autenticadas no próprio handler) e arquivos estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
