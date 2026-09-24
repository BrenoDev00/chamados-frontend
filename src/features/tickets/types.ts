import type { EquipmentType } from "@/features/equipments/types";

export const TICKET_STATUSES = ["Em andamento", "Finalizado"] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export type Ticket = {
  id: string;
  idChamado: string;
  equipmentId: string;
  equipmentIdSefit: string;
  equipmentLocation: string;
  equipmentType: EquipmentType;
  status: TicketStatus;
  incident: string;
  startDate: string;
  startTime: string;
  endDate: string | null;
  endTime: string | null;
  observations: string | null;
  openedById: string;
  openedByName: string;
  finishedById: string | null;
  finishedByName: string | null;
};

export type TicketInput = {
  idChamado: string;
  equipmentId: string;
  status: TicketStatus;
  incident: string;
  startDate: string;
  startTime: string;
  endDate: string | null;
  endTime: string | null;
  observations: string | null;
};
