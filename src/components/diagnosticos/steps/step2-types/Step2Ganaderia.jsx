"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { sistemaProductivoGanaderiaSchema } from "@/lib/validations/diagnostico.schema";
import { Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";

export default function Step2Ganaderia({ data, onChange }) {
  const [activeLoteIndex, setActiveLoteIndex] = useState(null);

  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues
  } = useForm({
    resolver: zodResolver(sistemaProductivoGanaderiaSchema),
    defaultValues: data?.datos_ganaderia?.sistema_productivo || {
      cuantos_lotes_alta_produccion: 0,
      lotes: []
    }
  });

  const { fields: lotes, append: appendLote, remove: removeLote } = useFieldArray({
    control,
    name: "lotes"
  });

  // Auto-save on change
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        datos_ganaderia: {
          sistema_productivo: formValues
        }
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [formValues]);

  // Agregar nuevo lote
  const handleAddLote = () => {
    const newLote = {
      nombre_lote: `Lote ${lotes.length + 1}`,
      total_litros: 0,
      periodo_litros: "litros_dia",
      total_litros_305_dias: 0,
      numero_vacas_ordeno: 0,
      precio_venta_leche: 0,
      concentrado_total_kg_dia: 0,
      precio_concentrado_kg: 0,
      usa_suplemento: false,
      suplementos: [],
      materia_seca: [],
      raza_predominante: "",
      peso_promedio_vaca: 0
    };
    appendLote(newLote);
    setActiveLoteIndex(lotes.length); // Expandir el nuevo lote
  };

  // Validar si un lote está completo (campos requeridos)
  const isLoteComplete = (index) => {
    const lote = getValues(`lotes.${index}`);
    return lote?.nombre_lote && lote.nombre_lote.trim() !== "";
  };

  // Toggle de lote activo
  const toggleLote = (index) => {
    setActiveLoteIndex(activeLoteIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Sistema Productivo - Ganadería/Lechería</h2>
        <p className="text-sm md:text-base text-gray-600">Información sobre lotes de alta producción</p>
      </div>

      {/* Pregunta inicial */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Label htmlFor="cuantos_lotes_alta_produccion" className="text-base font-semibold">
          ¿Cuántos lotes de alta producción tiene actualmente?
        </Label>
        <Input
          id="cuantos_lotes_alta_produccion"
          type="number"
          min="0"
          className="mt-2 max-w-xs"
          {...register("cuantos_lotes_alta_produccion")}
        />
        <p className="text-xs text-gray-500 mt-1">
          Este valor es informativo. Agregue los lotes uno por uno usando el botón &quot;+ Agregar lote&quot;
        </p>
      </div>

      {/* Lista de lotes */}
      {lotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base md:text-lg font-semibold">Lotes creados ({lotes.length})</h3>

          {lotes.map((lote, index) => {
            const isActive = activeLoteIndex === index;
            const isComplete = isLoteComplete(index);

            return (
              <Collapsible
                key={lote.id}
                open={isActive}
                onOpenChange={() => toggleLote(index)}
                className="border rounded-lg"
              >
                {/* Header del lote (colapsado) */}
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 md:gap-3">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm md:text-base truncate">
                        {watch(`lotes.${index}.nombre_lote`) || `Lote ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar "${watch(`lotes.${index}.nombre_lote`) || `Lote ${index + 1}`}"?`)) {
                            removeLote(index);
                            if (activeLoteIndex === index) setActiveLoteIndex(null);
                          }
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {isActive ? (
                        <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Contenido del lote (expandido) */}
                <CollapsibleContent>
                  <div className="border-t p-4 md:p-6 bg-gray-50">
                    <LoteForm
                      index={index}
                      register={register}
                      control={control}
                      setValue={setValue}
                      watch={watch}
                      errors={errors}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Botón agregar lote */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddLote}
        className="w-full md:w-auto border-green-600 text-green-600 hover:bg-green-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar lote
      </Button>

      {lotes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm md:text-base">No hay lotes creados. Haga clic en &quot;Agregar lote&quot; para comenzar.</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: Formulario de un lote individual
// ============================================
function LoteForm({ index, register, control, setValue, watch, errors }) {
  const usaSuplemento = watch(`lotes.${index}.usa_suplemento`);

  return (
    <div className="space-y-4">
      {/* Grid responsive: 1 col en mobile, 2 cols en tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre del lote */}
        <div>
          <Label htmlFor={`nombre_lote_${index}`}>Nombre/Número del lote *</Label>
          <Input
            id={`nombre_lote_${index}`}
            placeholder="Ej: Lote A"
            {...register(`lotes.${index}.nombre_lote`)}
          />
          {errors?.lotes?.[index]?.nombre_lote && (
            <p className="text-sm text-destructive">{errors.lotes[index].nombre_lote.message}</p>
          )}
        </div>

        {/* Total litros + Periodo */}
        <div>
          <Label>Total litros del lote</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="0"
              className="flex-1"
              {...register(`lotes.${index}.total_litros`)}
            />
            <Select
              onValueChange={(value) => setValue(`lotes.${index}.periodo_litros`, value)}
              defaultValue={watch(`lotes.${index}.periodo_litros`) || "litros_dia"}
            >
              <SelectTrigger className="w-32 md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="litros_dia">Litros/día</SelectItem>
                <SelectItem value="litros_mes">Litros/mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Total litros 305 días */}
        <div>
          <Label htmlFor={`total_305_${index}`}>Total litros 305 días (opcional)</Label>
          <Input
            id={`total_305_${index}`}
            type="number"
            step="0.01"
            placeholder="0"
            {...register(`lotes.${index}.total_litros_305_dias`)}
          />
        </div>

        {/* Número de vacas en ordeño */}
        <div>
          <Label htmlFor={`vacas_${index}`}>Número de vacas en ordeño</Label>
          <Input
            id={`vacas_${index}`}
            type="number"
            placeholder="0"
            {...register(`lotes.${index}.numero_vacas_ordeno`)}
          />
        </div>

        {/* Precio venta leche */}
        <div>
          <Label htmlFor={`precio_leche_${index}`}>Precio venta leche ($/L)</Label>
          <Input
            id={`precio_leche_${index}`}
            type="number"
            step="0.01"
            placeholder="0"
            {...register(`lotes.${index}.precio_venta_leche`)}
          />
        </div>

        {/* Concentrado total */}
        <div>
          <Label htmlFor={`concentrado_${index}`}>Concentrado total (kg/día)</Label>
          <Input
            id={`concentrado_${index}`}
            type="number"
            step="0.01"
            placeholder="0"
            {...register(`lotes.${index}.concentrado_total_kg_dia`)}
          />
        </div>

        {/* Precio concentrado */}
        <div>
          <Label htmlFor={`precio_concentrado_${index}`}>Precio concentrado ($/kg)</Label>
          <Input
            id={`precio_concentrado_${index}`}
            type="number"
            step="0.01"
            placeholder="0"
            {...register(`lotes.${index}.precio_concentrado_kg`)}
          />
        </div>

        {/* ¿Usa suplemento? */}
        <div>
          <Label htmlFor={`usa_suplemento_${index}`}>¿Usa suplemento?</Label>
          <Select
            onValueChange={(value) => setValue(`lotes.${index}.usa_suplemento`, value === "true")}
            defaultValue={watch(`lotes.${index}.usa_suplemento`)?.toString() || "false"}
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

      {/* Suplementos (condicional) */}
      {usaSuplemento && (
        <SuplementosArray
          loteIndex={index}
          control={control}
          register={register}
          errors={errors}
        />
      )}

      {/* Materia seca */}
      <MateriaSecaArray
        loteIndex={index}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Grid final: raza y peso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raza predominante */}
        <div>
          <Label htmlFor={`raza_${index}`}>Raza predominante</Label>
          <Input
            id={`raza_${index}`}
            placeholder="Ej: Holstein"
            {...register(`lotes.${index}.raza_predominante`)}
          />
        </div>

        {/* Peso promedio vaca */}
        <div>
          <Label htmlFor={`peso_${index}`}>Peso promedio vaca (kg)</Label>
          <Input
            id={`peso_${index}`}
            type="number"
            step="0.01"
            placeholder="0"
            {...register(`lotes.${index}.peso_promedio_vaca`)}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Array dinámico de Suplementos
// ============================================
function SuplementosArray({ loteIndex, control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `lotes.${loteIndex}.suplementos`
  });

  const handleAdd = () => {
    append({ tipo: "", kgDia: 0, precioKg: 0 });
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Suplementos</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="text-xs md:text-sm">
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Agregar suplemento
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic">No hay suplementos agregados</p>
      )}

      {fields.map((field, supIndex) => (
        <div key={field.id} className="bg-white border rounded-lg p-3 md:p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Suplemento {supIndex + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(supIndex)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Tipo */}
            <div>
              <Label htmlFor={`suplemento_tipo_${loteIndex}_${supIndex}`} className="text-xs md:text-sm">
                Tipo
              </Label>
              <Input
                id={`suplemento_tipo_${loteIndex}_${supIndex}`}
                placeholder="Ej: Melaza"
                {...register(`lotes.${loteIndex}.suplementos.${supIndex}.tipo`)}
                className="text-sm"
              />
              {errors?.lotes?.[loteIndex]?.suplementos?.[supIndex]?.tipo && (
                <p className="text-xs text-destructive">
                  {errors.lotes[loteIndex].suplementos[supIndex].tipo.message}
                </p>
              )}
            </div>

            {/* kg/día */}
            <div>
              <Label htmlFor={`suplemento_kg_${loteIndex}_${supIndex}`} className="text-xs md:text-sm">
                kg/vaca/día
              </Label>
              <Input
                id={`suplemento_kg_${loteIndex}_${supIndex}`}
                type="number"
                step="0.01"
                placeholder="0"
                {...register(`lotes.${loteIndex}.suplementos.${supIndex}.kgDia`)}
                className="text-sm"
              />
            </div>

            {/* Precio */}
            <div>
              <Label htmlFor={`suplemento_precio_${loteIndex}_${supIndex}`} className="text-xs md:text-sm">
                Precio ($/kg)
              </Label>
              <Input
                id={`suplemento_precio_${loteIndex}_${supIndex}`}
                type="number"
                step="0.01"
                placeholder="0"
                {...register(`lotes.${loteIndex}.suplementos.${supIndex}.precioKg`)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// COMPONENTE: Array dinámico de Materia Seca
// ============================================
function MateriaSecaArray({ loteIndex, control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `lotes.${loteIndex}.materia_seca`
  });

  const handleAdd = () => {
    append({ tipo: "", porcentaje: 0 });
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">% Materia Seca</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="text-xs md:text-sm">
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Agregar materia seca
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic">No hay materia seca agregada</p>
      )}

      {fields.map((field, msIndex) => (
        <div key={field.id} className="bg-white border rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Materia Seca {msIndex + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(msIndex)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tipo */}
            <div>
              <Label htmlFor={`ms_tipo_${loteIndex}_${msIndex}`} className="text-xs md:text-sm">
                Tipo
              </Label>
              <Input
                id={`ms_tipo_${loteIndex}_${msIndex}`}
                placeholder="Ej: Heno, Retalanche"
                {...register(`lotes.${loteIndex}.materia_seca.${msIndex}.tipo`)}
                className="text-sm"
              />
              {errors?.lotes?.[loteIndex]?.materia_seca?.[msIndex]?.tipo && (
                <p className="text-xs text-destructive">
                  {errors.lotes[loteIndex].materia_seca[msIndex].tipo.message}
                </p>
              )}
            </div>

            {/* Porcentaje */}
            <div>
              <Label htmlFor={`ms_porcentaje_${loteIndex}_${msIndex}`} className="text-xs md:text-sm">
                Porcentaje (%)
              </Label>
              <Input
                id={`ms_porcentaje_${loteIndex}_${msIndex}`}
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0"
                {...register(`lotes.${loteIndex}.materia_seca.${msIndex}.porcentaje`)}
                className="text-sm"
              />
              {errors?.lotes?.[loteIndex]?.materia_seca?.[msIndex]?.porcentaje && (
                <p className="text-xs text-destructive">
                  {errors.lotes[loteIndex].materia_seca[msIndex].porcentaje.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
