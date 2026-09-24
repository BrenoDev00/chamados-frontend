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

export function useEquipments(searchTerm = "") {
  return useQuery({
    ...equipmentQueries.list(searchTerm),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateEquipments() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
}

export function useSaveEquipment() {
  const { data: session } = useSession();
  const invalidate = useInvalidateEquipments();

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
  const invalidate = useInvalidateEquipments();

  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: invalidate,
  });
}
