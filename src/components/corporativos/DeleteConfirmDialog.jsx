"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCorporativoMutations } from "@/hooks/corporativos/useCorporativoMutations";

export default function DeleteConfirmDialog({ open, onOpenChange, corporativo }) {
  const { deleteCorporativo } = useCorporativoMutations();

  const handleDelete = async () => {
    if (!corporativo) return;

    try {
      await deleteCorporativo.mutateAsync(corporativo._id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al eliminar corporativo:", error);
    }
  };

  const hasFincasAsociadas = corporativo?.fincas_asociadas?.length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {hasFincasAsociadas ? (
              <>
                No se puede eliminar el corporativo <strong>{corporativo?.nombre}</strong> porque tiene{" "}
                <strong>{corporativo?.fincas_asociadas?.length}</strong> finca(s) asociada(s).
                <br />
                <br />
                Por favor, desasocia las fincas antes de eliminar el corporativo.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. Esto eliminará permanentemente el corporativo{" "}
                <strong>{corporativo?.nombre}</strong> del sistema.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {!hasFincasAsociadas && (
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCorporativo.isPending}
            >
              {deleteCorporativo.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
