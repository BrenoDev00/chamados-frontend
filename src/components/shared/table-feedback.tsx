import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

type TableSkeletonRowsProps = {
  columns: number;
  rows?: number;
};

export function TableSkeletonRows({ columns, rows = 5 }: TableSkeletonRowsProps) {
  return Array.from({ length: rows }, (_, rowIndex) => (
    <TableRow key={rowIndex}>
      {Array.from({ length: columns }, (_, columnIndex) => (
        <TableCell key={columnIndex}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

type TableMessageRowProps = {
  colSpan: number;
  children: ReactNode;
  onRetry?: () => void;
};

export function TableMessageRow({ colSpan, children, onRetry }: TableMessageRowProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-32 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          {children}
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
