import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";

export function getErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) return error.messages;

  return ["Erro inesperado. Tente novamente."];
}

export function showErrorToast(title: string, error: unknown) {
  toast.error(title, { description: getErrorMessages(error).join("\n") });
}
