import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  technicianKeys,
  technicianQueries,
  updateTechnician,
} from "@/features/technicians/api";
import type { TechnicianInput } from "@/features/technicians/types";

export function useTechnicians() {
  return useQuery(technicianQueries.list());
}

export function useUpdateTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TechnicianInput }) =>
      updateTechnician(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: technicianKeys.all }),
  });
}
