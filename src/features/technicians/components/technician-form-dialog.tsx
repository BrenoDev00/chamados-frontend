"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { FormDialogFooter } from "@/components/shared/form-dialog-footer";
import {
  Dialog,
  DialogContent,
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
import { routes } from "@/config/routes";
import {
  isOwnEmailChange,
  useUpdateTechnician,
} from "@/features/technicians/hooks";
import {
  technicianFormSchema,
  type TechnicianFormValues,
} from "@/features/technicians/schemas";
import { TECHNICIAN_SHIFTS, type Technician } from "@/features/technicians/types";
import { showErrorToast } from "@/lib/errors";

type TechnicianFormDialogProps = {
  technician: Technician;
  onClose: () => void;
};

export function TechnicianFormDialog({
  technician,
  onClose,
}: TechnicianFormDialogProps) {
  const { data: session } = useSession();
  const updateTechnician = useUpdateTechnician();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TechnicianFormValues>({
    resolver: zodResolver(technicianFormSchema),
    defaultValues: {
      name: technician.name,
      email: technician.email,
      shift: technician.shift,
    },
  });

  function onSubmit(values: TechnicianFormValues) {
    updateTechnician.mutate(
      { id: technician.id, input: values },
      {
        onSuccess: async (updated) => {
          if (isOwnEmailChange(session, updated)) {
            toast.info("Seu e-mail foi alterado. Entre novamente com o novo e-mail.");
            await signOut({ callbackUrl: routes.login });
            return;
          }

          toast.success("Técnico atualizado com sucesso.");
          onClose();
        },
        onError: (error) => showErrorToast("Não foi possível atualizar o técnico.", error),
      },
    );
  }

  const isSubmitting = updateTechnician.isPending;

  return (
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar técnico</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="contents">
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="technician-name">Nome</FieldLabel>
              <Input
                id="technician-name"
                autoComplete="off"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="technician-email">E-mail</FieldLabel>
              <Input
                id="technician-email"
                type="email"
                autoComplete="off"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.shift}>
              <FieldLabel htmlFor="technician-shift">Turno</FieldLabel>
              <Controller
                control={control}
                name="shift"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="technician-shift"
                      className="w-full"
                      aria-invalid={!!errors.shift}
                    >
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {TECHNICIAN_SHIFTS.map((shift) => (
                        <SelectItem key={shift} value={shift}>
                          {shift}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.shift]} />
            </Field>
          </FieldGroup>

          <FormDialogFooter isSubmitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
