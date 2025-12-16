"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDiagnosticoMutations } from "@/hooks/diagnosticos/useDiagnosticoMutations";

export default function DeleteConfirmDialog({ open, onOpenChange, diagnostico }) {
  const { deleteDiagnostico } = useDiagnosticoMutations();

  const handleDelete = async () => {
    if (diagnostico?._id) {
      await deleteDiagnostico.mutateAsync(diagnostico._id);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar diagnóstico?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el diagnóstico
            {diagnostico?.finca?.nombre && ` de la finca "${diagnostico.finca.nombre}"`}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
