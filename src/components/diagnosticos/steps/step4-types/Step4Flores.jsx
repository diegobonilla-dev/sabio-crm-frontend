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
import { manejoCultivoFloresSchema } from "@/lib/validations/diagnostico.schema";
import { Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, X } from "lucide-react";

/**
 * Paso 4: Manejo de Cultivo - Flores
 *
 * Estructura:
 * - Sección A: Información General (toda la finca)
 * - Sección B: Evaluación por Bloques (acordeón)
 */
export default function Step4Flores({ data, onChange }) {
  const [activeBloqueIndex, setActiveBloqueIndex] = useState(null);

  const {
    register,
    control,
    setValue,
    watch,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(manejoCultivoFloresSchema),
    defaultValues: data?.datos_flores?.manejo_cultivo || {
      general: {
        metodo_plateo: [],
        deshierbe: [],
        frecuencia_plateo: 'Mensual',
        especies_predominantes: [],
        plantas_resembradas: 0,
        tipo_podas: [],
        ultimas_podas_realizadas: '',
        cantidad_fertilizante_sintetico_por_cama: 0,
        usa_abono_organico: false,
        tipos_abono_organico: '',
        cantidad_abono_organico_por_cama: 0
      },
      cuantos_bloques_evaluados: 0,
      bloques_evaluados: []
    }
  });

  // Watches para condicionales
  const usaAbonoOrganico = watch("general.usa_abono_organico");

  // Arrays dinámicos - Sección General
  const { fields: especiesPredominantes, append: appendEspecie, remove: removeEspecie } = useFieldArray({
    control,
    name: "general.especies_predominantes"
  });

  // Arrays dinámicos - Bloques Evaluados
  const { fields: bloquesEvaluados, append: appendBloque, remove: removeBloque } = useFieldArray({
    control,
    name: "bloques_evaluados"
  });

  // Sincronizar con datos al montar el componente
  useEffect(() => {
    if (data?.datos_flores?.manejo_cultivo) {
      reset(data.datos_flores.manejo_cultivo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Auto-guardar cambios en el formulario (con debounce)
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        datos_flores: {
          manejo_cultivo: formValues
        }
      });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Handlers
  const handleAddEspeciePredominante = () => {
    if (especiesPredominantes.length < 4) {
      appendEspecie({
        especie: "",
        orden: especiesPredominantes.length + 1
      });
    }
  };

  const handleAddBloque = () => {
    const newBloque = {
      nombre_bloque: `Bloque ${bloquesEvaluados.length + 1}`,
      area_bloque_m2: 0,
      coordenadas_gps_centro: '',
      topografia_general: 'Plano',
      puntos_muestreo: [],
      plagas_enfermedades: [
        { nombre: 'Moho Gris / Botrytis', nivel_dano: 'sin_dano' },
        { nombre: 'Mildeo Polvoso / Oídio', nivel_dano: 'sin_dano' },
        { nombre: 'Botrytis', nivel_dano: 'sin_dano' },
        { nombre: 'Mancha Foliar (Cercospora)', nivel_dano: 'sin_dano' },
        { nombre: 'Ácaro', nivel_dano: 'sin_dano' },
        { nombre: 'Trips', nivel_dano: 'sin_dano' },
        { nombre: 'Pulgones / Áfidos', nivel_dano: 'sin_dano' },
        { nombre: 'Pudrición Blanda del Rizoma', nivel_dano: 'sin_dano' },
        { nombre: 'Pudrición de Raíz y Rizoma', nivel_dano: 'sin_dano' }
      ]
    };
    appendBloque(newBloque);
    setActiveBloqueIndex(bloquesEvaluados.length);
  };

  const toggleBloque = (index) => {
    setActiveBloqueIndex(activeBloqueIndex === index ? null : index);
  };

  const isBloqueComplete = (index) => {
    const bloque = getValues(`bloques_evaluados.${index}`);
    return bloque?.nombre_bloque && bloque.nombre_bloque.trim() !== "";
  };

  return (
    <div className="space-y-8">
      {/* ===================================== */}
      {/* SECCIÓN A: INFORMACIÓN GENERAL       */}
      {/* ===================================== */}
      <div className="bg-blue-50/30 border border-blue-200 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <span>🌱</span> Información General de Manejo de Cultivo
        </h3>
        <p className="text-sm text-muted-foreground">
          Información agregada de toda la finca
        </p>

        {/* Plateo y Deshierbe */}
        <SeccionPlateoYDeshierbe
          watch={watch}
          setValue={setValue}
        />

        {/* Especies Predominantes */}
        <div className="space-y-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Especies Predominantes de Cultivo</h4>
              <p className="text-xs text-muted-foreground">
                💡 Variedades de flores cultivadas en la finca (máximo 4)
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddEspeciePredominante}
              disabled={especiesPredominantes.length >= 4}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Especie
            </Button>
          </div>

          {especiesPredominantes.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Especie {index + 1}</Label>
                <Input
                  {...register(`general.especies_predominantes.${index}.especie`)}
                  placeholder="Ej: Rosa, Clavel, Crisantemo, etc."
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

          {especiesPredominantes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay especies agregadas. Click en &quot;Agregar Especie&quot;
            </p>
          )}
        </div>

        {/* Resiembras y Podas */}
        <SeccionResiembrasYPodas
          register={register}
          watch={watch}
          setValue={setValue}
        />

        {/* Fertilización */}
        <SeccionFertilizacion
          register={register}
          setValue={setValue}
          usaAbonoOrganico={usaAbonoOrganico}
        />
      </div>

      {/* ===================================== */}
      {/* SECCIÓN B: EVALUACIÓN POR BLOQUES    */}
      {/* ===================================== */}
      <div className="bg-purple-50/30 border border-purple-200 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
          <span>📊</span> Evaluación por Bloques
        </h3>

        <div>
          <Label>¿Cuántos bloques desea evaluar en detalle?</Label>
          <Input
            type="number"
            min="0"
            {...register("cuantos_bloques_evaluados")}
            className="max-w-xs mt-2"
            placeholder="Número de bloques a evaluar"
          />
        </div>

        {/* Acordeón de Bloques */}
        <div className="space-y-3">
          {bloquesEvaluados.map((bloque, index) => (
            <BloqueEvaluadoItem
              key={bloque.id}
              bloque={bloque}
              index={index}
              isActive={activeBloqueIndex === index}
              isComplete={isBloqueComplete(index)}
              onToggle={() => toggleBloque(index)}
              onRemove={() => removeBloque(index)}
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
          onClick={handleAddBloque}
          className="w-full"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Bloque para Evaluación
        </Button>
      </div>
    </div>
  );
}

/**
 * Sub-componente: Plateo y Deshierbe
 */
function SeccionPlateoYDeshierbe({ watch, setValue }) {
  const metodoPlateo = watch("general.metodo_plateo") || [];
  const deshierbe = watch("general.deshierbe") || [];

  const handleMetodoPlateoChange = (metodo, checked) => {
    if (checked) {
      setValue("general.metodo_plateo", [...metodoPlateo, metodo]);
    } else {
      setValue("general.metodo_plateo", metodoPlateo.filter(m => m !== metodo));
    }
  };

  const handleDeshierbeChange = (metodo, checked) => {
    if (checked) {
      setValue("general.deshierbe", [...deshierbe, metodo]);
    } else {
      setValue("general.deshierbe", deshierbe.filter(m => m !== metodo));
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h4 className="font-medium text-blue-900">Plateo y Deshierbe</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Método de Plateo */}
        <div className="space-y-2">
          <Label className="font-semibold">Método de Plateo (múltiple)</Label>
          <div className="space-y-2">
            {['Guadaña', 'Manual', 'Herbicida', 'No se hace'].map((metodo) => (
              <div key={metodo} className="flex items-center space-x-2">
                <Checkbox
                  checked={metodoPlateo.includes(metodo)}
                  onCheckedChange={(checked) => handleMetodoPlateoChange(metodo, checked)}
                />
                <Label>{metodo}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Deshierbe */}
        <div className="space-y-2">
          <Label className="font-semibold">Deshierbe (múltiple)</Label>
          <div className="space-y-2">
            {['Guadaña', 'Manual', 'Herbicida', 'No se hace'].map((metodo) => (
              <div key={metodo} className="flex items-center space-x-2">
                <Checkbox
                  checked={deshierbe.includes(metodo)}
                  onCheckedChange={(checked) => handleDeshierbeChange(metodo, checked)}
                />
                <Label>{metodo}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frecuencia plateo */}
      <div>
        <Label>Frecuencia de plateo</Label>
        <RadioGroup
          value={watch("general.frecuencia_plateo")}
          onValueChange={(value) => setValue("general.frecuencia_plateo", value)}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Mensual" id="frec-mensual" />
            <Label htmlFor="frec-mensual">Mensual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Bimestral" id="frec-bimestral" />
            <Label htmlFor="frec-bimestral">Bimestral</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Trimestral" id="frec-trimestral" />
            <Label htmlFor="frec-trimestral">Trimestral</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Dos veces al año" id="frec-semestral" />
            <Label htmlFor="frec-semestral">Dos veces al año</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

/**
 * Sub-componente: Resiembras y Podas
 */
function SeccionResiembrasYPodas({ register, watch, setValue }) {
  const tipoPodas = watch("general.tipo_podas") || [];

  const handleTipoPodaChange = (tipo, checked) => {
    if (checked) {
      setValue("general.tipo_podas", [...tipoPodas, tipo]);
    } else {
      setValue("general.tipo_podas", tipoPodas.filter(t => t !== tipo));
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h4 className="font-medium text-blue-900">Resiembras y Podas</h4>

      <div>
        <Label>Plantas resembradas</Label>
        <Input
          type="number"
          min="0"
          {...register("general.plantas_resembradas")}
          placeholder="Número de plantas resembradas"
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo de podas realizadas (múltiple)</Label>
        <div className="grid grid-cols-3 gap-3">
          {['SANITARIA', 'FORMACION', 'PRODUCCION'].map((tipo) => (
            <div key={tipo} className="flex items-center space-x-2">
              <Checkbox
                checked={tipoPodas.includes(tipo)}
                onCheckedChange={(checked) => handleTipoPodaChange(tipo, checked)}
              />
              <Label>{tipo}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Últimas podas realizadas</Label>
        <Textarea
          {...register("general.ultimas_podas_realizadas")}
          placeholder="Describa las últimas podas realizadas..."
          rows={3}
        />
      </div>
    </div>
  );
}

/**
 * Sub-componente: Fertilización
 */
function SeccionFertilizacion({ register, setValue, usaAbonoOrganico }) {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h4 className="font-medium text-blue-900">Fertilización</h4>

      <div>
        <Label>Cantidad fertilizante sintético por cama o bloque</Label>
        <Input
          type="number"
          min="0"
          {...register("general.cantidad_fertilizante_sintetico_por_cama")}
          placeholder="0"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={usaAbonoOrganico}
          onCheckedChange={(checked) => setValue("general.usa_abono_organico", checked)}
        />
        <Label>¿Usa abono orgánico?</Label>
      </div>

      {usaAbonoOrganico && (
        <div className="space-y-4 p-4 bg-green-50/50 rounded border border-green-200">
          <div>
            <Label>Tipos de abono orgánico</Label>
            <Input
              {...register("general.tipos_abono_organico")}
              placeholder="Ej: Compost, bocashi, lombricompuesto"
            />
          </div>
          <div>
            <Label>Cantidad abono orgánico por cama o bloque</Label>
            <Input
              type="number"
              min="0"
              {...register("general.cantidad_abono_organico_por_cama")}
              placeholder="0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente: Item de Bloque Evaluado (Acordeón)
 */
function BloqueEvaluadoItem({
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
                  Bloque #{index + 1}: {watch(`bloques_evaluados.${index}.nombre_bloque`) || 'Sin nombre'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isComplete ? 'Completado' : 'Incompleto'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('¿Está seguro de eliminar este bloque?')) {
                    onRemove();
                  }
                }}
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
            {/* Datos Básicos del Bloque */}
            <DatosBasicosBloque
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
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
 * Sub-componente: Datos Básicos del Bloque
 */
function DatosBasicosBloque({ index, register, watch, setValue }) {
  return (
    <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-900">Datos Básicos del Bloque</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre del bloque *</Label>
          <Input
            {...register(`bloques_evaluados.${index}.nombre_bloque`)}
            placeholder="Ej: Bloque 1"
          />
        </div>

        <div>
          <Label>Área del bloque (m²)</Label>
          <Input
            type="number"
            min="0"
            {...register(`bloques_evaluados.${index}.area_bloque_m2`)}
            placeholder="Área en m²"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Coordenadas GPS del centro</Label>
          <Input
            {...register(`bloques_evaluados.${index}.coordenadas_gps_centro`)}
            placeholder="Lat, Lon"
          />
        </div>

        <div>
          <Label>Topografía general</Label>
          <Select
            value={watch(`bloques_evaluados.${index}.topografia_general`)}
            onValueChange={(value) => setValue(`bloques_evaluados.${index}.topografia_general`, value)}
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
 * Sub-componente: Puntos de Muestreo
 */
function PuntosMuestreo({ index, control, register, watch, setValue }) {
  const { fields: puntos, append: appendPunto, remove: removePunto } = useFieldArray({
    control,
    name: `bloques_evaluados.${index}.puntos_muestreo`
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
        puntuacion_salud_cobertura: 2,
        conductividad_electrica: 0,
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
            Se pueden agregar hasta 9 puntos de muestreo por bloque
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
            bloqueIndex={index}
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
  bloqueIndex,
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
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('¿Eliminar este punto de muestreo?')) {
                    onRemove();
                  }
                }}
                size="sm"
                variant="ghost"
                className="text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
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
                  {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.coordenada_gps`)}
                  placeholder="Lat, Lon"
                />
              </div>
              <div>
                <Label>Pendiente estimada (0-100%)</Label>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.pendiente_porcentaje`)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.pendiente_porcentaje`)}
                    placeholder="0-100%"
                  />
                </div>
              </div>
              <div>
                <Label>Aspecto de la pendiente</Label>
                <Select
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.aspecto_pendiente`)}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.aspecto_pendiente`, value)}
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
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.vess_colchon_pasto`)?.toString()}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.vess_colchon_pasto`, parseInt(value))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id={`vess-colchon-${bloqueIndex}-${puntoIndex}-1`} />
                    <Label htmlFor={`vess-colchon-${bloqueIndex}-${puntoIndex}-1`}>1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id={`vess-colchon-${bloqueIndex}-${puntoIndex}-2`} />
                    <Label htmlFor={`vess-colchon-${bloqueIndex}-${puntoIndex}-2`}>2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id={`vess-colchon-${bloqueIndex}-${puntoIndex}-3`} />
                    <Label htmlFor={`vess-colchon-${bloqueIndex}-${puntoIndex}-3`}>3</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>VESS del suelo (1-5)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  1: Suelto como torta | 5: Plastilina o casi piedra
                </p>
                <RadioGroup
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.vess_suelo`)?.toString()}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.vess_suelo`, parseInt(value))}
                  className="flex gap-4"
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <div key={val} className="flex items-center space-x-2">
                      <RadioGroupItem value={val.toString()} id={`vess-suelo-${bloqueIndex}-${puntoIndex}-${val}`} />
                      <Label htmlFor={`vess-suelo-${bloqueIndex}-${puntoIndex}-${val}`}>{val}</Label>
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
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.textura_predominante`)}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.textura_predominante`, value)}
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
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.color_predominante`)}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.color_predominante`, value)}
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
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.olor_predominante`)}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.olor_predominante`, value)}
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
                  {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.penetrometro_200psi_cm`)}
                  placeholder="0-90 cm"
                />
              </div>

              <div>
                <Label>Nivel de compactación</Label>
                <Select
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.nivel_compactacion`)}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.nivel_compactacion`, value)}
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
                  checked={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.evidencia_compactacion_superficial`)}
                  onCheckedChange={(checked) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.evidencia_compactacion_superficial`, checked)}
                />
                <Label>Evidencia compactación superficial</Label>
              </div>
            </div>

            {/* Condiciones y Salud de la Cobertura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Drenaje</Label>
                <RadioGroup
                  value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.drenaje`)}
                  onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.drenaje`, value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Adecuado" id={`drenaje-adecuado-${bloqueIndex}-${puntoIndex}`} />
                    <Label htmlFor={`drenaje-adecuado-${bloqueIndex}-${puntoIndex}`}>Adecuado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Deficiente" id={`drenaje-deficiente-${bloqueIndex}-${puntoIndex}`} />
                    <Label htmlFor={`drenaje-deficiente-${bloqueIndex}-${puntoIndex}`}>Deficiente</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  checked={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.evidencia_erosion`)}
                  onCheckedChange={(checked) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.evidencia_erosion`, checked)}
                />
                <Label>¿Evidencia de erosión?</Label>
              </div>
            </div>

            {/* Puntuación Salud de la Cobertura */}
            <div>
              <Label>Puntuación salud de la cobertura (0-3)</Label>
              <RadioGroup
                value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.puntuacion_salud_cobertura`)?.toString()}
                onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.puntuacion_salud_cobertura`, parseInt(value))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id={`salud-0-${bloqueIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-0-${bloqueIndex}-${puntoIndex}`}>0 (Muy malo)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id={`salud-1-${bloqueIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-1-${bloqueIndex}-${puntoIndex}`}>1 (Malo)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id={`salud-2-${bloqueIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-2-${bloqueIndex}-${puntoIndex}`}>2 (Regular)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id={`salud-3-${bloqueIndex}-${puntoIndex}`} />
                  <Label htmlFor={`salud-3-${bloqueIndex}-${puntoIndex}`}>3 (Bueno)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conductividad Eléctrica */}
            <div>
              <Label>Conductividad eléctrica</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.conductividad_electrica`)}
                placeholder="Valor de conductividad eléctrica"
              />
            </div>

            {/* Especies no deseadas */}
            <SpeciesNoDeseadas
              bloqueIndex={bloqueIndex}
              puntoIndex={puntoIndex}
              watch={watch}
              setValue={setValue}
            />

            {/* Síntomas de estrés */}
            <SintomasEstres
              bloqueIndex={bloqueIndex}
              puntoIndex={puntoIndex}
              watch={watch}
              setValue={setValue}
            />

            {/* Biodiversidad */}
            <Biodiversidad
              bloqueIndex={bloqueIndex}
              puntoIndex={puntoIndex}
              register={register}
              watch={watch}
              setValue={setValue}
            />

            {/* Fotos */}
            <FotosPunto
              bloqueIndex={bloqueIndex}
              puntoIndex={puntoIndex}
              register={register}
              watch={watch}
              setValue={setValue}
            />

            {/* Observaciones */}
            <div>
              <Label>Observaciones del punto</Label>
              <Textarea
                {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.observaciones_punto`)}
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
function SpeciesNoDeseadas({ bloqueIndex, puntoIndex, watch, setValue }) {
  const hayEspeciesNoDeseadas = watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.especies_no_deseadas_presentes`);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={hayEspeciesNoDeseadas}
          onCheckedChange={(checked) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.especies_no_deseadas_presentes`, checked)}
        />
        <Label>¿Especies no deseadas presentes?</Label>
      </div>

      {hayEspeciesNoDeseadas && (
        <div>
          <Label>Nivel de especies no deseadas</Label>
          <RadioGroup
            value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.nivel_especies_no_deseadas`)}
            onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.nivel_especies_no_deseadas`, value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Bajo" id={`especies-bajo-${bloqueIndex}-${puntoIndex}`} />
              <Label htmlFor={`especies-bajo-${bloqueIndex}-${puntoIndex}`}>Bajo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Medio" id={`especies-medio-${bloqueIndex}-${puntoIndex}`} />
              <Label htmlFor={`especies-medio-${bloqueIndex}-${puntoIndex}`}>Medio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Alto" id={`especies-alto-${bloqueIndex}-${puntoIndex}`} />
              <Label htmlFor={`especies-alto-${bloqueIndex}-${puntoIndex}`}>Alto</Label>
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
function SintomasEstres({ bloqueIndex, puntoIndex, watch, setValue }) {
  const sintomas = watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.sintomas_estres`) || [];

  const handleSintomaChange = (sintoma, checked) => {
    if (checked) {
      setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.sintomas_estres`, [...sintomas, sintoma]);
    } else {
      setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.sintomas_estres`, sintomas.filter(s => s !== sintoma));
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
function Biodiversidad({ bloqueIndex, puntoIndex, register, watch, setValue }) {
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
            {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.lombrices_rojas`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Lombrices GRISES (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.lombrices_grises`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Lombrices BLANCAS (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.lombrices_blancas`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Huevos de lombrices (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.huevos_lombrices`)}
            placeholder="0"
          />
        </div>
        <div>
          <Label>Tipos diferentes huevos (#)</Label>
          <Input
            type="number"
            min="0"
            {...register(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.tipos_diferentes_huevos`)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Micelio y Raíces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Presencia de micelio/hongos</Label>
          <Select
            value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.presencia_micelio_hongos`)}
            onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.presencia_micelio_hongos`, value)}
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
            value={watch(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.raices_activas_visibles`)}
            onValueChange={(value) => setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.raices_activas_visibles`, value)}
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
 */
function FotosPunto({ bloqueIndex, puntoIndex, setValue }) {
  const [previewCultivo, setPreviewCultivo] = useState(null);
  const [previewSuelo, setPreviewSuelo] = useState(null);

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (tipo === 'cultivo') setPreviewCultivo(reader.result);
        if (tipo === 'suelo') setPreviewSuelo(reader.result);

        // Guardar data URL en el form (temporal, hasta implementar upload real)
        setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.foto_${tipo === 'cultivo' ? 'salud_cultivo' : 'perfil_suelo'}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
      <h5 className="font-medium">Fotografías del Punto</h5>
      <p className="text-xs text-muted-foreground">
        ⚠️ Las fotos se guardan localmente por ahora (próximamente: upload a servidor)
      </p>

      {/* Foto 1: Salud del cultivo */}
      <div>
        <Label>Foto salud del cultivo</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'cultivo')}
          className="mt-1"
        />
        {previewCultivo && (
          <div className="mt-2 relative">
            <img src={previewCultivo} alt="Preview cultivo" className="w-full max-w-xs rounded-lg border" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => {
                setPreviewCultivo(null);
                setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.foto_salud_cultivo`, '');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Foto 2: Perfil del suelo */}
      <div>
        <Label>Foto perfil del suelo</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'suelo')}
          className="mt-1"
        />
        {previewSuelo && (
          <div className="mt-2 relative">
            <img src={previewSuelo} alt="Preview suelo" className="w-full max-w-xs rounded-lg border" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => {
                setPreviewSuelo(null);
                setValue(`bloques_evaluados.${bloqueIndex}.puntos_muestreo.${puntoIndex}.foto_perfil_suelo`, '');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sub-componente: Plagas y Enfermedades (9 plagas específicas de Flores)
 */
function PlagasEnfermedades({ index, register, watch, setValue }) {
  const plagas = watch(`bloques_evaluados.${index}.plagas_enfermedades`) || [];

  return (
    <div className="space-y-4 p-4 bg-red-50/30 rounded-lg border border-red-200">
      <h4 className="font-medium text-red-900">Plagas y Enfermedades del Bloque</h4>
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
                      name={`bloque-${index}-plaga-${plagaIndex}`}
                      value={nivel}
                      checked={watch(`bloques_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`) === nivel}
                      onChange={(e) => setValue(`bloques_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`, e.target.value)}
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
              value={watch(`bloques_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`)}
              onValueChange={(value) => setValue(`bloques_evaluados.${index}.plagas_enfermedades.${plagaIndex}.nivel_dano`, value)}
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

      {/* Otras plagas observadas */}
      <div>
        <Label>Otras plagas observadas</Label>
        <Textarea
          {...register(`bloques_evaluados.${index}.otras_plagas_observadas`)}
          placeholder="Describa otras plagas o enfermedades no listadas..."
          rows={2}
        />
      </div>
    </div>
  );
}
