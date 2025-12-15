"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFincaMutations } from "@/hooks/fincas/useFincaMutations";
import { createFincaSchema } from "@/lib/validations/finca.schema";
import axiosInstance from "@/app/lib/axios";

const tiposProduccion = ['Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate', 'Mixto', 'Otro'];

export default function FincaFormModal({ open, onOpenChange, finca }) {
  const { createFinca, updateFinca } = useFincaMutations();
  const isEditing = !!finca;
  const [empresas, setEmpresas] = useState([]);
  const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(isEditing ? createFincaSchema.partial() : createFincaSchema),
    defaultValues: {
      nombre: "",
      area: 0,
      tipo_produccion: "Ganaderia",
      municipio: "",
      departamento: "",
      vereda: "",
      coordenadas_gps: "",
      cultivo_principal: "",
      empresa_owner: "",
    },
  });

  const tipoProduccionValue = watch("tipo_produccion");

  // Cargar empresas
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setIsLoadingEmpresas(true);
        const response = await axiosInstance.get("/empresas");
        setEmpresas(response.data);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
        setEmpresas([]);
      } finally {
        setIsLoadingEmpresas(false);
      }
    };

    if (open) {
      fetchEmpresas();
    }
  }, [open]);

  useEffect(() => {
    if (finca) {
      reset({
        nombre: finca.nombre || "",
        area: finca.area || 0,
        tipo_produccion: finca.tipo_produccion || "Ganaderia",
        municipio: finca.municipio || "",
        departamento: finca.departamento || "",
        vereda: finca.vereda || "",
        coordenadas_gps: finca.coordenadas_gps || "",
        cultivo_principal: finca.cultivo_principal || "",
        empresa_owner: finca.empresa_owner?._id || finca.empresa_owner || "",
      });
    } else {
      reset({
        nombre: "",
        area: 0,
        tipo_produccion: "Ganaderia",
        municipio: "",
        departamento: "",
        vereda: "",
        coordenadas_gps: "",
        cultivo_principal: "",
        empresa_owner: "",
      });
    }
  }, [finca, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateFinca.mutateAsync({
          id: finca._id,
          ...data,
        });
      } else {
        await createFinca.mutateAsync({
          empresaId: data.empresa_owner,
          ...data,
        });
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error al guardar finca:", error);
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
            {isEditing ? "Editar Finca" : "Nueva Finca"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la finca"
              : "Completa los datos para registrar una nueva finca"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="col-span-2">
              <Label htmlFor="nombre">Nombre de la finca *</Label>
              <Input
                id="nombre"
                {...register("nombre")}
                placeholder="Ej: Finca La Esperanza"
              />
              {errors.nombre && (
                <p className="text-sm text-destructive mt-1">{errors.nombre.message}</p>
              )}
            </div>

            {/* Empresa */}
            {!isEditing && (
              <div className="col-span-2">
                <Label htmlFor="empresa_owner">Empresa *</Label>
                <Select
                  value={watch("empresa_owner")}
                  onValueChange={(value) => setValue("empresa_owner", value)}
                  disabled={isLoadingEmpresas}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingEmpresas ? "Cargando..." : "Seleccionar empresa"} />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa._id} value={empresa._id}>
                        {empresa.nombre_comercial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.empresa_owner && (
                  <p className="text-sm text-destructive mt-1">{errors.empresa_owner.message}</p>
                )}
              </div>
            )}

            {/* Tipo de producción */}
            <div>
              <Label htmlFor="tipo_produccion">Tipo de producción *</Label>
              <Select
                value={tipoProduccionValue}
                onValueChange={(value) => setValue("tipo_produccion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposProduccion.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo_produccion && (
                <p className="text-sm text-destructive mt-1">{errors.tipo_produccion.message}</p>
              )}
            </div>

            {/* Área */}
            <div>
              <Label htmlFor="area">Área (hectáreas) *</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                {...register("area", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.area && (
                <p className="text-sm text-destructive mt-1">{errors.area.message}</p>
              )}
            </div>

            {/* Cultivo principal */}
            <div>
              <Label htmlFor="cultivo_principal">Cultivo principal</Label>
              <Input
                id="cultivo_principal"
                {...register("cultivo_principal")}
                placeholder="Ej: Café, Rosas, etc."
              />
            </div>

            {/* Departamento */}
            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                {...register("departamento")}
                placeholder="Ej: Antioquia"
              />
            </div>

            {/* Municipio */}
            <div>
              <Label htmlFor="municipio">Municipio</Label>
              <Input
                id="municipio"
                {...register("municipio")}
                placeholder="Ej: Medellín"
              />
            </div>

            {/* Vereda */}
            <div>
              <Label htmlFor="vereda">Vereda</Label>
              <Input
                id="vereda"
                {...register("vereda")}
                placeholder="Ej: Santa Elena"
              />
            </div>

            {/* Coordenadas GPS */}
            <div className="col-span-2">
              <Label htmlFor="coordenadas_gps">Coordenadas GPS</Label>
              <Input
                id="coordenadas_gps"
                {...register("coordenadas_gps")}
                placeholder="Ej: 6.2442, -75.5812"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createFinca.isPending || updateFinca.isPending}
            >
              {isEditing ? "Guardar cambios" : "Crear finca"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
