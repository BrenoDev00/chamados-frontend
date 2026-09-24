import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTicket,
  deleteTicket,
  ticketKeys,
  ticketQueries,
  updateTicket,
} from "@/features/tickets/api";
import type { TicketInput } from "@/features/tickets/types";

export function useTickets(searchTerm = "") {
  return useQuery({
    ...ticketQueries.list(searchTerm),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateTickets() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ticketKeys.all });
}

export function useSaveTicket() {
  const invalidate = useInvalidateTickets();

  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: TicketInput }) =>
      id ? updateTicket(id, input) : createTicket(input),
    onSuccess: invalidate,
  });
}

// também recarrega em caso de erro (ex.: chamado já excluído por outro técnico)
export function useDeleteTicket() {
  const invalidate = useInvalidateTickets();

  return useMutation({
    mutationFn: deleteTicket,
    onSettled: invalidate,
  });
}
