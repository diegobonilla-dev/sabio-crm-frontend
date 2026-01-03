"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { manejoPastoreoSchema } from "@/lib/validations/diagnostico.schema";
import { Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import ImageUploadPreview from "@/components/common/ImageUploadPreview";
import { useAutoSave } from "@/hooks/useAutoSave";

/**
 * Paso 4: Manejo de Pastoreo y Forrajes - Ganadería
 *
 * Estructura:
 * - Sección A: Información General (toda la finca)
 * - Sección B: Evaluación por Lotes/Potreros (acordeón)
 */
export default function Step4Ganaderia({ data, onChange }) {
  const [activeLoteIndex, setActiveLoteIndex] = useState(null);

  const {
    register,
    control,
    setValue,
    watch,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(manejoPastoreoSchema),
    defaultValues: data?.datos_ganaderia?.manejo_pastoreo || {
      general: {
        finca_hace_aforo: false,
        metodo_aforo: 'Visual',
        tipo_pastoreo: 'Continuo',
        especies_pasto: [],
        cobertura_general: 'Media',
        uniformidad_general: 'Buena'
      },
      cuantos_lotes_evaluados: 0,
      lotes_evaluados: []
    }
  });

  // Watches para condicionales
  const tipoPastoreo = watch("general.tipo_pastoreo");
  const fincaHaceAforo = watch("general.finca_hace_aforo");

  // Arrays dinámicos - Sección General
  const { fields: especiesPasto, append: appendEspecie, remove: removeEspecie } = useFieldArray({
    control,
    name: "general.especies_pasto"
  });

  // Arrays dinámicos - Lotes Evaluados
  const { fields: lotesEvaluados, append: appendLote, remove: removeLote } = useFieldArray({
    control,
    name: "lotes_evaluados"
  });

  // Sincronizar con datos al montar el componente
  useEffect(() => {
    if (data?.datos_ganaderia?.manejo_pastoreo) {
      reset(data.datos_ganaderia.manejo_pastoreo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Auto-guardar cambios en el formulario (con debounce, sin loops)
  const formValues = watch();
  useAutoSave(
    (values) => onChange({
      datos_ganaderia: {
        manejo_pastoreo: values
      }
    }),
    formValues,
    300
  );

  // Handlers
  const handleAddEspeciePasto = () => {
    if (especiesPasto.length < 3) {
      appendEspecie({
        especie: "",
        orden: especiesPasto.length + 1
      });
    }
  };

  const handleAddLote = () => {
    const newLote = {
      nombre_lote: `Potrero ${lotesEvaluados.length + 1}`,
      area_m2: 0,
      topografia: 'Plano',
      mediciones_forraje: {
        se_realizaron: true,
        hora_muestreo_ms: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        hora_muestreo_brix_ph: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      },
      puntos_muestreo: [],
      plagas_enfermedades: [
        { nombre: 'Collaria', nivel_dano: 'sin_dano' },
        { nombre: 'Lorito verde', nivel_dano: 'sin_dano' },
        { nombre: 'Gusano ejército', nivel_dano: 'sin_dano' },
        { nombre: 'Blissus', nivel_dano: 'sin_dano' },
        { nombre: 'Mión/Salivazo', nivel_dano: 'sin_dano' },
        { nombre: 'Helminthosporium', nivel_dano: 'sin_dano' }
      ]
    };
    appendLote(newLote);
    setActiveLoteIndex(lotesEvaluados.length);
  };

  const toggleLote = (index) => {
    setActiveLoteIndex(activeLoteIndex === index ? null : index);
  };

  const isLoteComplete = (index) => {
    const lote = getValues(`lotes_evaluados.${index}`);
    return lote?.nombre_lote && lote.nombre_lote.trim() !== "";
  };

  return (
    <div className="space-y-8">
      {/* ===================================== */}
      {/* SECCIÓN A: INFORMACIÓN GENERAL       */}
      {/* ===================================== */}
      <div className="bg-blue-50/30 border border-blue-200 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <span>🌱</span> Información General de Pastoreo
        </h3>
        <p className="text-sm text-muted-foreground">
          Información agregada de toda la finca
        </p>

        {/* Método de Aforo */}
        <div className="space-y-4 p-4 bg-white rounded-lg border">
          <h4 className="font-medium text-blue-900">Método de Aforo</h4>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={fincaHaceAforo}
              onCheckedChange={(checked) => setValue("general.finca_hace_aforo", checked)}
            />
            <Label>¿La finca hace aforo?</Label>
          </div>

          {fincaHaceAforo && (
            <div>
              <Label>Método de aforo</Label>
              <Select
                value={watch("general.metodo_aforo")}
                onValueChange={(value) => setValue("general.metodo_aforo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Platómetro">Platómetro</SelectItem>
                  <SelectItem value="Visual">Visual</SelectItem>
                  <SelectItem value="Corte y peso">Corte y peso</SelectItem>
                  <SelectItem value="Bastón de aforo">Bastón de aforo</SelectItem>
                  <SelectItem value="No se hace en la finca">No se hace en la finca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Sistema de Pastoreo */}
        <div className="space-y-4 p-4 bg-white rounded-lg border">
          <h4 className="font-medium text-blue-900">Sistema de Pastoreo</h4>

          <div>
            <Label>Tipo de pastoreo</Label>
            <RadioGroup
              value={tipoPastoreo}
              onValueChange={(value) => setValue("general.tipo_pastoreo", value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Rotacional" id="rotacional" />
                <Label htmlFor="rotacional">Rotacional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Continuo" id="continuo" />
                <Label htmlFor="continuo">Continuo</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Campos condicionales si es Rotacional */}
          {tipoPastoreo === 'Rotacional' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-blue-50/50 rounded border border-blue-200">
              <div>
                <Label>Período de rotación promedio (días)</Label>
                <Input
                  type="number"
                  min="0"
                  {...register("general.periodo_rotacion_dias")}
                  placeholder="Ej: 30"
                />
              </div>
              <div>
                <Label>Período de ocupación promedio (días)</Label>
                <Input
                  type="number"
                  min="0"
                  {...register("general.periodo_ocupacion_dias")}
                  placeholder="Ej: 1"
                />
              </div>
              <div>
                <Label>Franja de pastoreo diaria (m²)</Label>
                <Input
                  type="number"
                  min="0"
                  {...register("general.franja_pastoreo_m2")}
                  placeholder="Opcional"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ℹ️ Puede calcularse automáticamente en programas
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Especies de Pasto Predominante */}
        <div className="space-y-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Especies de Pasto Predominante</h4>
              <p className="text-xs text-muted-foreground">
                💡 Inventario rápido visual desde vehículo (máximo 3)
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddEspeciePasto}
              disabled={especiesPasto.length >= 3}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Especie
            </Button>
          </div>

          {especiesPasto.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Especie {index + 1}</Label>
                <Input
                  {...register(`general.especies_pasto.${index}.especie`)}
                  placeholder="Ej: Brachiaria, Kikuyo, etc."
                />
              </div>
              <Button
                type="button"
                onClick={() => removeEspecie(index)}
                size="icon"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {especiesPasto.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay especies agregadas. Click en &quot;Agregar Especie&quot;
            </p>
          )}
        </div>

        {/* Condiciones Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
          <div>
            <Label>Cobertura general</Label>
            <RadioGroup
              value={watch("general.cobertura_general")}
              onValueChange={(value) => setValue("general.cobertura_general", value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Alta" id="cob-alta" />
                <Label htmlFor="cob-alta">Alta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Media" id="cob-media" />
                <Label htmlFor="cob-media">Media</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Baja" id="cob-baja" />
                <Label htmlFor="cob-baja">Baja</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Uniformidad general</Label>
            <RadioGroup
              value={watch("general.uniformidad_general")}
              onValueChange={(value) => setValue("general.uniformidad_general", value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Buena" id="uni-buena" />
                <Label htmlFor="uni-buena">Buena</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Irregular" id="uni-irregular" />
                <Label htmlFor="uni-irregular">Irregular</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* SECCIÓN B: EVALUACIÓN POR LOTES      */}
      {/* ===================================== */}
      <div className="bg-purple-50/30 border border-purple-200 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
          <span>📊</span> Evaluación por Lotes/Potreros
        </h3>

        <div>
          <Label>¿Cuántos lotes desea evaluar en detalle?</Label>
          <Input
            type="number"
            min="0"
            {...register("cuantos_lotes_evaluados")}
            className="max-w-xs mt-2"
            placeholder="Número de lotes a evaluar"
          />
        </div>

        {/* Acordeón de Lotes */}
        <div className="space-y-3">
          {lotesEvaluados.map((lote, index) => (
            <LoteEvaluadoItem
              key={lote.id}
              lote={lote}
              index={index}
              isActive={activeLoteIndex === index}
              isComplete={isLoteComplete(index)}
              onToggle={() => toggleLote(index)}
              onRemove={() => removeLote(index)}
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={handleAddLote}
          className="w-full"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Lote para Evaluación
        </Button>
      </div>
    </div>
  );
}

/**
 * Componente: Item de Lote Evaluado (Acordeón)
 */
function LoteEvaluadoItem({
  index,
  isActive,
  isComplete,
  onToggle,
  onRemove,
  register,
  control,
  watch,
  setValue,
  getValues
}) {
  const seRealizaronMediciones = watch(`lotes_evaluados.${index}.mediciones_forraje.se_realizaron`);

  return (
    <Collapsible open={isActive} onOpenChange={onToggle}>
      <div className="border rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-purple-50 transition-colors">
            <div className="flex items-center gap-3">
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
              <div className="text-left">
                <p className="font-medium">
                  Lote #{index + 1}: {watch(`lotes_evaluados.${index}.nombre_lote`) || 'Sin nombre'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isComplete ? 'Completado' : 'Incompleto'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('¿Está seguro de eliminar este lote?')) {
                    onRemove();
                  }
                }}
                className="p-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </div>
              {isActive ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Content */}
        <CollapsibleContent>
          <div className="p-4 space-y-6 border-t">
            {/* Datos Básicos del Lote */}
            <DatosBasicosLote
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
            />

            {/* Mediciones de Forraje */}
            <MedicionesForraje
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
              seRealizaron={seRealizaronMediciones}
            />

            {/* Puntos de Muestreo */}
            <PuntosMuestreo
              index={index}
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
            />

            {/* Plagas y Enfermedades */}
            <PlagasEnfermedades
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

/**
 * Sub-componente: Datos Básicos del Lote
 */
function DatosBasicosLote({ index, register, watch, setValue }) {
  return (
    <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-900">Datos Básicos del Lote</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Nombre del lote/potrero *</Label>
          <Input
            {...register(`lotes_evaluados.${index}.nombre_lote`)}
            placeholder="Ej: Potrero Norte"
          />
        </div>

        <div>
          <Label>Área del lote (m²)</Label>
          <Input
            type="number"
            min="0"
            {...register(`lotes_evaluados.${index}.area_m2`)}
            placeholder="Área en m²"
          />
        </div>

        <div>
          <Label>Topografía general</Label>
          <Select
            value={watch(`lotes_evaluados.${index}.topografia`)}
            onValueChange={(value) => setValue(`lotes_evaluados.${index}.topografia`, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Plano">Plano</SelectItem>
              <SelectItem value="Inclinación leve">Inclinación leve</SelectItem>
              <SelectItem value="Inclinación fuerte">Inclinación fuerte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-componente: Mediciones de Forraje
 */
function MedicionesForraje({ index, register, watch, setValue, seRealizaron }) {
  return (
    <div className="space-y-4 p-4 bg-green-50/30 rounded-lg border border-green-200">
      <h4 className="font-medium text-green-900">Mediciones de Forraje</h4>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={seRealizaron}
          onCheckedChange={(checked) =>
            setValue(`lotes_evaluados.${index}.mediciones_forraje.se_realizaron`, checked)
          }
        />
        <Label>¿Se realizaron mediciones de forraje?</Label>
      </div>

      {!seRealizaron && (
        <div>
          <Label>Motivo por el cual no se realizaron mediciones</Label>
          <Textarea
            {...register(`lotes_evaluados.${index}.mediciones_forraje.motivo_no_realizacion`)}
            placeholder="Especifique el motivo..."
            rows={3}
          />
        </div>
      )}

      {seRealizaron && (
        <div className="space-y-4">
          {/* Mediciones de Entrada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Aforo entrada (kg MS/m²)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register(`lotes_evaluados.${index}.mediciones_forraje.aforo_entrada_kg_ms_m2`)}
                placeholder="Opcional"
              />
            </div>
            <div>
              <Label>Altura entrada (cm)</Label>
              <Select
                value={watch(`lotes_evaluados.${index}.mediciones_forraje.altura_entrada_cm`)?.toString()}
                onValueChange={(value) =>
                  setValue(`lotes_evaluados.${index}.mediciones_forraje.altura_entrada_cm`, parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione altura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 cm</SelectItem>
                  <SelectItem value="20">20 cm</SelectItem>
                  <SelectItem value="30">30 cm</SelectItem>
                  <SelectItem value="40">40 cm</SelectItem>
                  <SelectItem value="50">50 cm</SelectItem>
                  <SelectItem value="60">60 cm</SelectItem>
                  <SelectItem value="70">70 cm</SelectItem>
                  <SelectItem value="80">80 cm</SelectItem>
                  <SelectItem value="90">90 cm</SelectItem>
                  <SelectItem value="100">100 cm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hora muestreo MS</Label>
              <Input
                type="time"
                {...register(`lotes_evaluados.${index}.mediciones_forraje.hora_muestreo_ms`)}
              />
            </div>
          </div>

          {/* Mediciones de Salida (opcional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Aforo salida (kg MS/m²) - Opcional</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register(`lotes_evaluados.${index}.mediciones_forraje.aforo_salida_kg_ms_m2`)}
                placeholder="Opcional"
              />
            </div>
            <div>
              <Label>Altura salida (cm) - Opcional</Label>
              <Select
                value={watch(`lotes_evaluados.${index}.mediciones_forraje.altura_salida_cm`)?.toString()}
                onValueChange={(value) =>
                  setValue(`lotes_evaluados.${index}.mediciones_forraje.altura_salida_cm`, parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione altura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 cm</SelectItem>
                  <SelectItem value="20">20 cm</SelectItem>
                  <SelectItem value="30">30 cm</SelectItem>
                  <SelectItem value="40">40 cm</SelectItem>
                  <SelectItem value="50">50 cm</SelectItem>
                  <SelectItem value="60">60 cm</SelectItem>
                  <SelectItem value="70">70 cm</SelectItem>
                  <SelectItem value="80">80 cm</SelectItem>
                  <SelectItem value="90">90 cm</SelectItem>
                  <SelectItem value="100">100 cm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mediciones Químicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Grados Brix (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                {...register(`lotes_evaluados.${index}.mediciones_forraje.grados_brix`)}
                placeholder="Opcional"
              />
            </div>
            <div>
              <Label>pH de hoja</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="14"
                {...register(`lotes_evaluados.${index}.mediciones_forraje.ph_hoja`)}
                placeholder="Opcional"
              />
            </div>
            <div>
              <Label>Hora muestreo Brix/pH</Label>
              <Input
                type="time"
                {...register(`lotes_evaluados.${index}.mediciones_forraje.hora_muestreo_brix_ph`)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sub-componente: Puntos de Muestreo
 */
function PuntosMuestreo({ index, control, register, watch, setValue }) {
  const { fields: puntos, append: appendPunto, remove: removePunto } = useFieldArray({
    control,
    name: `lotes_evaluados.${index}.puntos_muestreo`
  });

  const [activePuntoIndex, setActivePuntoIndex] = useState(null);

  const handleAddPunto = () => {
    if (puntos.length < 9) {
      appendPunto({
        coordenada_gps: "",
        pendiente_porcentaje: 0,
        aspecto_pendiente: "N",
        vess_colchon_pasto: 2,
        vess_suelo: 3,
        textura_predominante: "Franca",
        color_predominante: "Oscuro",
        olor_predominante: "Orgánico",
        nivel_compactacion: "Medio",
        evidencia_compactacion_superficial: false,
        drenaje: "Adecuado",
        evidencia_erosion: false,
        puntuacion_salud_pasto: 2,
        especies_no_deseadas_presentes: false,
        sintomas_estres: [],
        lombrices_rojas: 0,
        lombrices_grises: 0,
        lombrices_blancas: 0,
        huevos_lombrices: 0,
        tipos_diferentes_huevos: 0,
        presencia_micelio_hongos: "Moderado",
        raices_activas_visibles: "Moderado"
      });
      setActivePuntoIndex(puntos.length);
    }
  };

  const togglePunto = (ptoIndex) => {
    setActivePuntoIndex(activePuntoIndex === ptoIndex ? null : ptoIndex);
  };

  return (
    <div className="space-y-4 p-4 bg-amber-50/30 rounded-lg border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-amber-900">
            Puntos de Muestreo ({puntos.length}/9)
          </h4>
          <p className="text-xs text-muted-foreground">
            Se pueden agregar hasta 9 puntos de muestreo por lote
          </p>
        </div>
        <Button
          type="button"
          onClick={handleAddPunto}
          disabled={puntos.length >= 9}
          size="sm"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar Punto ({9 - puntos.length} restantes)
        </Button>
      </div>

      <div className="space-y-3">
        {puntos.map((punto, ptoIndex) => (
          <PuntoMuestreoItem
            key={punto.id}
            loteIndex={index}
            puntoIndex={ptoIndex}
            isActive={activePuntoIndex === ptoIndex}
            onToggle={() => togglePunto(ptoIndex)}
            onRemove={() => removePunto(ptoIndex)}
            register={register}
            watch={watch}
            setValue={setValue}
            totalPuntos={puntos.length}
          />
        ))}
      </div>

      {puntos.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay puntos de muestreo. Click en &quot;Agregar Punto&quot;
        </p>
      )}
    </div>
  );
}

/**
 * Sub-componente: Item de Punto de Muestreo (Acordeón interno)
 */
function PuntoMuestreoItem({
  loteIndex,
  puntoIndex,
  isActive,
  onToggle,
  onRemove,
  register,
  watch,
  setValue,
  totalPuntos
}) {
  return (
    <Collapsible open={isActive} onOpenChange={onToggle}>
      <div className="border rounded-lg overflow-hidden bg-white">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-3 hover:bg-amber-50 transition-colors">
            <p className="font-medium text-sm">
              📍 Punto {puntoIndex + 1}/{totalPuntos}
            </p>
            <div className="flex items-center gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('¿Eliminar este punto de muestreo?')) {
                    onRemove();
                  }
                }}
                className="p-1 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </div>
              {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 space-y-4 border-t">
            {/* Ubicación y Topografía */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Coordenada GPS</Label>
                <Input
                  {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.coordenada_gps`)}
                  placeholder="Lat, Lon"
                />
              </div>
              <div>
                <Label>Pendiente estimada (0-45%)</Label>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.pendiente_porcentaje`)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="45"
                    {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.pendiente_porcentaje`)}
                    placeholder="0-45%"
                  />
                </div>
              </div>
              <div>
                <Label>Aspecto de la pendiente</Label>
                <Select
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.aspecto_pendiente`)}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.aspecto_pendiente`, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">N (Norte)</SelectItem>
                    <SelectItem value="S">S (Sur)</SelectItem>
                    <SelectItem value="E">E (Este)</SelectItem>
                    <SelectItem value="O">O (Oeste)</SelectItem>
                    <SelectItem value="NE">NE (Noreste)</SelectItem>
                    <SelectItem value="NO">NO (Noroeste)</SelectItem>
                    <SelectItem value="SE">SE (Sureste)</SelectItem>
                    <SelectItem value="SO">SO (Suroeste)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* VESS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>VESS colchón del pasto (1-3)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  1: Bueno en descomposición | 3: Malo laminal y mucho
                </p>
                <RadioGroup
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.vess_colchon_pasto`)?.toString()}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.vess_colchon_pasto`, parseInt(value))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id={`vess-colchon-${loteIndex}-${puntoIndex}-1`} />
                    <Label htmlFor={`vess-colchon-${loteIndex}-${puntoIndex}-1`}>1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id={`vess-colchon-${loteIndex}-${puntoIndex}-2`} />
                    <Label htmlFor={`vess-colchon-${loteIndex}-${puntoIndex}-2`}>2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id={`vess-colchon-${loteIndex}-${puntoIndex}-3`} />
                    <Label htmlFor={`vess-colchon-${loteIndex}-${puntoIndex}-3`}>3</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>VESS del suelo (1-5)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  1: Suelto como torta | 5: Plastilina o casi piedra
                </p>
                <RadioGroup
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.vess_suelo`)?.toString()}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.vess_suelo`, parseInt(value))}
                  className="flex gap-4"
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <div key={val} className="flex items-center space-x-2">
                      <RadioGroupItem value={val.toString()} id={`vess-suelo-${loteIndex}-${puntoIndex}-${val}`} />
                      <Label htmlFor={`vess-suelo-${loteIndex}-${puntoIndex}-${val}`}>{val}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Características del Suelo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Textura predominante</Label>
                <Select
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.textura_predominante`)}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.textura_predominante`, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arenosa">Arenosa</SelectItem>
                    <SelectItem value="Franca">Franca</SelectItem>
                    <SelectItem value="Arcillosa">Arcillosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Color predominante</Label>
                <Select
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.color_predominante`)}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.color_predominante`, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oscuro">Oscuro</SelectItem>
                    <SelectItem value="Claro">Claro</SelectItem>
                    <SelectItem value="Rojizo">Rojizo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Olor predominante</Label>
                <Select
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.olor_predominante`)}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.olor_predominante`, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orgánico">Orgánico</SelectItem>
                    <SelectItem value="Áspero">Áspero</SelectItem>
                    <SelectItem value="Ácido">Ácido</SelectItem>
                    <SelectItem value="Neutro">Neutro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compactación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Penetrómetro a 200psi (cm)</Label>
                <Input
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.penetrometro_200psi_cm`)}
                  placeholder="0-90 cm"
                />
              </div>

              <div>
                <Label>Nivel de compactación</Label>
                <Select
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.nivel_compactacion`)}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.nivel_compactacion`, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bajo">Bajo</SelectItem>
                    <SelectItem value="Medio">Medio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  checked={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.evidencia_compactacion_superficial`)}
                  onCheckedChange={(checked) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.evidencia_compactacion_superficial`, checked)}
                />
                <Label>Evidencia compactación superficial</Label>
              </div>
            </div>

            {/* Condiciones y Salud del Pasto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Drenaje</Label>
                <RadioGroup
                  value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.drenaje`)}
                  onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.drenaje`, value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Adecuado" id={`drenaje-adecuado-${loteIndex}-${puntoIndex}`} />
                    <Label htmlFor={`drenaje-adecuado-${loteIndex}-${puntoIndex}`}>Adecuado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Deficiente" id={`drenaje-deficiente-${loteIndex}-${puntoIndex}`} />
                    <Label htmlFor={`drenaje-deficiente-${loteIndex}-${puntoIndex}`}>Deficiente</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  checked={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.evidencia_erosion`)}
                  onCheckedChange={(checked) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.evidencia_erosion`, checked)}
                />
                <Label>¿Evidencia de erosión?</Label>
              </div>
            </div>

            {/* Puntuación Salud del Pasto */}
            <div>
              <Label>Puntuación salud del pasto (0-3)</Label>
              <RadioGroup
                value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.puntuacion_salud_pasto`)?.toString()}
                onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.puntuacion_salud_pasto`, parseInt(value))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id={`salud-0-${loteIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-0-${loteIndex}-${puntoIndex}`}>0 (Muy malo)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id={`salud-1-${loteIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-1-${loteIndex}-${puntoIndex}`}>1 (Malo)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id={`salud-2-${loteIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-2-${loteIndex}-${puntoIndex}`}>2 (Regular)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id={`salud-3-${loteIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-3-${loteIndex}-${puntoIndex}`}>3 (Bueno)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Especies no deseadas */}
            <SpeciesNoDeseadas
              loteIndex={loteIndex}
              puntoIndex={puntoIndex}
              watch={watch}
              setValue={setValue}
            />

            {/* Síntomas de estrés */}
            <SintomasEstres
              loteIndex={loteIndex}
              puntoIndex={puntoIndex}
              watch={watch}
              setValue={setValue}
            />

            {/* Biodiversidad */}
            <Biodiversidad
              loteIndex={loteIndex}
              puntoIndex={puntoIndex}
              register={register}
              watch={watch}
              setValue={setValue}
            />

            {/* Fotos */}
            <FotosPunto
              loteIndex={loteIndex}
              puntoIndex={puntoIndex}
              register={register}
              watch={watch}
              setValue={setValue}
            />

            {/* Observaciones */}
            <div>
              <Label>Observaciones del punto</Label>
              <Textarea
                {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.observaciones_punto`)}
                placeholder="Observaciones adicionales sobre este punto de muestreo..."
                rows={3}
              />
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

/**
 * Sub-componente: Especies No Deseadas
 */
function SpeciesNoDeseadas({ loteIndex, puntoIndex, watch, setValue }) {
  const hayEspeciesNoDeseadas = watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.especies_no_deseadas_presentes`);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={hayEspeciesNoDeseadas}
          onCheckedChange={(checked) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.especies_no_deseadas_presentes`, checked)}
        />
        <Label>¿Especies no deseadas presentes?</Label>
      </div>

      {hayEspeciesNoDeseadas && (
        <div>
          <Label>Nivel de especies no deseadas</Label>
          <RadioGroup
            value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.nivel_especies_no_deseadas`)}
            onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.nivel_especies_no_deseadas`, value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Bajo" id={`especies-bajo-${loteIndex}-${puntoIndex}`} />
              <Label htmlFor={`especies-bajo-${loteIndex}-${puntoIndex}`}>Bajo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Medio" id={`especies-medio-${loteIndex}-${puntoIndex}`} />
              <Label htmlFor={`especies-medio-${loteIndex}-${puntoIndex}`}>Medio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Alto" id={`especies-alto-${loteIndex}-${puntoIndex}`} />
              <Label htmlFor={`especies-alto-${loteIndex}-${puntoIndex}`}>Alto</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

/**
 * Sub-componente: Síntomas de Estrés
 */
function SintomasEstres({ loteIndex, puntoIndex, watch, setValue }) {
  const sintomas = watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.sintomas_estres`) || [];

  const handleSintomaChange = (sintoma, checked) => {
    if (checked) {
      setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.sintomas_estres`, [...sintomas, sintoma]);
    } else {
      setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.sintomas_estres`, sintomas.filter(s => s !== sintoma));
    }
  };

  return (
    <div className="space-y-2">
      <Label>Síntomas de estrés visible (selección múltiple)</Label>
      <div className="grid grid-cols-2 gap-2">
        {['Sequía', 'Sobrepastoreo', 'Plagas', 'Ninguno'].map((sintoma) => (
          <div key={sintoma} className="flex items-center space-x-2">
            <Checkbox
              checked={sintomas.includes(sintoma)}
              onCheckedChange={(checked) => handleSintomaChange(sintoma, checked)}
            />
            <Label>{sintoma}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Sub-componente: Biodiversidad
 */
function Biodiversidad({ loteIndex, puntoIndex, register, watch, setValue }) {
  return (
    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <h5 className="font-medium text-green-900">Biodiversidad del Suelo</h5>

      {/* Lombrices */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <Label>Lombrices ROJAS (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.lombrices_rojas`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Lombrices GRISES (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.lombrices_grises`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Lombrices BLANCAS (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.lombrices_blancas`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Huevos de lombrices (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.huevos_lombrices`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Tipos diferentes huevos (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.tipos_diferentes_huevos`)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Micelio y Raíces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Presencia de micelio/hongos</Label>
          <Select
            value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.presencia_micelio_hongos`)}
            onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.presencia_micelio_hongos`, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Abundante">Abundante</SelectItem>
              <SelectItem value="Moderado">Moderado</SelectItem>
              <SelectItem value="Poco">Poco</SelectItem>
              <SelectItem value="Ninguno">Ninguno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Raíces activas visibles</Label>
          <Select
            value={watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.raices_activas_visibles`)}
            onValueChange={(value) => setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.raices_activas_visibles`, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Abundante">Abundante</SelectItem>
              <SelectItem value="Moderado">Moderado</SelectItem>
              <SelectItem value="Poco">Poco</SelectItem>
              <SelectItem value="Ninguno">Ninguno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-componente: Fotos del Punto
 * Usa ImageUploadPreview y maneja File objects para persistencia en IndexedDB
 */
function FotosPunto({ loteIndex, puntoIndex, setValue, watch }) {
  // Obtener valores actuales de las fotos
  const fotoCalidad = watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.foto_salud_pasto_calidad`);
  const fotoRaiz = watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.foto_salud_pasto_raiz`);
  const fotoSuelo = watch(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.foto_perfil_suelo`);

  return (
    <div className="mt-6 border-t pt-6">
      <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Camera className="h-4 w-4" />
        Evidencia Fotográfica
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Foto 1: Salud del pasto (calidad) */}
        <ImageUploadPreview
          id={`foto_calidad_${loteIndex}_${puntoIndex}`}
          label="Foto: Salud del pasto - Calidad"
          value={fotoCalidad}
          onChange={(file) => {
            setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.foto_salud_pasto_calidad`, file);
          }}
          maxSizeMB={10}
        />

        {/* Foto 2: Salud del pasto (raíz) */}
        <ImageUploadPreview
          id={`foto_raiz_${loteIndex}_${puntoIndex}`}
          label="Foto: Salud del pasto - Raíz"
          value={fotoRaiz}
          onChange={(file) => {
            setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.foto_salud_pasto_raiz`, file);
          }}
          maxSizeMB={10}
        />

        {/* Foto 3: Perfil del suelo */}
        <ImageUploadPreview
          id={`foto_suelo_${loteIndex}_${puntoIndex}`}
          label="Foto: Perfil del suelo"
          value={fotoSuelo}
          onChange={(file) => {
            setValue(`lotes_evaluados.${loteIndex}.puntos_muestreo.${puntoIndex}.foto_perfil_suelo`, file);
          }}
          maxSizeMB={10}
        />
      </div>
    </div>
  );
}

/**
 * Sub-componente: Plagas y Enfermedades
 */
function PlagasEnfermedades({ index, watch, setValue }) {
  const plagas = watch(`lotes_evaluados.${index}.plagas_enfermedades`) || [];

  return (
    <div className="space-y-4 p-4 bg-red-50/30 rounded-lg border border-red-200">
      <h4 className="font-medium text-red-900">Plagas y Enfermedades del Lote</h4>
      <p className="text-sm text-muted-foreground">
        Marque el nivel de daño para cada plaga/enfermedad
      </p>

      {/* Desktop/Tablet: Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-red-100">
              <th className="border p-2 text-left">Plaga/Enfermedad</th>
              <th className="border p-2 text-center">Sin daño</th>
              <th className="border p-2 text-center">Leve</th>
              <th className="border p-2 text-center">Moderado</th>
              <th className="border p-2 text-center">Grave</th>
            </tr>
          </thead>
          <tbody>
            {plagas.map((plaga, plagaIndex) => (
              <tr key={plagaIndex} className="hover:bg-red-50">
                <td className="border p-2 font-medium">{plaga.nombre}</td>
                {['sin_dano', 'leve', 'moderado', 'grave'].map((nivel) => (
                  <td key={nivel} className="border p-2 text-center">
                    <input
                      type="radio"
                      name={`lote-${index}-plaga-${plagaIndex}`}
                      value={nivel}
                      checked={watch(`lotes_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`) === nivel}
                      onChange={(e) => setValue(`lotes_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`, e.target.value)}
                      className="cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Tarjetas */}
      <div className="md:hidden space-y-4">
        {plagas.map((plaga, plagaIndex) => (
          <div key={plagaIndex} className="border rounded-lg p-4 bg-white">
            <p className="font-semibold mb-3">{plaga.nombre}</p>
            <RadioGroup
              value={watch(`lotes_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`)}
              onValueChange={(value) => setValue(`lotes_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sin_dano" id={`plaga-${index}-${plagaIndex}-sin`} />
                <Label htmlFor={`plaga-${index}-${plagaIndex}-sin`}>Sin daño</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="leve" id={`plaga-${index}-${plagaIndex}-leve`} />
                <Label htmlFor={`plaga-${index}-${plagaIndex}-leve`}>Leve</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderado" id={`plaga-${index}-${plagaIndex}-moderado`} />
                <Label htmlFor={`plaga-${index}-${plagaIndex}-moderado`}>Moderado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grave" id={`plaga-${index}-${plagaIndex}-grave`} />
                <Label htmlFor={`plaga-${index}-${plagaIndex}-grave`}>Grave</Label>
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
}
