import type { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";

export async function getValidToken(request: NextRequest): Promise<JWT | null> {
  const token = await getToken({ req: request });

  if (!token || Date.now() >= token.accessTokenExpiresAt) return null;

  return token;
}
