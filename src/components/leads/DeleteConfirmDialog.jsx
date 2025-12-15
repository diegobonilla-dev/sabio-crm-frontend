"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLeadMutations } from "@/hooks/leads/useLeadMutations";

export default function DeleteConfirmDialog({ open, onOpenChange, lead }) {
  const { deleteLead } = useLeadMutations();

  const handleDelete = async () => {
    if (!lead) return;

    try {
      await deleteLead.mutateAsync(lead._id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al eliminar lead:", error);
    }
  };

  const isConvertido = !!lead?.empresa_convertida;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {isConvertido ? (
              <>
                No se puede eliminar el lead <strong>{lead?.empresa_nombre}</strong> porque ya fue convertido a empresa.
                <br />
                <br />
                Los leads convertidos no pueden ser eliminados para mantener el historial completo.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. Esto eliminará permanentemente el lead de{" "}
                <strong>{lead?.empresa_nombre}</strong> del sistema.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {!isConvertido && (
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLead.isPending}
            >
              {deleteLead.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
