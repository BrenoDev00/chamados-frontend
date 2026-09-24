import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

type FormDialogFooterProps = {
  isSubmitting: boolean;
};

export function FormDialogFooter({ isSubmitting }: FormDialogFooterProps) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Cancelar
        </Button>
      </DialogClose>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" aria-hidden />
        ) : (
          <Save aria-hidden />
        )}
        Salvar
      </Button>
    </DialogFooter>
  );
}
