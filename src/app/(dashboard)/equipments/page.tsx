import type { Metadata } from "next";

import { EquipmentsView } from "@/features/equipments/components/equipments-view";

export const metadata: Metadata = {
  title: "Equipamentos",
};

export default function EquipmentsPage() {
  return <EquipmentsView />;
}
