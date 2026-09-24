import { z } from "zod";

import { TECHNICIAN_SHIFTS } from "@/features/technicians/types";

export const technicianFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter entre 3 e 64 caracteres.")
    .max(64, "O nome deve ter entre 3 e 64 caracteres."),
  email: z.email("Informe um e-mail válido."),
  shift: z.enum(TECHNICIAN_SHIFTS, "Selecione o turno."),
});

export type TechnicianFormValues = z.infer<typeof technicianFormSchema>;
