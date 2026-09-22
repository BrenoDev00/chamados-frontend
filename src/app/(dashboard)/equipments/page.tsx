import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Equipamentos",
};

export default function EquipmentsPage() {
  return <PageHeader title="Equipamentos" />;
}
