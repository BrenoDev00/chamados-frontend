"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { TableCard } from "@/components/shared/table-card";
import {
  TableMessageRow,
  TableSkeletonRows,
} from "@/components/shared/table-feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TechnicianFormDialog } from "@/features/technicians/components/technician-form-dialog";
import { useTechnicians } from "@/features/technicians/hooks";
import type { Technician } from "@/features/technicians/types";

const COLUMN_COUNT = 4;

export function TechniciansView() {
  const { data: technicians, isPending, isError, refetch } = useTechnicians();
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);

  return (
    <>
      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead className="px-4 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <TableSkeletonRows columns={COLUMN_COUNT} rows={4} />}

            {isError && (
              <TableMessageRow colSpan={COLUMN_COUNT} onRetry={() => refetch()}>
                Não foi possível carregar os técnicos.
              </TableMessageRow>
            )}

            {technicians?.map((technician) => (
              <TableRow key={technician.id}>
                <TableCell className="px-4 py-3 font-medium">
                  {technician.name}
                </TableCell>
                <TableCell>{technician.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-md">
                    {technician.shift}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar ${technician.name}`}
                    onClick={() => setEditingTechnician(technician)}
                  >
                    <Pencil aria-hidden />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>

      {editingTechnician && (
        <TechnicianFormDialog
          key={editingTechnician.id}
          technician={editingTechnician}
          onClose={() => setEditingTechnician(null)}
        />
      )}
    </>
  );
}
