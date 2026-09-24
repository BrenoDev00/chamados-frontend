import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { Ticket, TicketInput } from "@/features/tickets/types";

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (searchTerm: string) => [...ticketKeys.all, "list", searchTerm] as const,
};

export const ticketQueries = {
  list: (searchTerm = "") =>
    queryOptions({
      queryKey: ticketKeys.list(searchTerm),
      queryFn: () =>
        apiClient.get<Ticket[]>(
          `/open-tickets?searchTerm=${encodeURIComponent(searchTerm)}`,
        ),
    }),
};

export function createTicket(input: TicketInput) {
  return apiClient.post<Ticket>("/open-tickets", input);
}

export function updateTicket(id: string, input: TicketInput) {
  return apiClient.put<Ticket>(`/open-tickets/${id}`, input);
}

export function deleteTicket(id: string) {
  return apiClient.delete(`/open-tickets/${id}`);
}
