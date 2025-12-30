"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sostenibilidadSchema } from "@/lib/validations/diagnostico.schema";
import { Lightbulb, Target, Microscope, Settings } from "lucide-react";

export default function Step6Sostenibilidad({ data, onChange }) {
  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(sostenibilidadSchema),
    defaultValues: data?.sostenibilidad || {}
  });

  const formValues = watch();
  const conocePracticasRegenerativas = watch("conoce_practicas_regenerativas");
  const haParticipadoProyectos = watch("ha_participado_proyectos_sostenibles");
  const cuentaAsistencia = watch("cuenta_asistencia_tecnica");

  // Auto-save on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ sostenibilidad: formValues });
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER */}

      {/* SECCIÓN 1: CONOCIMIENTO Y EXPERIENCIA */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Conocimiento y Experiencia</CardTitle>
          </div>
          <CardDescription>
            Prácticas regenerativas y proyectos sostenibles previos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Prácticas Regenerativas */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="conoce_practicas_regenerativas"
                checked={conocePracticasRegenerativas || false}
                onCheckedChange={(checked) => setValue("conoce_practicas_regenerativas", checked)}
              />
              <Label htmlFor="conoce_practicas_regenerativas" className="cursor-pointer font-medium">
                ¿Conoce prácticas regenerativas?
              </Label>
            </div>

            {conocePracticasRegenerativas && (
              <div className="pl-6 border-l-4 border-green-400">
                <Label htmlFor="cuales_practicas_regenerativas" className="text-sm">
                  ¿Cuáles prácticas conoce?
                </Label>
                <Input
                  id="cuales_practicas_regenerativas"
                  type="text"
                  placeholder="Ej: Compostaje, rotación de cultivos, cobertura vegetal..."
                  {...register("cuales_practicas_regenerativas")}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Proyectos Sostenibles */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ha_participado_proyectos_sostenibles"
                checked={haParticipadoProyectos || false}
                onCheckedChange={(checked) => setValue("ha_participado_proyectos_sostenibles", checked)}
              />
              <Label htmlFor="ha_participado_proyectos_sostenibles" className="cursor-pointer font-medium">
                ¿Ha participado en proyectos sostenibles?
              </Label>
            </div>

            {haParticipadoProyectos && (
              <div className="pl-6 border-l-4 border-green-400">
                <Label htmlFor="cuales_proyectos_sostenibles" className="text-sm">
                  ¿En cuáles proyectos?
                </Label>
                <Input
                  id="cuales_proyectos_sostenibles"
                  type="text"
                  placeholder="Ej: Certificación orgánica, conservación de agua, agroforestería..."
                  {...register("cuales_proyectos_sostenibles")}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: APERTURA E INTERÉS */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Apertura e Interés en Innovación</CardTitle>
          </div>
          <CardDescription>
            Disposición hacia nuevas tecnologías y aprendizaje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Interés en Innovaciones */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
            <Label className="text-sm font-medium">
              ¿Tiene interés en innovaciones?
            </Label>
            <RadioGroup
              value={watch("interes_innovaciones") || ""}
              onValueChange={(val) => setValue("interes_innovaciones", val)}
              className="space-y-2"
            >
              {['Sí', 'No', 'Parcial'].map((opcion) => (
                <div key={opcion} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcion} id={`interes-${opcion}`} />
                  <Label htmlFor={`interes-${opcion}`} className="cursor-pointer">
                    {opcion}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Consulta Experiencias */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
            <Label className="text-sm font-medium">
              ¿Pregunta por experiencias de otras fincas?
            </Label>
            <RadioGroup
              value={watch("pregunta_experiencias_otras_fincas") !== undefined
                ? watch("pregunta_experiencias_otras_fincas").toString()
                : ""}
              onValueChange={(val) => setValue("pregunta_experiencias_otras_fincas", val === "true")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="experiencias-si" />
                <Label htmlFor="experiencias-si" className="cursor-pointer">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="experiencias-no" />
                <Label htmlFor="experiencias-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Asistencia Técnica */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cuenta_asistencia_tecnica"
                checked={cuentaAsistencia || false}
                onCheckedChange={(checked) => setValue("cuenta_asistencia_tecnica", checked)}
              />
              <Label htmlFor="cuenta_asistencia_tecnica" className="cursor-pointer font-medium">
                ¿Cuenta con asistencia técnica?
              </Label>
            </div>

            {cuentaAsistencia && (
              <div className="pl-6 border-l-4 border-blue-400">
                <Label htmlFor="proveedor_asistencia" className="text-sm">
                  Proveedor de asistencia técnica
                </Label>
                <Input
                  id="proveedor_asistencia"
                  type="text"
                  placeholder="Ej: ICA, Fedegán, consultor privado..."
                  {...register("proveedor_asistencia")}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 3: METAS Y VISIÓN */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Metas y Visión de la Finca</CardTitle>
          </div>
          <CardDescription>
            Objetivos y dirección futura del productor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Metas/Visión */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
            <Label className="text-sm font-medium">
              Metas/visión para la finca
            </Label>
            <RadioGroup
              value={watch("metas_vision_finca") || ""}
              onValueChange={(val) => setValue("metas_vision_finca", val)}
              className="space-y-2"
            >
              {['Ninguna definida', 'Productividad', 'Regeneración', 'Sucesión familiar'].map((opcion) => (
                <div key={opcion} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcion} id={`metas-${opcion}`} />
                  <Label htmlFor={`metas-${opcion}`} className="cursor-pointer">
                    {opcion}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 4: ACTITUD Y TECNIFICACIÓN */}
      <Card className="border-amber-200">
        <CardHeader className="bg-amber-50">
          <div className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Actitud y Nivel Tecnológico</CardTitle>
          </div>
          <CardDescription>
            Perspectiva hacia la ciencia del suelo y estado tecnológico de la finca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Actitud hacia Microbiología */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
            <Label className="text-sm font-medium">
              Actitud hacia microbiología del suelo
            </Label>
            <RadioGroup
              value={watch("actitud_microbiologia_suelo") || ""}
              onValueChange={(val) => setValue("actitud_microbiologia_suelo", val)}
              className="space-y-2"
            >
              {['Abierto', 'Escéptico', 'Entusiasta'].map((opcion) => (
                <div key={opcion} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcion} id={`actitud-${opcion}`} />
                  <Label htmlFor={`actitud-${opcion}`} className="cursor-pointer">
                    {opcion}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Nivel de Tecnificación */}
          <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-amber-600" />
              <Label className="text-sm font-medium">
                Nivel de tecnificación de la finca
              </Label>
            </div>
            <RadioGroup
              value={watch("nivel_tecnificacion") || ""}
              onValueChange={(val) => setValue("nivel_tecnificacion", val)}
              className="flex gap-6"
            >
              {['Bajo', 'Medio', 'Alto'].map((opcion) => (
                <div key={opcion} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcion} id={`tecnif-${opcion}`} />
                  <Label htmlFor={`tecnif-${opcion}`} className="cursor-pointer font-medium">
                    {opcion}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
