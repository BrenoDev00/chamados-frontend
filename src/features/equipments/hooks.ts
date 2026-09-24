import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createEquipment,
  deleteEquipment,
  equipmentKeys,
  equipmentQueries,
  updateEquipment,
} from "@/features/equipments/api";
import type { EquipmentInput } from "@/features/equipments/types";
import { ticketKeys } from "@/features/tickets/api";

export function useEquipments(searchTerm = "") {
  return useQuery({
    ...equipmentQueries.list(searchTerm),
    placeholderData: keepPreviousData,
  });
}

// chamados exibem dados do equipamento e são excluídos junto com ele
function useInvalidateEquipmentsAndTickets() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all }),
      queryClient.invalidateQueries({ queryKey: ticketKeys.all }),
    ]);
}

export function useSaveEquipment() {
  const invalidate = useInvalidateEquipmentsAndTickets();

  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: EquipmentInput }) =>
      id ? updateEquipment(id, input) : createEquipment(input),
    onSuccess: invalidate,
  });
}

// também recarrega em caso de erro (ex.: equipamento já excluído por outro técnico)
export function useDeleteEquipment() {
  const invalidate = useInvalidateEquipmentsAndTickets();

  return useMutation({
    mutationFn: deleteEquipment,
    onSettled: invalidate,
  });
}
