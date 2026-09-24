"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { SearchInput } from "@/components/shared/search-input";
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
import { EquipmentFormDialog } from "@/features/equipments/components/equipment-form-dialog";
import { useDeleteEquipment, useEquipments } from "@/features/equipments/hooks";
import type { Equipment } from "@/features/equipments/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { pluralize } from "@/lib/format";

const COLUMN_COUNT = 5;

type FormDialogState = { equipment?: Equipment } | null;

export function EquipmentsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim());
  const [formDialog, setFormDialog] = useState<FormDialogState>(null);

  const { data, isPending, isError, isFetching, refetch } =
    useEquipments(debouncedSearchTerm);
  const equipmentDeletion = useDeleteConfirmation<Equipment>(useDeleteEquipment(), {
    success: "Equipamento excluído com sucesso.",
    error: "Não foi possível excluir o equipamento.",
  });

  return (
    <>
      <PageHeader
        title="Equipamentos"
        actions={
          <>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por ID Sefit ou local/via"
              isSearching={isFetching && !isPending}
            />
            <Button onClick={() => setFormDialog({})}>
              <Plus aria-hidden />
              Cadastrar Equipamento
            </Button>
          </>
        }
      />

      <TableCard
        footer={data && `Mostrando ${pluralize(data.total, "equipamento", "equipamentos")}`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Local / Via</TableHead>
              <TableHead>ID Sefit</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Número de Série</TableHead>
              <TableHead className="px-4 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <TableSkeletonRows columns={COLUMN_COUNT} />}

            {isError && !data && (
              <TableMessageRow colSpan={COLUMN_COUNT} onRetry={() => refetch()}>
                Não foi possível carregar os equipamentos.
              </TableMessageRow>
            )}

            {data?.items.length === 0 && (
              <TableMessageRow colSpan={COLUMN_COUNT}>
                {debouncedSearchTerm
                  ? "Nenhum equipamento encontrado para a busca."
                  : "Nenhum equipamento cadastrado."}
              </TableMessageRow>
            )}

            {data?.items.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                      <MapPin className="size-3.5" aria-hidden />
                    </span>
                    <span className="font-medium whitespace-normal">
                      {equipment.location}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{equipment.idSefit}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{equipment.type}</Badge>
                </TableCell>
                <TableCell className="font-medium">{equipment.serialNumber}</TableCell>
                <TableCell className="px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Editar equipamento ${equipment.idSefit}`}
                      onClick={() => setFormDialog({ equipment })}
                    >
                      <Pencil aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      aria-label={`Excluir equipamento ${equipment.idSefit}`}
                      onClick={() => equipmentDeletion.request(equipment)}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>

      {formDialog && (
        <EquipmentFormDialog
          key={formDialog.equipment?.id ?? "new"}
          equipment={formDialog.equipment}
          onClose={() => setFormDialog(null)}
        />
      )}

      <ConfirmDeleteDialog
        open={!!equipmentDeletion.target}
        onOpenChange={(open) => !open && equipmentDeletion.cancel()}
        onConfirm={equipmentDeletion.confirm}
        isDeleting={equipmentDeletion.isDeleting}
        itemLabel={
          equipmentDeletion.target
            ? `o equipamento ${equipmentDeletion.target.idSefit}`
            : undefined
        }
        warning="Os chamados vinculados a este equipamento também serão excluídos."
      />
    </>
  );
}
