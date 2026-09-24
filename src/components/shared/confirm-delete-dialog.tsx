"use client";

import { LoaderCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemLabel?: string;
  warning?: string;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  itemLabel,
  warning,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => !isDeleting && onOpenChange(nextOpen)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir{" "}
            {itemLabel ? (
              <strong className="font-semibold text-foreground">{itemLabel}</strong>
            ) : (
              "este registro"
            )}
            ? Esta ação não pode ser desfeita.
            {warning && <span className="mt-2 block font-medium">{warning}</span>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          {/* botão comum para manter o diálogo aberto até a exclusão concluir */}
          <Button
            className="bg-red-700 text-white hover:bg-red-700/85"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <LoaderCircle className="animate-spin" aria-hidden />}
            Excluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
