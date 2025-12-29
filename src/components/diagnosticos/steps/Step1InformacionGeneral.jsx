"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { informacionGeneralSchema } from "@/lib/validations/diagnostico.schema";
import { getNomenclatura } from "@/lib/constants/nomenclatura";
import useAuthStore from "@/app/lib/store";

export default function Step1InformacionGeneral({ data, finca, onChange }) {
  const user = useAuthStore((state) => state.user);

  // Obtener nomenclatura dinámica según tipo de finca
  const nomenclatura = getNomenclatura(finca?.tipo_produccion);

  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(informacionGeneralSchema),
    defaultValues: data?.informacion_general || {}
  });

  // Precarga de datos
  useEffect(() => {
    if (finca) {
      setValue("nombre_finca", finca.nombre);
      setValue("vereda", finca.vereda || "");
      setValue("municipio", finca.municipio || "");
      setValue("departamento", finca.departamento || "");
      setValue("area_total", finca.area || "");
      setValue("coordenadas_gps", finca.coordenadas_gps || "");

      // Datos de empresa
      if (finca.empresa_owner) {
        setValue("empresa", finca.empresa_owner.nombre_comercial || "");
        setValue("nit", finca.empresa_owner.NIT || "");

        if (finca.empresa_owner.contacto_principal) {
          setValue("nombre_cliente", finca.empresa_owner.contacto_principal.nombre || "");
          setValue("telefono_cliente", finca.empresa_owner.contacto_principal.telefono || "");
        }
      }
    }

    // Técnico actual
    if (user) {
      setValue("tecnico_responsable", user.name || "");
    }

    // Fecha y hora actuales
    const now = new Date();
    setValue("fecha_visita", now.toISOString().split('T')[0]);
    setValue("hora_inicio", now.toTimeString().slice(0, 5));
  }, [finca, user, setValue]);

  // Auto-save on change
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Convertir compradores_corporativos de string a array antes de guardar
      const dataToSave = { ...formValues };
      if (dataToSave.compradores_corporativos && typeof dataToSave.compradores_corporativos === 'string') {
        dataToSave.compradores_corporativos = dataToSave.compradores_corporativos
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }

      onChange({ informacion_general: dataToSave });
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]); // Removemos onChange de las dependencias

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha visita */}
        <div>
          <Label htmlFor="fecha_visita">Fecha de visita</Label>
          <Input
            id="fecha_visita"
            type="date"
            {...register("fecha_visita")}
          />
          {errors.fecha_visita && (
            <p className="text-sm text-destructive">{errors.fecha_visita.message}</p>
          )}
        </div>

        {/* Hora inicio */}
        <div>
          <Label htmlFor="hora_inicio">Hora de inicio</Label>
          <Input
            id="hora_inicio"
            type="time"
            {...register("hora_inicio")}
          />
          {errors.hora_inicio && (
            <p className="text-sm text-destructive">{errors.hora_inicio.message}</p>
          )}
        </div>

        {/* Técnico (readonly) */}
        <div>
          <Label htmlFor="tecnico_responsable">Técnico responsable</Label>
          <Input
            id="tecnico_responsable"
            {...register("tecnico_responsable")}
            disabled
            className="bg-gray-50"
          />
        </div>

        {/* Nombre cliente (readonly) */}
        <div>
          <Label htmlFor="nombre_cliente">Nombre del cliente</Label>
          <Input
            id="nombre_cliente"
            {...register("nombre_cliente")}
            disabled
            className="bg-gray-50"
          />
        </div>

        {/* Teléfono cliente */}
        <div>
          <Label htmlFor="telefono_cliente">Teléfono/Celular del cliente</Label>
          <Input
            id="telefono_cliente"
            {...register("telefono_cliente")}
          />
        </div>

        {/* NUEVO: Nombre quien atiende */}
        <div>
          <Label htmlFor="nombre_quien_atiende">Nombre de quien atiende la visita</Label>
          <Input
            id="nombre_quien_atiende"
            placeholder="Ej: Mayordomo, Capataz, etc."
            {...register("nombre_quien_atiende")}
          />
        </div>

        {/* NUEVO: Teléfono quien atiende */}
        <div>
          <Label htmlFor="telefono_quien_atiende">Teléfono de quien atiende</Label>
          <Input
            id="telefono_quien_atiende"
            placeholder="300 123 4567"
            {...register("telefono_quien_atiende")}
          />
        </div>

        {/* Empresa (readonly) */}
        <div>
          <Label htmlFor="empresa">Empresa/Razón social</Label>
          <Input
            id="empresa"
            {...register("empresa")}
            disabled
            className="bg-gray-50"
          />
        </div>

        {/* NIT (readonly) */}
        <div>
          <Label htmlFor="nit">NIT/CC</Label>
          <Input
            id="nit"
            {...register("nit")}
            disabled
            className="bg-gray-50"
          />
        </div>

        {/* NUEVO: Caja de compensación */}
        <div>
          <Label htmlFor="caja_compensacion">Caja de compensación</Label>
          <Input
            id="caja_compensacion"
            placeholder="Ej: Compensar, Cafam, etc."
            {...register("caja_compensacion")}
          />
        </div>

        {/* Nombre finca (readonly) */}
        <div>
          <Label htmlFor="nombre_finca">Nombre de la finca</Label>
          <Input
            id="nombre_finca"
            {...register("nombre_finca")}
            disabled
            className="bg-gray-50"
          />
        </div>

        {/* NUEVO: Compradores/Corporativos - span 1 columna */}
        <div>
          <Label htmlFor="compradores_corporativos">
            Compradores/Corporativos
            <span className="text-xs text-gray-500 ml-2">(separados por comas)</span>
          </Label>
          <Textarea
            id="compradores_corporativos"
            placeholder="Ej: Alpina, Colanta, Nestlé"
            rows={2}
            {...register("compradores_corporativos")}
          />
        </div>

        {/* Vereda */}
        <div>
          <Label htmlFor="vereda">Vereda</Label>
          <Input id="vereda" {...register("vereda")} />
        </div>

        {/* Municipio */}
        <div>
          <Label htmlFor="municipio">Municipio</Label>
          <Input id="municipio" {...register("municipio")} />
        </div>

        {/* Departamento */}
        <div>
          <Label htmlFor="departamento">Departamento</Label>
          <Input id="departamento" {...register("departamento")} />
        </div>

        {/* Coordenadas GPS */}
        <div>
          <Label htmlFor="coordenadas_gps">Coordenadas GPS</Label>
          <Input
            id="coordenadas_gps"
            {...register("coordenadas_gps")}
            placeholder="-31.4167, -64.1833"
          />
        </div>

        {/* Área total */}
        <div>
          <Label htmlFor="area_total">Área total (ha)</Label>
          <Input
            id="area_total"
            type="number"
            step="0.01"
            {...register("area_total")}
          />
        </div>

        {/* Área dedicada - LABEL DINÁMICO */}
        <div>
          <Label htmlFor="area_dedicada">{nomenclatura.area_dedicada}</Label>
          <Input
            id="area_dedicada"
            type="number"
            step="0.01"
            {...register("area_dedicada")}
          />
        </div>

        {/* Área en reserva */}
        <div>
          <Label htmlFor="area_reserva">Área en reserva (ha)</Label>
          <Input
            id="area_reserva"
            type="number"
            step="0.01"
            {...register("area_reserva")}
          />
        </div>

        {/* Número divisiones - LABEL DINÁMICO */}
        <div>
          <Label htmlFor="numero_divisiones">{nomenclatura.division_primaria.label}</Label>
          <Input
            id="numero_divisiones"
            type="number"
            {...register("numero_divisiones")}
          />
        </div>

        {/* Mapas/croquis */}
        <div>
          <Label htmlFor="tiene_mapas">¿Cuenta con mapas/croquis?</Label>
          <Select
            onValueChange={(value) => setValue("tiene_mapas", value === "true")}
            defaultValue={data?.informacion_general?.tiene_mapas?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sí</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tendencia climática */}
        <div>
          <Label htmlFor="tendencia_climatica">Tendencia climática actual</Label>
          <Select
            onValueChange={(value) => setValue("tendencia_climatica", value)}
            defaultValue={data?.informacion_general?.tendencia_climatica}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lluvioso">Lluvioso</SelectItem>
              <SelectItem value="Seco">Seco</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Registros actualizados */}
        <div>
          <Label htmlFor="tiene_registros">¿Tiene registros actualizados?</Label>
          <Select
            onValueChange={(value) => setValue("tiene_registros", value === "true")}
            defaultValue={data?.informacion_general?.tiene_registros?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sí</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
