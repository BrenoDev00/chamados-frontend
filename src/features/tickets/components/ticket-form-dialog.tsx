"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FormDialogFooter } from "@/components/shared/form-dialog-footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEquipments } from "@/features/equipments/hooks";
import { useSaveTicket } from "@/features/tickets/hooks";
import {
  ticketFormSchema,
  toTicketInput,
  type TicketFormValues,
} from "@/features/tickets/schemas";
import {
  TICKET_STATUSES,
  type Ticket,
  type TicketStatus,
} from "@/features/tickets/types";
import { getCurrentDateTimeInputValues } from "@/lib/date";
import { showErrorToast } from "@/lib/errors";
import { formatTime } from "@/lib/format";

type TicketFormDialogProps = {
  ticket?: Ticket;
  onClose: () => void;
};

function getDefaultValues(ticket?: Ticket): TicketFormValues {
  if (ticket) {
    return {
      idChamado: ticket.idChamado,
      equipmentId: ticket.equipmentId,
      status: ticket.status,
      incident: ticket.incident,
      startDate: ticket.startDate,
      startTime: formatTime(ticket.startTime),
      endDate: ticket.endDate ?? "",
      endTime: ticket.endTime ? formatTime(ticket.endTime) : "",
      observations: ticket.observations ?? "",
    };
  }

  const now = getCurrentDateTimeInputValues();

  return {
    idChamado: "",
    equipmentId: "",
    status: "Em andamento",
    incident: "",
    startDate: now.date,
    startTime: now.time,
    endDate: "",
    endTime: "",
    observations: "",
  };
}

export function TicketFormDialog({ ticket, onClose }: TicketFormDialogProps) {
  const isEditing = !!ticket;
  const saveTicket = useSaveTicket();
  const { data: equipmentList, isPending: isLoadingEquipments } = useEquipments();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: getDefaultValues(ticket),
  });

  const isFinished = useWatch({ control, name: "status" }) === "Finalizado";

  function handleStatusChange(status: TicketStatus) {
    setValue("status", status);

    if (status === "Finalizado") {
      const now = getCurrentDateTimeInputValues();
      if (!getValues("endDate")) setValue("endDate", now.date);
      if (!getValues("endTime")) setValue("endTime", now.time);
      return;
    }

    setValue("endDate", "");
    setValue("endTime", "");
    clearErrors(["endDate", "endTime"]);
  }

  function onSubmit(values: TicketFormValues) {
    saveTicket.mutate(
      { id: ticket?.id, input: toTicketInput(values) },
      {
        onSuccess: () => {
          toast.success(
            isEditing ? "Chamado atualizado com sucesso." : "Chamado cadastrado com sucesso.",
          );
          onClose();
        },
        onError: (error) =>
          showErrorToast(
            isEditing
              ? "Não foi possível atualizar o chamado."
              : "Não foi possível cadastrar o chamado.",
            error,
          ),
      },
    );
  }

  const isSubmitting = saveTicket.isPending;
  const equipments = equipmentList?.items ?? [];
  const equipmentPlaceholder = isLoadingEquipments
    ? "Carregando equipamentos..."
    : equipments.length === 0
      ? "Nenhum equipamento cadastrado"
      : "Selecione um equipamento";

  return (
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Chamado" : "Adicionar Chamado"}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do chamado para registrar a ocorrência.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="contents">
          <FieldGroup>
            <Field data-invalid={!!errors.idChamado}>
              <FieldLabel htmlFor="ticket-id-chamado">ID Chamado</FieldLabel>
              <Input
                id="ticket-id-chamado"
                placeholder="Ex.: CH-2026-001"
                autoComplete="off"
                aria-invalid={!!errors.idChamado}
                {...register("idChamado")}
              />
              <FieldError errors={[errors.idChamado]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.equipmentId}>
                <FieldLabel htmlFor="ticket-equipment">Equipamento</FieldLabel>
                <Controller
                  control={control}
                  name="equipmentId"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={equipments.length === 0}
                    >
                      <SelectTrigger
                        id="ticket-equipment"
                        className="w-full"
                        aria-invalid={!!errors.equipmentId}
                      >
                        <SelectValue placeholder={equipmentPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {equipments.map((equipment) => (
                          <SelectItem key={equipment.id} value={equipment.id}>
                            {equipment.idSefit} — {equipment.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.equipmentId]} />
              </Field>

              <Field data-invalid={!!errors.status}>
                <FieldLabel htmlFor="ticket-status">Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={handleStatusChange}>
                      <SelectTrigger
                        id="ticket-status"
                        className="w-full"
                        aria-invalid={!!errors.status}
                      >
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.status]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.incident}>
              <FieldLabel htmlFor="ticket-incident">Ocorrência</FieldLabel>
              <Textarea
                id="ticket-incident"
                rows={3}
                placeholder="Descreva o problema reportado..."
                aria-invalid={!!errors.incident}
                {...register("incident")}
              />
              <FieldError errors={[errors.incident]} />
            </Field>

            <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/40 p-3 sm:grid-cols-4">
              <Field data-invalid={!!errors.startDate}>
                <FieldLabel htmlFor="ticket-start-date">Data Início</FieldLabel>
                <Input
                  id="ticket-start-date"
                  type="date"
                  aria-invalid={!!errors.startDate}
                  {...register("startDate")}
                />
                <FieldError errors={[errors.startDate]} />
              </Field>

              <Field data-invalid={!!errors.startTime}>
                <FieldLabel htmlFor="ticket-start-time">Hora Início</FieldLabel>
                <Input
                  id="ticket-start-time"
                  type="time"
                  aria-invalid={!!errors.startTime}
                  {...register("startTime")}
                />
                <FieldError errors={[errors.startTime]} />
              </Field>

              <Field data-invalid={!!errors.endDate} data-disabled={!isFinished}>
                <FieldLabel htmlFor="ticket-end-date">Data Fim</FieldLabel>
                <Input
                  id="ticket-end-date"
                  type="date"
                  disabled={!isFinished}
                  aria-invalid={!!errors.endDate}
                  {...register("endDate")}
                />
                <FieldError errors={[errors.endDate]} />
              </Field>

              <Field data-invalid={!!errors.endTime} data-disabled={!isFinished}>
                <FieldLabel htmlFor="ticket-end-time">Hora Fim</FieldLabel>
                <Input
                  id="ticket-end-time"
                  type="time"
                  disabled={!isFinished}
                  aria-invalid={!!errors.endTime}
                  {...register("endTime")}
                />
                <FieldError errors={[errors.endTime]} />
              </Field>

              {!isFinished && (
                <p className="col-span-full text-xs text-muted-foreground">
                  Data e hora de fim ficam disponíveis ao alterar o status para
                  Finalizado.
                </p>
              )}
            </div>

            <Field data-invalid={!!errors.observations}>
              <FieldLabel htmlFor="ticket-observations">Observações</FieldLabel>
              <Textarea
                id="ticket-observations"
                rows={2}
                placeholder="Notas adicionais sobre o atendimento..."
                aria-invalid={!!errors.observations}
                {...register("observations")}
              />
              <FieldError errors={[errors.observations]} />
            </Field>
          </FieldGroup>

          <FormDialogFooter isSubmitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
