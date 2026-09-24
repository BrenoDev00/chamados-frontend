import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  createEquipment,
  deleteEquipment,
  equipmentKeys,
  equipmentQueries,
  updateEquipment,
} from "@/features/equipments/api";
import type { EquipmentFormValues } from "@/features/equipments/schemas";
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
  const { data: session } = useSession();
  const invalidate = useInvalidateEquipmentsAndTickets();

  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: EquipmentFormValues }) => {
      if (!session) throw new Error("Sessão não carregada.");

      const input = { ...values, technicianId: session.user.id };

      return id ? updateEquipment(id, input) : createEquipment(input);
    },
    onSuccess: invalidate,
  });
}

export function useDeleteEquipment() {
  const invalidate = useInvalidateEquipmentsAndTickets();

  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: invalidate,
  });
}
