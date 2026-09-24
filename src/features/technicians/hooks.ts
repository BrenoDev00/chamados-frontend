import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";

import {
  technicianKeys,
  technicianQueries,
  updateTechnician,
} from "@/features/technicians/api";
import type { Technician, TechnicianInput } from "@/features/technicians/types";
import { ticketKeys } from "@/features/tickets/api";

export function useTechnicians() {
  return useQuery(technicianQueries.list());
}

// o token da sessão fica vinculado ao e-mail usado no login
export function isOwnEmailChange(session: Session | null, updated: Technician) {
  return (
    updated.id === session?.user.id &&
    updated.email.toLowerCase() !== session.user.email.toLowerCase()
  );
}

export function useUpdateTechnician() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TechnicianInput }) =>
      updateTechnician(id, input),
    onSuccess: (updated) => {
      // com o e-mail alterado o token atual deixa de valer: recarregar dados causaria 401
      if (isOwnEmailChange(session, updated)) return;

      // chamados exibem os nomes de quem abriu e finalizou
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: technicianKeys.all }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.all }),
      ]);
    },
  });
}
