import type { ReactNode } from "react";

type TableCardProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function TableCard({ children, footer }: TableCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {children}
      {footer && (
        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
