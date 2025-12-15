"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useLeadMutations } from "@/hooks/leads/useLeadMutations";
import { convertLeadSchema } from "@/lib/validations/lead.schema";

export default function ConvertirLeadModal({ open, onOpenChange, lead }) {
  const { convertirLead } = useLeadMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(convertLeadSchema),
    defaultValues: {
      nit: "",
      razon_social: "",
      password: "",
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        nit: "",
        razon_social: lead.empresa_nombre || "",
        password: "",
      });
    } else {
      reset({
        nit: "",
        razon_social: "",
        password: "",
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data) => {
    try {
      await convertirLead.mutateAsync({
        leadId: lead._id,
        ...data,
      });
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error al convertir lead:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Convertir Lead a Cliente</DialogTitle>
          <DialogDescription>
            Convierte el lead <strong>{lead.empresa_nombre}</strong> en un cliente activo del sistema
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Esto creará una nueva <strong>Empresa</strong> y un <strong>Usuario</strong> con rol "Cliente Owner" para {lead.contacto_nombre}.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Información del Lead (solo lectura) */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-xs text-gray-600">Empresa</Label>
              <p className="text-sm font-medium">{lead.empresa_nombre}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Contacto</Label>
              <p className="text-sm font-medium">{lead.contacto_nombre}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Email</Label>
              <p className="text-sm font-medium">{lead.email}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Teléfono</Label>
              <p className="text-sm font-medium">{lead.telefono}</p>
            </div>
          </div>

          {/* NIT */}
          <div>
            <Label htmlFor="nit">
              NIT <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nit"
              {...register("nit")}
              placeholder="Ej: 900123456-7"
            />
            {errors.nit && (
              <p className="text-sm text-destructive mt-1">
                {errors.nit.message}
              </p>
            )}
          </div>

          {/* Razón Social */}
          <div>
            <Label htmlFor="razon_social">
              Razón Social (opcional)
            </Label>
            <Input
              id="razon_social"
              {...register("razon_social")}
              placeholder="Si es diferente del nombre comercial"
            />
            <p className="text-xs text-gray-500 mt-1">
              Por defecto se usará: {lead.empresa_nombre}
            </p>
            {errors.razon_social && (
              <p className="text-sm text-destructive mt-1">
                {errors.razon_social.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <Label htmlFor="password">
              Contraseña para el Usuario <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Mínimo 6 caracteres"
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta será la contraseña de acceso para {lead.contacto_nombre}
            </p>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={convertirLead.isPending}
            >
              {convertirLead.isPending ? "Convirtiendo..." : "Convertir a Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
