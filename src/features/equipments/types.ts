export const EQUIPMENT_TYPES = ["WIM", "OCR"] as const;

export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export type Equipment = {
  id: string;
  location: string;
  idSefit: string;
  type: EquipmentType;
  serialNumber: string;
  technicianId: string;
};

export type EquipmentList = {
  total: number;
  items: Equipment[];
};

export type EquipmentInput = Omit<Equipment, "id">;
