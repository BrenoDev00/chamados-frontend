import { signOut } from "next-auth/react";

import { routes } from "@/config/routes";

const BACKEND_PROXY_PATH = "/api/backend";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[],
  ) {
    super(messages.join("\n"));
    this.name = "ApiError";
  }
}

// A API retorna string[] em erros de validação e { errorMessage } nos demais.
function extractErrorMessages(body: unknown): string[] {
  if (Array.isArray(body)) return body.map(String);

  if (body && typeof body === "object" && "errorMessage" in body) {
    return [String(body.errorMessage)];
  }

  return ["Erro inesperado. Tente novamente."];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_PROXY_PATH}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (response.status === 401) {
    await signOut({ callbackUrl: routes.login });
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, extractErrorMessages(body));
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};
