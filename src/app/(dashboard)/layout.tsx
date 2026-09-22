import type { CSSProperties } from "react";
import { Cog } from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <SidebarProvider style={{ "--sidebar-width": "13rem" } as CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center gap-2 border-b px-4 py-3 md:hidden">
          <SidebarTrigger />
          <Cog className="size-5" aria-hidden />
          <span className="font-semibold">Chamados</span>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
