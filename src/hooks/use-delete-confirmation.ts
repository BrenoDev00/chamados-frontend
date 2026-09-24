import { useRef, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";
import { showErrorToast } from "@/lib/errors";

type DeleteMessages = {
  success: string;
  error: string;
};

export function useDeleteConfirmation<T extends { id: string }>(
  deleteMutation: UseMutationResult<void, Error, string>,
  messages: DeleteMessages,
) {
  const [target, setTarget] = useState<T | null>(null);
  // ref atualizada de forma síncrona: isPending só muda após o re-render, o que não
  // impede um clique duplo de disparar duas exclusões
  const isDeletingRef = useRef(false);

  function confirm() {
    if (!target || isDeletingRef.current) return;

    isDeletingRef.current = true;
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        toast.success(messages.success);
        setTarget(null);
      },
      onError: (error) => {
        showErrorToast(messages.error, error);

        // registro já removido por outro técnico: não há o que tentar novamente
        if (error instanceof ApiError && error.status === 404) setTarget(null);
      },
      onSettled: () => {
        isDeletingRef.current = false;
      },
    });
  }

  return {
    target,
    request: setTarget,
    cancel: () => setTarget(null),
    confirm,
    isDeleting: deleteMutation.isPending,
  };
}
