"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCorporativoMutations } from "@/hooks/corporativos/useCorporativoMutations";
import { createCorporativoSchema } from "@/lib/validations/corporativo.schema";

export default function CorporativoFormModal({ open, onOpenChange, corporativo }) {
  const { createCorporativo, updateCorporativo } = useCorporativoMutations();
  const isEditing = !!corporativo;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createCorporativoSchema),
    defaultValues: {
      nombre: "",
      tipo: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (corporativo) {
      reset({
        nombre: corporativo.nombre || "",
        tipo: corporativo.tipo || "",
        descripcion: corporativo.descripcion || "",
      });
    } else {
      reset({
        nombre: "",
        tipo: "",
        descripcion: "",
      });
    }
  }, [corporativo, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateCorporativo.mutateAsync({
          id: corporativo._id,
          data,
        });
      } else {
        await createCorporativo.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error al guardar corporativo:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Corporativo" : "Nuevo Corporativo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del corporativo"
              : "Completa los datos para crear un nuevo corporativo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              {...register("nombre")}
              placeholder="Ej: COLANTA"
            />
            {errors.nombre && (
              <p className="text-sm text-destructive mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Input
              id="tipo"
              {...register("tipo")}
              placeholder="Ej: Cooperativa Lechera, Procesador, etc."
            />
            {errors.tipo && (
              <p className="text-sm text-destructive mt-1">
                {errors.tipo.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              {...register("descripcion")}
              placeholder="Breve descripción del corporativo..."
              rows={3}
            />
            {errors.descripcion && (
              <p className="text-sm text-destructive mt-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createCorporativo.isPending || updateCorporativo.isPending}
            >
              {createCorporativo.isPending || updateCorporativo.isPending
                ? "Guardando..."
                : isEditing
                ? "Actualizar"
                : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
