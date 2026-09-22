import { NextResponse, type NextRequest } from "next/server";

import { getServerEnv } from "@/lib/env";
import { getValidToken } from "@/lib/session-token";

// Encaminha as requisições do navegador para a API Spring anexando o token JWT
// guardado na sessão, sem expô-lo ao cliente e sem depender de CORS no backend.
async function forwardToBackend(
  request: NextRequest,
  { params }: RouteContext<"/api/backend/[...path]">,
) {
  const token = await getValidToken(request);

  if (!token) {
    return NextResponse.json(
      { errorMessage: "Sessão expirada. Faça login novamente." },
      { status: 401 },
    );
  }

  const { path } = await params;
  const backendUrl = new URL(`${getServerEnv().API_URL}/${path.join("/")}`);
  backendUrl.search = request.nextUrl.search;

  const hasBody = !["GET", "HEAD"].includes(request.method);

  const backendResponse = await fetch(backendUrl, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      ...(hasBody && { "Content-Type": "application/json" }),
    },
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export {
  forwardToBackend as GET,
  forwardToBackend as POST,
  forwardToBackend as PUT,
  forwardToBackend as DELETE,
};
