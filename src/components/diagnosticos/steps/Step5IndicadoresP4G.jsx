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
import { indicadoresP4GSchema } from "@/lib/validations/diagnostico.schema";
import { Scale, Users } from "lucide-react";

export default function Step5IndicadoresP4G({ data, onChange }) {
  // Clase CSS para ocultar spin buttons en inputs numéricos
  const numberInputClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(indicadoresP4GSchema),
    defaultValues: data?.indicadores_p4g || {
      resiliencia_percibida: {},
      impacto_social_genero: {
        genera_nuevos_empleos: false
      }
    }
  });

  const formValues = watch();
  const generaNuevosEmpleos = watch("impacto_social_genero.genera_nuevos_empleos");

  // Auto-guardar cambios en el formulario (con debounce)
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ indicadores_p4g: formValues });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Componente para radio buttons de escala 1-5
  const EscalaResiliencia = ({ name, label, description }) => {
    const value = watch(name);

    return (
      <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Muy bajo</span>
          <RadioGroup
            value={value?.toString() || ""}
            onValueChange={(val) => setValue(name, parseInt(val))}
            className="flex gap-4"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex flex-col items-center gap-1">
                <RadioGroupItem value={num.toString()} id={`${name}-${num}`} />
                <Label
                  htmlFor={`${name}-${num}`}
                  className="text-xs cursor-pointer"
                >
                  {num}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <span className="text-xs text-muted-foreground">Muy alto</span>
        </div>
      </div>
    );
  };

  // Componente para NPS (escala 0-10)
  const NPSScale = () => {
    const value = watch("impacto_social_genero.probabilidad_recomendar_sabio");

    return (
      <div className="space-y-3 p-4 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-lg border">
        <div>
          <Label className="text-sm font-medium">
            En escala 0-10, ¿qué tan probable es que recomiende SaBio?
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            0 = Nada probable, 10 = Extremadamente probable
          </p>
        </div>

        <div className="flex items-center justify-between gap-1">
          <RadioGroup
            value={value?.toString() || ""}
            onValueChange={(val) => setValue("impacto_social_genero.probabilidad_recomendar_sabio", parseInt(val))}
            className="flex gap-2 flex-wrap justify-center"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div key={num} className="flex flex-col items-center gap-1">
                <RadioGroupItem value={num.toString()} id={`nps-${num}`} />
                <Label
                  htmlFor={`nps-${num}`}
                  className="text-xs cursor-pointer font-medium"
                >
                  {num}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* SECCIÓN A: RESILIENCIA PERCIBIDA */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Resiliencia Percibida</CardTitle>
          </div>
          <CardDescription>
            Evalúe la percepción del productor sobre su capacidad de adaptación y resiliencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <EscalaResiliencia
            name="resiliencia_percibida.preparacion_cambios_climaticos"
            label="¿Qué tan preparado se siente para enfrentar sequías, lluvias excesivas u otros cambios climáticos?"
          />

          <EscalaResiliencia
            name="resiliencia_percibida.conocimientos_manejo_sostenible"
            label="¿Qué tan seguro se siente de sus conocimientos para manejar su finca de manera sostenible?"
          />

          <EscalaResiliencia
            name="resiliencia_percibida.capacidad_recuperacion_clima_extremo"
            label="Si su finca sufriera daños por clima extremo, ¿qué tan rápido cree que se recuperaría?"
          />

          <EscalaResiliencia
            name="resiliencia_percibida.estabilidad_economica_inversion"
            label="¿Qué tan estable considera su situación económica para invertir en mejoras de la finca?"
          />
        </CardContent>
      </Card>

      {/* SECCIÓN B: IMPACTO SOCIAL Y DE GÉNERO */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Impacto Social y de Género</CardTitle>
          </div>
          <CardDescription>
            Información sobre la toma de decisiones, beneficiarios y potencial de generación de empleo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Toma de Decisiones */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
            <Label className="text-sm font-medium">
              ¿Quién toma las decisiones principales de la finca?
            </Label>
            <RadioGroup
              value={watch("impacto_social_genero.quien_toma_decisiones") || ""}
              onValueChange={(val) => setValue("impacto_social_genero.quien_toma_decisiones", val)}
              className="space-y-2"
            >
              {['Solo hombres', 'Solo mujeres', 'Conjunto hombre-mujer', 'Otros'].map((opcion) => (
                <div key={opcion} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcion} id={`decision-${opcion}`} />
                  <Label htmlFor={`decision-${opcion}`} className="cursor-pointer">
                    {opcion}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Beneficiarios Directos SaBio */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-sm text-blue-900">Beneficiarios Directos del Programa SaBio</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hombres_beneficiarios_directos_sabio" className="text-sm">
                  Hombres beneficiarios directos SaBio
                </Label>
                <Input
                  id="hombres_beneficiarios_directos_sabio"
                  type="number"
                  min="0"
                  className={`mt-1 ${numberInputClass}`}
                  {...register("impacto_social_genero.hombres_beneficiarios_directos_sabio")}
                />
              </div>

              <div>
                <Label htmlFor="mujeres_beneficiarias_directas_sabio" className="text-sm">
                  Mujeres beneficiarias directas SaBio
                </Label>
                <Input
                  id="mujeres_beneficiarias_directas_sabio"
                  type="number"
                  min="0"
                  className={`mt-1 ${numberInputClass}`}
                  {...register("impacto_social_genero.mujeres_beneficiarias_directas_sabio")}
                />
              </div>
            </div>
          </div>

          {/* Trabajadores de la Empresa */}
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-sm text-green-900">Personas que Trabajan en la Empresa</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hombres_trabajadores_empresa" className="text-sm">
                  Hombres que trabajan en la empresa
                </Label>
                <Input
                  id="hombres_trabajadores_empresa"
                  type="number"
                  min="0"
                  className={`mt-1 ${numberInputClass}`}
                  {...register("impacto_social_genero.hombres_trabajadores_empresa")}
                />
              </div>

              <div>
                <Label htmlFor="mujeres_trabajadoras_empresa" className="text-sm">
                  Mujeres que trabajan en la empresa
                </Label>
                <Input
                  id="mujeres_trabajadoras_empresa"
                  type="number"
                  min="0"
                  className={`mt-1 ${numberInputClass}`}
                  {...register("impacto_social_genero.mujeres_trabajadoras_empresa")}
                />
              </div>
            </div>
          </div>

          {/* Beneficiarios Indirectos */}
          <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-sm text-amber-900">Beneficiarios Indirectos</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hombres_beneficiarios_indirectos" className="text-sm">
                  Hombres beneficiarios indirectos
                </Label>
                <Input
                  id="hombres_beneficiarios_indirectos"
                  type="number"
                  min="0"
                  className={`mt-1 ${numberInputClass}`}
                  {...register("impacto_social_genero.hombres_beneficiarios_indirectos")}
                />
              </div>

              <div>
                <Label htmlFor="mujeres_beneficiarias_indirectas" className="text-sm">
                  Mujeres beneficiarias indirectas
                </Label>
                <Input
                  id="mujeres_beneficiarias_indirectas"
                  type="number"
                  min="0"
                  className={`mt-1 ${numberInputClass}`}
                  {...register("impacto_social_genero.mujeres_beneficiarias_indirectas")}
                />
              </div>
            </div>
          </div>

          {/* Generación de Nuevos Empleos */}
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="genera_nuevos_empleos"
                checked={generaNuevosEmpleos}
                onCheckedChange={(checked) => setValue("impacto_social_genero.genera_nuevos_empleos", checked)}
              />
              <Label htmlFor="genera_nuevos_empleos" className="cursor-pointer font-medium">
                ¿El programa SaBio podría generar nuevos empleos?
              </Label>
            </div>

            {generaNuevosEmpleos && (
              <div className="space-y-4 pl-6 border-l-4 border-purple-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="empleos_masculinos_nuevos" className="text-sm">
                      Empleos masculinos nuevos
                    </Label>
                    <Input
                      id="empleos_masculinos_nuevos"
                      type="number"
                      min="0"
                      className={`mt-1 ${numberInputClass}`}
                      {...register("impacto_social_genero.empleos_masculinos_nuevos")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="empleos_femeninos_nuevos" className="text-sm">
                      Empleos femeninos nuevos
                    </Label>
                    <Input
                      id="empleos_femeninos_nuevos"
                      type="number"
                      min="0"
                      className={`mt-1 ${numberInputClass}`}
                      {...register("impacto_social_genero.empleos_femeninos_nuevos")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tipo_empleos_nuevos" className="text-sm">
                    ¿Qué tipo de empleos serían?
                  </Label>
                  <Input
                    id="tipo_empleos_nuevos"
                    type="text"
                    placeholder="Ej: Operarios agrícolas, técnicos, administradores..."
                    {...register("impacto_social_genero.tipo_empleos_nuevos")}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* NPS - Net Promoter Score */}
          <div className="space-y-4">
            <NPSScale />

            <div>
              <Label htmlFor="razon_calificacion" className="text-sm">
                ¿Por qué dio esta calificación?
              </Label>
              <Textarea
                id="razon_calificacion"
                placeholder="Explique brevemente las razones de su calificación..."
                {...register("impacto_social_genero.razon_calificacion")}
                className="mt-1 min-h-[100px]"
              />
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
