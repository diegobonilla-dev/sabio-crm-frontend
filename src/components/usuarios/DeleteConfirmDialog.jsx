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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useUserDependencies } from "@/hooks/usuarios/useUsers";
import { useUserMutations } from "@/hooks/usuarios/useUserMutations";

/**
 * Componente: Diálogo de confirmación para eliminar usuario
 * Verifica dependencias antes de permitir la eliminación
 *
 * @param {boolean} open - Si el diálogo está abierto
 * @param {function} onOpenChange - Callback para cambiar estado del diálogo
 * @param {object|null} user - Usuario a eliminar
 */
export default function DeleteConfirmDialog({ open, onOpenChange, user = null }) {
  const { deleteUser } = useUserMutations();

  // Consultar dependencias solo si el modal está abierto y hay usuario
  const {
    data: dependenciesData,
    isLoading: isLoadingDependencies
  } = useUserDependencies(open && user ? user._id : null);

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser.mutateAsync(user._id);
      onOpenChange(false);
    } catch (error) {
      // Los errores ya se manejan en el hook con toast
      console.error("Error al eliminar usuario:", error);
    }
  };

  const hasDependencies = dependenciesData && !dependenciesData.canDelete;
  const dependencies = dependenciesData?.dependencies;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar Usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar a{" "}
            <span className="font-semibold">{user?.name}</span> (
            {user?.email}).
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Loading de dependencias */}
        {isLoadingDependencies && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando dependencias...
          </div>
        )}

        {/* Si tiene dependencias */}
        {!isLoadingDependencies && hasDependencies && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">
                No se puede eliminar este usuario
              </p>
              <p className="text-sm">
                El usuario tiene las siguientes dependencias que deben ser
                reasignadas primero:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                {dependencies?.leads > 0 && (
                  <li>{dependencies.leads} lead(s) asignado(s)</li>
                )}
                {dependencies?.empresas > 0 && (
                  <li>{dependencies.empresas} empresa(s) como account manager</li>
                )}
                {dependencies?.fincas > 0 && (
                  <li>{dependencies.fincas} finca(s) asignada(s)</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Si NO tiene dependencias */}
        {!isLoadingDependencies && !hasDependencies && (
          <Alert>
            <AlertDescription className="text-sm">
              Esta acción no se puede deshacer. El usuario será eliminado
              permanentemente del sistema.
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUser.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={hasDependencies || isLoadingDependencies || deleteUser.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteUser.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar Usuario"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
