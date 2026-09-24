import type { Metadata } from "next";

import { TicketsView } from "@/features/tickets/components/tickets-view";

export const metadata: Metadata = {
  title: "Chamados",
};

export default function TicketsPage() {
  return <TicketsView />;
}
