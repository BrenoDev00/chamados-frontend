import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { TechniciansView } from "@/features/technicians/components/technicians-view";

export const metadata: Metadata = {
  title: "Técnicos",
};

export default function TechniciansPage() {
  return (
    <>
      <PageHeader title="Técnicos" />
      <TechniciansView />
    </>
  );
}
