import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { Ticket, TicketInput, TicketList } from "@/features/tickets/types";

// mesmo tamanho padrão da API, enviado explicitamente para o cálculo de páginas
export const TICKETS_PAGE_SIZE = 20;

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (searchTerm: string, page: number) =>
    [...ticketKeys.all, "list", { searchTerm, page }] as const,
};

export const ticketQueries = {
  list: (searchTerm: string, page: number) =>
    queryOptions({
      queryKey: ticketKeys.list(searchTerm, page),
      queryFn: () => {
        const params = new URLSearchParams({
          searchTerm,
          page: String(page),
          size: String(TICKETS_PAGE_SIZE),
        });

        return apiClient.get<TicketList>(`/open-tickets?${params}`);
      },
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
