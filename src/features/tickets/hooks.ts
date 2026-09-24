import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTicket,
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

export function useSaveTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: TicketInput }) =>
      id ? updateTicket(id, input) : createTicket(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ticketKeys.all }),
  });
}
