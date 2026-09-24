"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSaveEquipment } from "@/features/equipments/hooks";
import {
  equipmentFormSchema,
  type EquipmentFormValues,
} from "@/features/equipments/schemas";
import { EQUIPMENT_TYPES, type Equipment } from "@/features/equipments/types";
import { showErrorToast } from "@/lib/errors";

type EquipmentFormDialogProps = {
  equipment?: Equipment;
  onClose: () => void;
};

export function EquipmentFormDialog({ equipment, onClose }: EquipmentFormDialogProps) {
  const saveEquipment = useSaveEquipment();
  const isEditing = !!equipment;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      location: equipment?.location ?? "",
      idSefit: equipment?.idSefit ?? "",
      type: equipment?.type,
      serialNumber: equipment?.serialNumber ?? "",
    },
  });

  function onSubmit(values: EquipmentFormValues) {
    saveEquipment.mutate(
      { id: equipment?.id, values },
      {
        onSuccess: () => {
          toast.success(
            isEditing
              ? "Equipamento atualizado com sucesso."
              : "Equipamento cadastrado com sucesso.",
          );
          onClose();
        },
        onError: (error) =>
          showErrorToast(
            isEditing
              ? "Não foi possível atualizar o equipamento."
              : "Não foi possível cadastrar o equipamento.",
            error,
          ),
      },
    );
  }

  const isSubmitting = saveEquipment.isPending;

  return (
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Equipamento" : "Cadastrar Equipamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="contents">
          <FieldGroup>
            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="equipment-location">Local / Via</FieldLabel>
              <Input
                id="equipment-location"
                placeholder="Ex.: BR-116 Km 152 Sul"
                autoComplete="off"
                aria-invalid={!!errors.location}
                {...register("location")}
              />
              <FieldError errors={[errors.location]} />
            </Field>

            <Field data-invalid={!!errors.idSefit}>
              <FieldLabel htmlFor="equipment-id-sefit">ID Sefit</FieldLabel>
              <Input
                id="equipment-id-sefit"
                placeholder="Ex.: SFT-10294"
                autoComplete="off"
                aria-invalid={!!errors.idSefit}
                {...register("idSefit")}
              />
              <FieldError errors={[errors.idSefit]} />
            </Field>

            <Field data-invalid={!!errors.type}>
              <FieldLabel htmlFor="equipment-type">Tipo</FieldLabel>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="equipment-type"
                      className="w-full"
                      aria-invalid={!!errors.type}
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.type]} />
            </Field>

            <Field data-invalid={!!errors.serialNumber}>
              <FieldLabel htmlFor="equipment-serial-number">Número de Série</FieldLabel>
              <Input
                id="equipment-serial-number"
                placeholder="Ex.: SN-7742-9901-X"
                autoComplete="off"
                aria-invalid={!!errors.serialNumber}
                {...register("serialNumber")}
              />
              <FieldError errors={[errors.serialNumber]} />
            </Field>
          </FieldGroup>

          <FormDialogFooter isSubmitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
