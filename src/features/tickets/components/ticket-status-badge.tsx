import { Badge } from "@/components/ui/badge";
import type { TicketStatus } from "@/features/tickets/types";
import { cn } from "@/lib/utils";

const statusDotClassNames: Record<TicketStatus, string> = {
  "Em andamento": "bg-amber-400",
  Finalizado: "bg-emerald-400",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className={cn("size-1.5 rounded-full", statusDotClassNames[status])}
        aria-hidden
      />
      {status}
    </Badge>
  );
}
