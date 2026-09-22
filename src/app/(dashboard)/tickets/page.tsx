import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Chamados",
};

export default function TicketsPage() {
  return <PageHeader title="Chamados" />;
}
