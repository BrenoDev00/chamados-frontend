import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z
    .string()
    .min(5, "A senha deve ter entre 5 e 20 caracteres.")
    .max(20, "A senha deve ter entre 5 e 20 caracteres."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
