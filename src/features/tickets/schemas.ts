import { z } from "zod";

import { TICKET_STATUSES, type TicketInput } from "@/features/tickets/types";

export const ticketFormSchema = z
  .object({
    idChamado: z
      .string()
      .trim()
      .min(1, "Informe o ID do chamado.")
      .max(255, "O ID do chamado deve ter no máximo 255 caracteres."),
    equipmentId: z.string().min(1, "Selecione o equipamento."),
    status: z.enum(TICKET_STATUSES, "Selecione o status."),
    incident: z
      .string()
      .trim()
      .min(3, "A ocorrência deve ter entre 3 e 84 caracteres.")
      .max(84, "A ocorrência deve ter entre 3 e 84 caracteres."),
    startDate: z.string().min(1, "Informe a data de início."),
    startTime: z.string().min(1, "Informe a hora de início."),
    endDate: z.string(),
    endTime: z.string(),
    observations: z
      .string()
      .trim()
      .max(84, "As observações devem ter no máximo 84 caracteres."),
  })
  .superRefine((values, context) => {
    if (values.status !== "Finalizado") return;

    if (!values.endDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Informe a data de fim para finalizar.",
      });
    }

    if (!values.endTime) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "Informe a hora de fim para finalizar.",
      });
    }

    const start = `${values.startDate}T${values.startTime}`;
    const end = `${values.endDate}T${values.endTime}`;

    if (values.endDate && values.endTime && end < start) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "O fim deve ser posterior ao início.",
      });
    }
  });

export type TicketFormValues = z.infer<typeof ticketFormSchema>;

export function toTicketInput(values: TicketFormValues): TicketInput {
  const isFinished = values.status === "Finalizado";

  return {
    ...values,
    endDate: isFinished ? values.endDate : null,
    endTime: isFinished ? values.endTime : null,
    observations: values.observations || null,
  };
}
