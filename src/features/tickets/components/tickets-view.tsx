"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { TableCard } from "@/components/shared/table-card";
import {
  TableMessageRow,
  TableSkeletonRows,
} from "@/components/shared/table-feedback";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TicketFormDialog } from "@/features/tickets/components/ticket-form-dialog";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { useTickets } from "@/features/tickets/hooks";
import type { Ticket } from "@/features/tickets/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDate, formatTime, pluralize } from "@/lib/format";

const COLUMNS = [
  "ID Chamado",
  "ID Sefit",
  "Local/Via",
  "Tipo Equip.",
  "Status",
  "Ocorrência",
  "Data Início",
  "Hora Início",
  "Data Fim",
  "Hora Fim",
  "Aberto por",
  "Finalizado por",
  "Observações",
];

const COLUMN_COUNT = COLUMNS.length + 1;

type FormDialogState = { ticket?: Ticket } | null;

export function TicketsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim());
  const [formDialog, setFormDialog] = useState<FormDialogState>(null);

  const {
    data: tickets,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useTickets(debouncedSearchTerm);

  return (
    <>
      <PageHeader
        title="Chamados"
        actions={
          <>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por ID do chamado ou ID Sefit"
              isSearching={isFetching && !isPending}
            />
            <Button onClick={() => setFormDialog({})}>
              <Plus aria-hidden />
              Cadastrar Chamado
            </Button>
          </>
        }
      />

      <TableCard
        footer={tickets && `Mostrando ${pluralize(tickets.length, "chamado", "chamados")}`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((column, index) => (
                <TableHead key={column} className={index === 0 ? "px-4" : undefined}>
                  {column}
                </TableHead>
              ))}
              <TableHead className="px-4 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <TableSkeletonRows columns={COLUMN_COUNT} />}

            {isError && (
              <TableMessageRow colSpan={COLUMN_COUNT} onRetry={() => refetch()}>
                Não foi possível carregar os chamados.
              </TableMessageRow>
            )}

            {tickets?.length === 0 && (
              <TableMessageRow colSpan={COLUMN_COUNT}>
                {debouncedSearchTerm
                  ? "Nenhum chamado encontrado para a busca."
                  : "Nenhum chamado cadastrado."}
              </TableMessageRow>
            )}

            {tickets?.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="px-4 py-3 font-semibold">
                  #{ticket.idChamado}
                </TableCell>
                <TableCell>{ticket.equipmentIdSefit}</TableCell>
                <TableCell className="min-w-40 font-medium whitespace-normal">
                  {ticket.equipmentLocation}
                </TableCell>
                <TableCell>{ticket.equipmentType}</TableCell>
                <TableCell>
                  <TicketStatusBadge status={ticket.status} />
                </TableCell>
                <TableCell className="max-w-56 truncate" title={ticket.incident}>
                  {ticket.incident}
                </TableCell>
                <TableCell>{formatDate(ticket.startDate)}</TableCell>
                <TableCell>{formatTime(ticket.startTime)}</TableCell>
                <TableCell>{formatDate(ticket.endDate)}</TableCell>
                <TableCell>{formatTime(ticket.endTime)}</TableCell>
                <TableCell>{ticket.openedByName}</TableCell>
                <TableCell>{ticket.finishedByName ?? "—"}</TableCell>
                <TableCell
                  className="max-w-48 truncate text-muted-foreground"
                  title={ticket.observations ?? undefined}
                >
                  {ticket.observations ?? "—"}
                </TableCell>
                <TableCell className="px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar chamado ${ticket.idChamado}`}
                    onClick={() => setFormDialog({ ticket })}
                  >
                    <Pencil aria-hidden />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>

      {formDialog && (
        <TicketFormDialog
          key={formDialog.ticket?.id ?? "new"}
          ticket={formDialog.ticket}
          onClose={() => setFormDialog(null)}
        />
      )}
    </>
  );
}
