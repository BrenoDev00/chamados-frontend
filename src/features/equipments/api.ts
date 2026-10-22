import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type {
  Equipment,
  EquipmentInput,
  EquipmentList,
} from "@/features/equipments/types";

// mesmo tamanho padrão da API, enviado explicitamente para o cálculo de páginas
export const EQUIPMENTS_PAGE_SIZE = 30;
// o select do formulário de chamados precisa de todos os equipamentos em uma única
// requisição (limite padrão do Spring Data é 2000 itens por página)
const EQUIPMENT_OPTIONS_SIZE = 1000;

function fetchEquipments(searchTerm: string, page: number, size: number) {
  const params = new URLSearchParams({
    searchTerm,
    page: String(page),
    size: String(size),
  });

  return apiClient.get<EquipmentList>(`/equipments?${params}`);
}

export const equipmentKeys = {
  all: ["equipments"] as const,
  list: (searchTerm: string, page: number) =>
    [...equipmentKeys.all, "list", { searchTerm, page }] as const,
  options: () => [...equipmentKeys.all, "options"] as const,
};

export const equipmentQueries = {
  list: (searchTerm: string, page: number) =>
    queryOptions({
      queryKey: equipmentKeys.list(searchTerm, page),
      queryFn: () => fetchEquipments(searchTerm, page, EQUIPMENTS_PAGE_SIZE),
    }),
  options: () =>
    queryOptions({
      queryKey: equipmentKeys.options(),
      queryFn: () => fetchEquipments("", 0, EQUIPMENT_OPTIONS_SIZE),
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
