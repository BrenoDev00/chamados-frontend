import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Técnicos",
};

export default function TechniciansPage() {
  return <PageHeader title="Técnicos" />;
}
