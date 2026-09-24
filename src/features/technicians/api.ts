import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { Technician, TechnicianInput } from "@/features/technicians/types";

export const technicianKeys = {
  all: ["technicians"] as const,
};

export const technicianQueries = {
  list: () =>
    queryOptions({
      queryKey: technicianKeys.all,
      queryFn: () => apiClient.get<Technician[]>("/technicians"),
    }),
};

export function updateTechnician(id: string, input: TechnicianInput) {
  return apiClient.put<Technician>(`/technicians/${id}`, input);
}
