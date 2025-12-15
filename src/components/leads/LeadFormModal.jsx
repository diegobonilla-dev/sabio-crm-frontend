"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeadMutations } from "@/hooks/leads/useLeadMutations";
import { createLeadSchema } from "@/lib/validations/lead.schema";

export default function LeadFormModal({ open, onOpenChange, lead }) {
  const { createLead, updateLead } = useLeadMutations();
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      empresa_nombre: "",
      contacto_nombre: "",
      email: "",
      telefono: "",
      etapa_funnel: "Nuevo",
      origen: "Otro",
      notas: "",
    },
  });

  const etapaFunnelValue = watch("etapa_funnel");
  const origenValue = watch("origen");

  useEffect(() => {
    if (lead) {
      reset({
        empresa_nombre: lead.empresa_nombre || "",
        contacto_nombre: lead.contacto_nombre || "",
        email: lead.email || "",
        telefono: lead.telefono || "",
        etapa_funnel: lead.etapa_funnel || "Nuevo",
        origen: lead.origen || "Otro",
        notas: lead.notas || "",
      });
    } else {
      reset({
        empresa_nombre: "",
        contacto_nombre: "",
        email: "",
        telefono: "",
        etapa_funnel: "Nuevo",
        origen: "Otro",
        notas: "",
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateLead.mutateAsync({
          id: lead._id,
          data,
        });
      } else {
        await createLead.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error al guardar lead:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Lead" : "Nuevo Lead"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del lead"
              : "Completa los datos para crear un nuevo prospecto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre de la empresa */}
            <div>
              <Label htmlFor="empresa_nombre">
                Nombre de la Empresa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="empresa_nombre"
                {...register("empresa_nombre")}
                placeholder="Ej: Finca La Esperanza"
              />
              {errors.empresa_nombre && (
                <p className="text-sm text-destructive mt-1">
                  {errors.empresa_nombre.message}
                </p>
              )}
            </div>

            {/* Nombre del contacto */}
            <div>
              <Label htmlFor="contacto_nombre">
                Nombre del Contacto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contacto_nombre"
                {...register("contacto_nombre")}
                placeholder="Ej: Juan Pérez"
              />
              {errors.contacto_nombre && (
                <p className="text-sm text-destructive mt-1">
                  {errors.contacto_nombre.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="telefono">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefono"
                {...register("telefono")}
                placeholder="Ej: 3001234567"
              />
              {errors.telefono && (
                <p className="text-sm text-destructive mt-1">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            {/* Etapa del Funnel */}
            <div>
              <Label htmlFor="etapa_funnel">
                Etapa del Funnel <span className="text-red-500">*</span>
              </Label>
              <Select
                value={etapaFunnelValue}
                onValueChange={(value) => setValue("etapa_funnel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nuevo">Nuevo</SelectItem>
                  <SelectItem value="Contactado">Contactado</SelectItem>
                  <SelectItem value="Cotizado">Cotizado</SelectItem>
                  <SelectItem value="Negociacion">Negociación</SelectItem>
                  <SelectItem value="Ganado">Ganado</SelectItem>
                  <SelectItem value="Perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
              {errors.etapa_funnel && (
                <p className="text-sm text-destructive mt-1">
                  {errors.etapa_funnel.message}
                </p>
              )}
            </div>

            {/* Origen */}
            <div>
              <Label htmlFor="origen">Origen</Label>
              <Select
                value={origenValue}
                onValueChange={(value) => setValue("origen", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el origen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Referido">Referido</SelectItem>
                  <SelectItem value="Llamada directa">Llamada directa</SelectItem>
                  <SelectItem value="Evento">Evento</SelectItem>
                  <SelectItem value="Redes sociales">Redes sociales</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              {...register("notas")}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createLead.isPending || updateLead.isPending}
            >
              {createLead.isPending || updateLead.isPending
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
