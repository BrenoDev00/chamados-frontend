import { z } from "zod";

import { EQUIPMENT_TYPES } from "@/features/equipments/types";

export const equipmentFormSchema = z.object({
  location: z
    .string()
    .trim()
    .min(3, "O local/via deve ter entre 3 e 84 caracteres.")
    .max(84, "O local/via deve ter entre 3 e 84 caracteres."),
  idSefit: z
    .string()
    .trim()
    .min(3, "O ID Sefit deve ter entre 3 e 20 caracteres.")
    .max(20, "O ID Sefit deve ter entre 3 e 20 caracteres."),
  type: z.enum(EQUIPMENT_TYPES, "Selecione o tipo do equipamento."),
  serialNumber: z
    .string()
    .trim()
    .min(3, "O número de série deve ter entre 3 e 25 caracteres.")
    .max(25, "O número de série deve ter entre 3 e 25 caracteres."),
});

export type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;
