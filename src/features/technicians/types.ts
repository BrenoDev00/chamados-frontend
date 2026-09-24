export const TECHNICIAN_SHIFTS = ["Diurno", "Noturno"] as const;

export type TechnicianShift = (typeof TECHNICIAN_SHIFTS)[number];

export type Technician = {
  id: string;
  name: string;
  email: string;
  shift: TechnicianShift;
};

export type TechnicianInput = Omit<Technician, "id">;
