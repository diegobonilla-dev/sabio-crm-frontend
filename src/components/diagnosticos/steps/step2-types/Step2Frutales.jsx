"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { sistemaProductivoFrutalesSchema } from "@/lib/validations/diagnostico.schema";
import { Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";

export default function Step2Frutales({ data, onChange }) {
  const [activeLoteIndex, setActiveLoteIndex] = useState(null);

  // Clase CSS para ocultar spin buttons en inputs numéricos
  const numberInputClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(sistemaProductivoFrutalesSchema),
    defaultValues: data?.datos_frutales?.sistema_productivo || {
      cuantos_lotes_productivos: 0,
      lotes: []
    }
  });

  const { fields: lotes, append: appendLote, remove: removeLote } = useFieldArray({
    control,
    name: "lotes"
  });

  // Sincronizar con datos al montar el componente
  useEffect(() => {
    if (data?.datos_frutales?.sistema_productivo) {
      reset(data.datos_frutales.sistema_productivo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Auto-guardar cambios en el formulario (con debounce)
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        datos_frutales: {
          sistema_productivo: formValues
        }
      });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Agregar nuevo lote
  const handleAddLote = () => {
    const newLote = {
      nombre_lote: `Lote ${lotes.length + 1}`,
      arboles_por_ha: 0,
      edad_siembra: 0,
      edad_produccion: 0,
      notas_edad: "",
      rendimiento_ha: 0,
      periodo_rendimiento: "Anual",
      produccion_promedio_arbol: 0,
      porcentaje_exportacion: 0,
      tasa_descarte: 0,
      tipo_riego: "Goteo",
      precio_venta_kg: 0
    };
    appendLote(newLote);
    setActiveLoteIndex(lotes.length);
  };

  // Validar si un lote está completo
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
        <h2 className="text-xl md:text-2xl font-bold">Sistema Productivo - Frutales</h2>
        <p className="text-sm md:text-base text-gray-600">Información sobre lotes y producción frutal</p>
      </div>

      {/* Pregunta inicial */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Label htmlFor="cuantos_lotes_productivos" className="text-base font-semibold">
          ¿Cuántos lotes productivos tiene actualmente?
        </Label>
        <Input
          id="cuantos_lotes_productivos"
          type="number"
          min="0"
          className={`mt-2 max-w-xs ${numberInputClass}`}
          {...register("cuantos_lotes_productivos")}
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
                    <LoteFrutalForm
                      index={index}
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      errors={errors}
                      numberInputClass={numberInputClass}
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
// COMPONENTE: Formulario de un lote frutal
// ============================================
function LoteFrutalForm({ index, register, setValue, watch, errors, numberInputClass }) {
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

        {/* Número de árboles/ha */}
        <div>
          <Label htmlFor={`arboles_${index}`}>Número de árboles/ha</Label>
          <Input
            id={`arboles_${index}`}
            type="number"
            step="1"
            min="0"
            placeholder="0"
            className={numberInputClass}
            {...register(`lotes.${index}.arboles_por_ha`)}
          />
        </div>

        {/* Edad desde siembra */}
        <div>
          <Label htmlFor={`edad_siembra_${index}`}>Edad del cultivo desde siembra (años)</Label>
          <Input
            id={`edad_siembra_${index}`}
            type="number"
            step="0.1"
            min="0"
            placeholder="0"
            className={numberInputClass}
            {...register(`lotes.${index}.edad_siembra`)}
          />
        </div>

        {/* Edad en producción */}
        <div>
          <Label htmlFor={`edad_produccion_${index}`}>Edad en producción real (años)</Label>
          <Input
            id={`edad_produccion_${index}`}
            type="number"
            step="0.1"
            min="0"
            placeholder="0"
            className={numberInputClass}
            {...register(`lotes.${index}.edad_produccion`)}
          />
        </div>
      </div>

      {/* Notas sobre edad/resiembras - Full width */}
      <div>
        <Label htmlFor={`notas_edad_${index}`}>
          Notas sobre edad/resiembras (opcional)
          <span className="text-xs text-gray-500 ml-2 font-normal">
            Ej: Resiembra parcial en 2020, árboles de diferentes edades
          </span>
        </Label>
        <Textarea
          id={`notas_edad_${index}`}
          placeholder="Describa resiembras, variaciones de edad u otras observaciones..."
          rows={2}
          {...register(`lotes.${index}.notas_edad`)}
        />
      </div>

      {/* Grid: Rendimiento y producción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rendimiento por hectárea + Periodo */}
        <div className="md:col-span-2">
          <Label>Rendimiento por hectárea</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            <div>
              <Label htmlFor={`rendimiento_${index}`} className="text-xs text-gray-600">
                kg/ha
              </Label>
              <Input
                id={`rendimiento_${index}`}
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                className={numberInputClass}
                {...register(`lotes.${index}.rendimiento_ha`)}
              />
            </div>
            <div>
              <Label htmlFor={`periodo_rendimiento_${index}`} className="text-xs text-gray-600">
                Periodo
              </Label>
              <Select
                onValueChange={(value) => setValue(`lotes.${index}.periodo_rendimiento`, value)}
                defaultValue={watch(`lotes.${index}.periodo_rendimiento`) || "Anual"}
              >
                <SelectTrigger id={`periodo_rendimiento_${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anual">Anual</SelectItem>
                  <SelectItem value="Por ciclo">Por ciclo</SelectItem>
                  <SelectItem value="Por cosecha">Por cosecha</SelectItem>
                  <SelectItem value="Traviesa">Traviesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Producción promedio por árbol */}
        <div>
          <Label htmlFor={`prod_arbol_${index}`}>
            Producción promedio por árbol (kg/árbol)
            <span className="text-xs text-gray-500 ml-2 font-normal">Opcional</span>
          </Label>
          <Input
            id={`prod_arbol_${index}`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            className={numberInputClass}
            {...register(`lotes.${index}.produccion_promedio_arbol`)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Este valor puede variar por edad y resiembras
          </p>
        </div>

        {/* Porcentaje de exportación */}
        <div>
          <Label htmlFor={`exportacion_${index}`}>Porcentaje de fruta de exportación (%)</Label>
          <Input
            id={`exportacion_${index}`}
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="0"
            className={numberInputClass}
            {...register(`lotes.${index}.porcentaje_exportacion`)}
          />
        </div>

        {/* Tasa de descarte */}
        <div>
          <Label htmlFor={`descarte_${index}`}>Tasa de descarte por plaga/enfermedad (%)</Label>
          <Input
            id={`descarte_${index}`}
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="0"
            className={numberInputClass}
            {...register(`lotes.${index}.tasa_descarte`)}
          />
        </div>

        {/* Tipo de riego */}
        <div>
          <Label htmlFor={`tipo_riego_${index}`}>Tipo de riego (Uso de agua)</Label>
          <Select
            onValueChange={(value) => setValue(`lotes.${index}.tipo_riego`, value)}
            defaultValue={watch(`lotes.${index}.tipo_riego`) || "Goteo"}
          >
            <SelectTrigger id={`tipo_riego_${index}`}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gravedad">Gravedad</SelectItem>
              <SelectItem value="Aspersores">Aspersores</SelectItem>
              <SelectItem value="Goteo">Goteo</SelectItem>
              <SelectItem value="Manguera">Manguera</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Precio venta */}
        <div>
          <Label htmlFor={`precio_${index}`}>Precio venta ($/kg)</Label>
          <Input
            id={`precio_${index}`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            className={numberInputClass}
            {...register(`lotes.${index}.precio_venta_kg`)}
          />
        </div>
      </div>
    </div>
  );
}
