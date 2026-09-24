import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type {
  Equipment,
  EquipmentInput,
  EquipmentList,
} from "@/features/equipments/types";

export const equipmentKeys = {
  all: ["equipments"] as const,
  list: (searchTerm: string) => [...equipmentKeys.all, "list", searchTerm] as const,
};

export const equipmentQueries = {
  list: (searchTerm = "") =>
    queryOptions({
      queryKey: equipmentKeys.list(searchTerm),
      queryFn: () =>
        apiClient.get<EquipmentList>(
          `/equipments?searchTerm=${encodeURIComponent(searchTerm)}`,
        ),
    }),
};

export function createEquipment(input: EquipmentInput) {
  return apiClient.post<Equipment>("/equipments", input);
}

export function updateEquipment(id: string, input: EquipmentInput) {
  return apiClient.put<Equipment>(`/equipments/${id}`, input);
}

export function deleteEquipment(id: string) {
  return apiClient.delete(`/equipments/${id}`);
}
