"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { biofabricaSchema } from "@/lib/validations/diagnostico.schema";
import { CheckSquare, FileText, Camera, AlertCircle } from "lucide-react";

export default function Step7Biofabrica({ data, onChange }) {
  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(biofabricaSchema),
    defaultValues: data?.biofabrica || {
      experiencia_previa: {
        dificultades_encontradas: []
      },
      procesos_actuales: {},
      observaciones: {
        puntos_criticos: []
      }
    }
  });

  const formValues = watch();
  const tieneExperiencia = watch("experiencia_previa.tiene_experiencia");
  const dificultadesSeleccionadas = watch("experiencia_previa.dificultades_encontradas") || [];
  const puntosCriticosSeleccionados = watch("observaciones.puntos_criticos") || [];

  // Auto-guardar cambios en el formulario (con debounce)
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ biofabrica: formValues });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Manejo de checkboxes múltiples para dificultades
  const handleDificultadToggle = (dificultad) => {
    const current = dificultadesSeleccionadas;
    if (current.includes(dificultad)) {
      setValue("experiencia_previa.dificultades_encontradas", current.filter(d => d !== dificultad));
    } else {
      setValue("experiencia_previa.dificultades_encontradas", [...current, dificultad]);
    }
  };

  // Manejo de checkboxes múltiples para puntos críticos
  const handlePuntoCriticoToggle = (punto) => {
    const current = puntosCriticosSeleccionados;
    if (current.includes(punto)) {
      setValue("observaciones.puntos_criticos", current.filter(p => p !== punto));
    } else {
      setValue("observaciones.puntos_criticos", [...current, punto]);
    }
  };

  // Manejo de foto (base64)
  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("observaciones.foto_evidencia", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fotoPreview = watch("observaciones.foto_evidencia");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER */}

      {/* SECCIÓN 1: EXPERIENCIA PREVIA Y DIFICULTADES */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Experiencia Previa y Dificultades</CardTitle>
          </div>
          <CardDescription>
            Antecedentes del productor con prácticas de biofábrica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* ¿Tiene experiencia? */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
            <Label className="text-sm font-medium">
              ¿Han tenido experiencia con estos temas en el pasado?
            </Label>
            <RadioGroup
              value={tieneExperiencia !== undefined ? tieneExperiencia.toString() : ""}
              onValueChange={(val) => setValue("experiencia_previa.tiene_experiencia", val === "true")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="exp-si" />
                <Label htmlFor="exp-si" className="cursor-pointer">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="exp-no" />
                <Label htmlFor="exp-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Resultado anterior (solo si tiene experiencia) */}
          {tieneExperiencia && (
            <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Label className="text-sm font-medium">
                ¿Cómo les fue?
              </Label>
              <RadioGroup
                value={watch("experiencia_previa.resultado_anterior") || ""}
                onValueChange={(val) => setValue("experiencia_previa.resultado_anterior", val)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bien" id="resultado-bien" />
                  <Label htmlFor="resultado-bien" className="cursor-pointer font-medium text-green-700">
                    Bien
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mal" id="resultado-mal" />
                  <Label htmlFor="resultado-mal" className="cursor-pointer font-medium text-red-700">
                    Mal
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Dificultades encontradas (solo si tiene experiencia) */}
          {tieneExperiencia && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
              <Label className="text-sm font-medium">
                Dificultades encontradas (puede seleccionar varias)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-3">
                {['Tiempo', 'Costo', 'Insumos', 'Claridad', 'Disciplina', 'Ver resultados'].map((dificultad) => (
                  <div key={dificultad} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dif-${dificultad}`}
                      checked={dificultadesSeleccionadas.includes(dificultad)}
                      onCheckedChange={() => handleDificultadToggle(dificultad)}
                    />
                    <Label htmlFor={`dif-${dificultad}`} className="cursor-pointer text-sm">
                      {dificultad}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECCIÓN 2: PROCESOS Y PRÁCTICAS ACTUALES */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Procesos y Prácticas Actuales</CardTitle>
          </div>
          <CardDescription>
            Identificación de procesos implementados en la finca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Biofábrica/Compostadero */}
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
              <Checkbox
                id="tiene_biofabrica_compostadero"
                checked={watch("procesos_actuales.tiene_biofabrica_compostadero") || false}
                onCheckedChange={(checked) => setValue("procesos_actuales.tiene_biofabrica_compostadero", checked)}
              />
              <Label htmlFor="tiene_biofabrica_compostadero" className="cursor-pointer font-medium">
                Biofábrica, Compostadero o Criadero de Microbios
              </Label>
            </div>

            {/* Lombricultivo */}
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
              <Checkbox
                id="tiene_lombricultivo"
                checked={watch("procesos_actuales.tiene_lombricultivo") || false}
                onCheckedChange={(checked) => setValue("procesos_actuales.tiene_lombricultivo", checked)}
              />
              <Label htmlFor="tiene_lombricultivo" className="cursor-pointer font-medium">
                Lombricultivo
              </Label>
            </div>

            {/* Fermentos */}
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
              <Checkbox
                id="tiene_fermentos"
                checked={watch("procesos_actuales.tiene_fermentos") || false}
                onCheckedChange={(checked) => setValue("procesos_actuales.tiene_fermentos", checked)}
              />
              <Label htmlFor="tiene_fermentos" className="cursor-pointer font-medium">
                Fermentos
              </Label>
            </div>

            {/* Bokashi */}
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
              <Checkbox
                id="tiene_bokashi"
                checked={watch("procesos_actuales.tiene_bokashi") || false}
                onCheckedChange={(checked) => setValue("procesos_actuales.tiene_bokashi", checked)}
              />
              <Label htmlFor="tiene_bokashi" className="cursor-pointer font-medium">
                Bokashi
              </Label>
            </div>

            {/* Compostaje */}
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
              <Checkbox
                id="tiene_compostaje"
                checked={watch("procesos_actuales.tiene_compostaje") || false}
                onCheckedChange={(checked) => setValue("procesos_actuales.tiene_compostaje", checked)}
              />
              <Label htmlFor="tiene_compostaje" className="cursor-pointer font-medium">
                Compostaje
              </Label>
            </div>

            {/* Cultivos de Microbios */}
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
              <Checkbox
                id="tiene_cultivos_microbios"
                checked={watch("procesos_actuales.tiene_cultivos_microbios") || false}
                onCheckedChange={(checked) => setValue("procesos_actuales.tiene_cultivos_microbios", checked)}
              />
              <Label htmlFor="tiene_cultivos_microbios" className="cursor-pointer font-medium">
                Cultivos de Microbios Específicos (MEM)
              </Label>
            </div>
          </div>

          {/* Infraestructura */}
          <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg border border-green-300">
            <Checkbox
              id="ha_invertido_infraestructura"
              checked={watch("procesos_actuales.ha_invertido_infraestructura") || false}
              onCheckedChange={(checked) => setValue("procesos_actuales.ha_invertido_infraestructura", checked)}
            />
            <Label htmlFor="ha_invertido_infraestructura" className="cursor-pointer font-semibold text-green-900">
              Han invertido en infraestructura
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 3: OBSERVACIONES Y EVIDENCIA */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Observaciones y Evidencia</CardTitle>
          </div>
          <CardDescription>
            Detalle del proceso observado y evaluación técnica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Detalle del proceso */}
          <div>
            <Label htmlFor="detalle_proceso_observado" className="text-sm font-medium">
              Detalle del Proceso Observado
            </Label>
            <Textarea
              id="detalle_proceso_observado"
              placeholder="Ej: Organizado y tecnificado. Cuenta con infraestructura para escalar proceso a toda la finca..."
              {...register("observaciones.detalle_proceso_observado")}
              className="mt-1 min-h-[120px]"
            />
          </div>

          {/* Grid de evaluaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nivel de organización */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
              <Label className="text-sm font-medium">
                Nivel de organización/tecnificación
              </Label>
              <RadioGroup
                value={watch("observaciones.nivel_organizacion_tecnificacion") || ""}
                onValueChange={(val) => setValue("observaciones.nivel_organizacion_tecnificacion", val)}
                className="space-y-2"
              >
                {['Artesanal', 'Básico', 'Organizado', 'Tecnificado'].map((nivel) => (
                  <div key={nivel} className="flex items-center space-x-2">
                    <RadioGroupItem value={nivel} id={`org-${nivel}`} />
                    <Label htmlFor={`org-${nivel}`} className="cursor-pointer text-sm">
                      {nivel}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Nivel de registro */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
              <Label className="text-sm font-medium">
                Nivel de registro
              </Label>
              <RadioGroup
                value={watch("observaciones.nivel_registro") || ""}
                onValueChange={(val) => setValue("observaciones.nivel_registro", val)}
                className="space-y-2"
              >
                {['No hay', 'Poco en papel', 'Se monitorea constante', 'Digital'].map((nivel) => (
                  <div key={nivel} className="flex items-center space-x-2">
                    <RadioGroupItem value={nivel} id={`reg-${nivel}`} />
                    <Label htmlFor={`reg-${nivel}`} className="cursor-pointer text-sm">
                      {nivel}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Potencial de escalabilidad */}
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Label className="text-sm font-medium text-blue-900">
                Potencial de crecimiento/escalabilidad
              </Label>
              <RadioGroup
                value={watch("observaciones.potencial_escalabilidad") || ""}
                onValueChange={(val) => setValue("observaciones.potencial_escalabilidad", val)}
                className="flex gap-4"
              >
                {['Bajo', 'Medio', 'Alto'].map((nivel) => (
                  <div key={nivel} className="flex items-center space-x-2">
                    <RadioGroupItem value={nivel} id={`esc-${nivel}`} />
                    <Label htmlFor={`esc-${nivel}`} className="cursor-pointer font-medium">
                      {nivel}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Puntos críticos */}
            <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <Label className="text-sm font-medium text-red-900">
                Puntos críticos identificados
              </Label>
              <div className="space-y-2">
                {['Calidad de agua', 'Tiempo de proceso', 'Calidad de insumos', 'Otros'].map((punto) => (
                  <div key={punto} className="flex items-center space-x-2">
                    <Checkbox
                      id={`critico-${punto}`}
                      checked={puntosCriticosSeleccionados.includes(punto)}
                      onCheckedChange={() => handlePuntoCriticoToggle(punto)}
                    />
                    <Label htmlFor={`critico-${punto}`} className="cursor-pointer text-sm">
                      {punto}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidencia visual */}
          <div className="space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-indigo-600" />
              <Label className="text-sm font-medium text-indigo-900">
                Evidencia (Foto / Video)
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Foto */}
              <div>
                <Label htmlFor="foto_evidencia" className="text-sm">
                  Foto de evidencia
                </Label>
                <Input
                  id="foto_evidencia"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="mt-1"
                />
                {fotoPreview && (
                  <div className="mt-2">
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Video (URL) */}
              <div>
                <Label htmlFor="video_evidencia" className="text-sm">
                  URL de video (opcional)
                </Label>
                <Input
                  id="video_evidencia"
                  type="url"
                  placeholder="https://youtube.com/..."
                  {...register("observaciones.video_evidencia")}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
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
