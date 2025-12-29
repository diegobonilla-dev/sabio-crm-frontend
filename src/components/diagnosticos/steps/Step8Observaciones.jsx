"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { observacionesSeguimientoSchema } from "@/lib/validations/diagnostico.schema";
import { FileText, ClipboardList, Calendar, TestTube, Camera, Plus, Trash2 } from "lucide-react";

export default function Step8Observaciones({ data, onChange }) {
  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(observacionesSeguimientoSchema),
    defaultValues: data?.observaciones_seguimiento || {
      medidas_control: [{ descripcion: "" }],
      recomendaciones: [{ descripcion: "" }],
      muestras_suelo_lotes: []
    }
  });

  const formValues = watch();
  const medidasControl = watch("medidas_control") || [{ descripcion: "" }];
  const recomendaciones = watch("recomendaciones") || [{ descripcion: "" }];

  // Obtener lotes del Paso 4 (Manejo de Cultivo/Pastoreo)
  const [lotesDisponibles, setLotesDisponibles] = useState([]);

  useEffect(() => {
    // Extraer lotes del paso 4 según el tipo de diagnóstico
    const lotes = [];

    // Para Ganadería
    if (data?.datos_ganaderia?.manejo_pastoreo?.lotes_evaluados) {
      data.datos_ganaderia.manejo_pastoreo.lotes_evaluados.forEach(lote => {
        lotes.push(lote.nombre_lote);
      });
    }

    // Para Frutales
    if (data?.datos_frutales?.manejo_cultivo?.lotes_evaluados) {
      data.datos_frutales.manejo_cultivo.lotes_evaluados.forEach(lote => {
        lotes.push(lote.nombre_lote);
      });
    }

    // Para Flores
    if (data?.datos_flores?.manejo_cultivo?.bloques_evaluados) {
      data.datos_flores.manejo_cultivo.bloques_evaluados.forEach(bloque => {
        lotes.push(bloque.nombre_bloque);
      });
    }

    setLotesDisponibles(lotes);

    // Inicializar checkboxes de muestras si no existen
    if (!formValues.muestras_suelo_lotes || formValues.muestras_suelo_lotes.length === 0) {
      const muestrasIniciales = lotes.map(nombreLote => ({
        nombre_lote: nombreLote,
        seleccionado: false
      }));
      setValue("muestras_suelo_lotes", muestrasIniciales);
    }
  }, [data, formValues.muestras_suelo_lotes, setValue]);

  // Auto-save on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ observaciones_seguimiento: formValues });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Funciones para manejar medidas de control
  const agregarMedidaControl = () => {
    if (medidasControl.length < 10) {
      setValue("medidas_control", [...medidasControl, { descripcion: "" }]);
    }
  };

  const eliminarMedidaControl = (index) => {
    if (medidasControl.length > 1) {
      const nuevasMedidas = medidasControl.filter((_, i) => i !== index);
      setValue("medidas_control", nuevasMedidas);
    }
  };

  // Funciones para manejar recomendaciones
  const agregarRecomendacion = () => {
    if (recomendaciones.length < 10) {
      setValue("recomendaciones", [...recomendaciones, { descripcion: "" }]);
    }
  };

  const eliminarRecomendacion = (index) => {
    if (recomendaciones.length > 1) {
      const nuevasRecomendaciones = recomendaciones.filter((_, i) => i !== index);
      setValue("recomendaciones", nuevasRecomendaciones);
    }
  };

  // Manejo de checkboxes de muestras de suelo
  const handleMuestraSueloToggle = (nombreLote) => {
    const muestras = formValues.muestras_suelo_lotes || [];
    const nuevasMuestras = muestras.map(muestra => {
      if (muestra.nombre_lote === nombreLote) {
        return { ...muestra, seleccionado: !muestra.seleccionado };
      }
      return muestra;
    });
    setValue("muestras_suelo_lotes", nuevasMuestras);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          Observaciones y Seguimiento
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Registro de observaciones técnicas, medidas de control, recomendaciones y plan de seguimiento
        </p>
      </div>

      {/* SECCIÓN 1: OBSERVACIONES TÉCNICAS */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Observaciones Técnicas</CardTitle>
          </div>
          <CardDescription>
            Registre las observaciones realizadas durante la visita técnica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Observaciones técnicas durante la visita */}
          <div>
            <Label htmlFor="observaciones_tecnicas_visita" className="text-sm font-medium">
              Observaciones técnicas durante la visita
            </Label>
            <Textarea
              id="observaciones_tecnicas_visita"
              placeholder="Describa las observaciones técnicas relevantes realizadas durante la visita..."
              {...register("observaciones_tecnicas_visita")}
              className="mt-1 min-h-[120px]"
            />
          </div>

          {/* Síntomas visibles adicionales */}
          <div>
            <Label htmlFor="sintomas_visibles_adicionales" className="text-sm font-medium">
              Síntomas visibles adicionales
            </Label>
            <Textarea
              id="sintomas_visibles_adicionales"
              placeholder="Describa síntomas o condiciones adicionales observadas en el cultivo o los animales..."
              {...register("sintomas_visibles_adicionales")}
              className="mt-1 min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: MEDIDAS DE CONTROL Y RECOMENDACIONES */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Medidas de Control y Recomendaciones</CardTitle>
          </div>
          <CardDescription>
            Acciones correctivas y recomendaciones para el productor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Medidas de Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Medidas de Control</Label>
              {medidasControl.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={agregarMedidaControl}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar medida
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {medidasControl.map((medida, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Medida de control ${index + 1}`}
                      {...register(`medidas_control.${index}.descripcion`)}
                      className="w-full"
                    />
                  </div>
                  {medidasControl.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarMedidaControl(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Recomendaciones</Label>
              {recomendaciones.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={agregarRecomendacion}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar recomendación
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {recomendaciones.map((recomendacion, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Recomendación ${index + 1}`}
                      {...register(`recomendaciones.${index}.descripcion`)}
                      className="w-full"
                    />
                  </div>
                  {recomendaciones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarRecomendacion(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 3: PRÓXIMA VISITA */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Próxima Visita Programada</CardTitle>
          </div>
          <CardDescription>
            Programación del seguimiento
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="max-w-xs">
            <Label htmlFor="proxima_visita_programada" className="text-sm font-medium">
              Fecha de la próxima visita
            </Label>
            <Input
              id="proxima_visita_programada"
              type="date"
              {...register("proxima_visita_programada")}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 4: MUESTRAS ENVIADAS A LABORATORIO */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Muestras Enviadas a Laboratorio</CardTitle>
          </div>
          <CardDescription>
            Seleccione las muestras tomadas durante la visita
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Muestras de suelo por lote */}
          {lotesDisponibles.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Muestras de Suelo por Lote/Bloque</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formValues.muestras_suelo_lotes?.map((muestra, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
                    <Checkbox
                      id={`muestra-suelo-${index}`}
                      checked={muestra.seleccionado || false}
                      onCheckedChange={() => handleMuestraSueloToggle(muestra.nombre_lote)}
                    />
                    <Label htmlFor={`muestra-suelo-${index}`} className="cursor-pointer text-sm">
                      Suelo - {muestra.nombre_lote}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Otras muestras */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Otras Muestras</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
                <Checkbox
                  id="muestra_forraje"
                  checked={watch("muestra_forraje") || false}
                  onCheckedChange={(checked) => setValue("muestra_forraje", checked)}
                />
                <Label htmlFor="muestra_forraje" className="cursor-pointer text-sm">
                  Forraje
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
                <Checkbox
                  id="muestra_agua"
                  checked={watch("muestra_agua") || false}
                  onCheckedChange={(checked) => setValue("muestra_agua", checked)}
                />
                <Label htmlFor="muestra_agua" className="cursor-pointer text-sm">
                  Agua
                </Label>
              </div>
            </div>
          </div>

          {/* Información de las muestras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo_muestras" className="text-sm font-medium">
                Código de muestras
              </Label>
              <Input
                id="codigo_muestras"
                type="text"
                placeholder="Ej: SAB-001, SAB-002..."
                {...register("codigo_muestras")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="analisis_requeridos" className="text-sm font-medium">
                Análisis requeridos
              </Label>
              <Textarea
                id="analisis_requeridos"
                placeholder="Ej: pH, materia orgánica, nitrógeno..."
                {...register("analisis_requeridos")}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 5: FOTOGRAFÍAS Y ARCHIVOS */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">Fotografías y Archivos</CardTitle>
          </div>
          <CardDescription>
            Documentación visual y enlaces de referencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="fotografias_tomadas_descripcion" className="text-sm font-medium">
              Fotografías tomadas: Describa cantidad y tipo
            </Label>
            <Textarea
              id="fotografias_tomadas_descripcion"
              placeholder="Ej: 5 fotos del cultivo, 3 fotos del sistema de riego, 2 fotos de plagas observadas..."
              {...register("fotografias_tomadas_descripcion")}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="links_archivos" className="text-sm font-medium">
              Links / Archivos
            </Label>
            <Textarea
              id="links_archivos"
              placeholder="Agregue enlaces a archivos en la nube, fotos, videos, etc..."
              {...register("links_archivos")}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 6: OBSERVACIONES DEL PRODUCTOR */}
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg">Observaciones del Productor</CardTitle>
          </div>
          <CardDescription>
            Comentarios, inquietudes o aportes del productor
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Textarea
            id="observaciones_productor"
            placeholder="Registre las observaciones, preocupaciones o comentarios expresados por el productor durante la visita..."
            {...register("observaciones_productor")}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Información de Errores */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">
              Por favor, corrija los errores en el formulario antes de continuar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
