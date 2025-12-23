"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { sistemaProductivoFloresSchema } from "@/lib/validations/diagnostico.schema";
import { Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";

export default function Step2Flores({ data, onChange }) {
  const [activeBloqueIndex, setActiveBloqueIndex] = useState(null);

  const {
    register,
    control,
    formState: { errors },
    watch,
    getValues
  } = useForm({
    resolver: zodResolver(sistemaProductivoFloresSchema),
    defaultValues: data?.datos_flores?.sistema_productivo || {
      cuantos_bloques_productivos: 0,
      bloques: []
    }
  });

  const { fields: bloques, append: appendBloque, remove: removeBloque } = useFieldArray({
    control,
    name: "bloques"
  });

  // Auto-save on change
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        datos_flores: {
          sistema_productivo: formValues
        }
      });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Agregar nuevo bloque
  const handleAddBloque = () => {
    const newBloque = {
      nombre_bloque: `Bloque ${bloques.length + 1}`,
      tallos_cosechados: 0,
      porcentaje_exportacion: 0,
      tiempo_ciclo_cosecha: 0,
      tasa_descarte: 0,
      nutrientes: [],
      precio_venta_kg: 0,
      costo_por_tallo: 0,
      ingreso_neto_m2: 0,
      porcentaje_costos_variables: 0,
      productividad_mano_obra: 0
    };
    appendBloque(newBloque);
    setActiveBloqueIndex(bloques.length);
  };

  // Validar si un bloque está completo
  const isBloqueComplete = (index) => {
    const bloque = getValues(`bloques.${index}`);
    return bloque?.nombre_bloque && bloque.nombre_bloque.trim() !== "";
  };

  // Toggle de bloque activo
  const toggleBloque = (index) => {
    setActiveBloqueIndex(activeBloqueIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Sistema Productivo - Flores</h2>
        <p className="text-sm md:text-base text-gray-600">Información sobre bloques y producción floral</p>
      </div>

      {/* Pregunta inicial */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Label htmlFor="cuantos_bloques_productivos" className="text-base font-semibold">
          ¿Cuántos bloques productivos tiene actualmente?
        </Label>
        <Input
          id="cuantos_bloques_productivos"
          type="number"
          min="0"
          className="mt-2 max-w-xs"
          {...register("cuantos_bloques_productivos")}
        />
        <p className="text-xs text-gray-500 mt-1">
          Este valor es informativo. Agregue los bloques uno por uno usando el botón &quot;+ Agregar bloque&quot;
        </p>
      </div>

      {/* Lista de bloques */}
      {bloques.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base md:text-lg font-semibold">Bloques creados ({bloques.length})</h3>

          {bloques.map((bloque, index) => {
            const isActive = activeBloqueIndex === index;
            const isComplete = isBloqueComplete(index);

            return (
              <Collapsible
                key={bloque.id}
                open={isActive}
                onOpenChange={() => toggleBloque(index)}
                className="border rounded-lg"
              >
                {/* Header del bloque (colapsado) */}
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 md:gap-3">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm md:text-base truncate">
                        {watch(`bloques.${index}.nombre_bloque`) || `Bloque ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar "${watch(`bloques.${index}.nombre_bloque`) || `Bloque ${index + 1}`}"?`)) {
                            removeBloque(index);
                            if (activeBloqueIndex === index) setActiveBloqueIndex(null);
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

                {/* Contenido del bloque (expandido) */}
                <CollapsibleContent>
                  <div className="border-t p-4 md:p-6 bg-gray-50">
                    <BloqueFloralForm
                      index={index}
                      register={register}
                      control={control}
                      errors={errors}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Botón agregar bloque */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddBloque}
        className="w-full md:w-auto border-green-600 text-green-600 hover:bg-green-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar bloque
      </Button>

      {bloques.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm md:text-base">No hay bloques creados. Haga clic en &quot;Agregar bloque&quot; para comenzar.</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: Formulario de un bloque floral
// ============================================
function BloqueFloralForm({ index, register, control, errors }) {
  return (
    <div className="space-y-6">
      {/* Grid principal: 2 columnas en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre del bloque */}
        <div>
          <Label htmlFor={`nombre_bloque_${index}`}>Nombre/Número del bloque *</Label>
          <Input
            id={`nombre_bloque_${index}`}
            placeholder="Ej: Bloque A"
            {...register(`bloques.${index}.nombre_bloque`)}
          />
          {errors?.bloques?.[index]?.nombre_bloque && (
            <p className="text-sm text-destructive">{errors.bloques[index].nombre_bloque.message}</p>
          )}
        </div>

        {/* Tallos cosechados */}
        <div>
          <Label htmlFor={`tallos_${index}`}>Tallos cosechados (tallos/tiempo)</Label>
          <Input
            id={`tallos_${index}`}
            type="number"
            step="1"
            placeholder="0"
            {...register(`bloques.${index}.tallos_cosechados`)}
          />
        </div>

        {/* Porcentaje exportación */}
        <div>
          <Label htmlFor={`exportacion_${index}`}>Porcentaje de tallo de exportación (Calidad Extra) %</Label>
          <Input
            id={`exportacion_${index}`}
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="0"
            {...register(`bloques.${index}.porcentaje_exportacion`)}
          />
        </div>

        {/* Tiempo ciclo cosecha */}
        <div>
          <Label htmlFor={`ciclo_${index}`}>Tiempo de ciclo de cosecha (meses)</Label>
          <Input
            id={`ciclo_${index}`}
            type="number"
            step="0.1"
            placeholder="0"
            {...register(`bloques.${index}.tiempo_ciclo_cosecha`)}
          />
        </div>

        {/* Tasa descarte */}
        <div>
          <Label htmlFor={`descarte_${index}`}>Tasa de descarte/rechazo en poscosecha %</Label>
          <Input
            id={`descarte_${index}`}
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="0"
            {...register(`bloques.${index}.tasa_descarte`)}
          />
        </div>

        {/* Precio venta - CON RESALTADO ROSA */}
        <div>
          <Label htmlFor={`precio_${index}`} className="flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-sm font-semibold">
              ⚠️ Precio venta ($/kg)
            </span>
          </Label>
          <Input
            id={`precio_${index}`}
            type="number"
            step="0.01"
            placeholder="0"
            className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
            {...register(`bloques.${index}.precio_venta_kg`)}
          />
          <p className="text-xs text-pink-600 mt-1">
            Verificar bien este valor antes de continuar
          </p>
        </div>
      </div>

      {/* Array de nutrientes */}
      <NutrientesArray
        bloqueIndex={index}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Subtítulo: Indicadores Económicos */}
      <div className="border-t pt-4">
        <h4 className="text-base md:text-lg font-semibold text-gray-700 mb-4">
          Indicadores Económicos del Bloque
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Costo por tallo */}
          <div>
            <Label htmlFor={`costo_tallo_${index}`}>Costo por tallo producido ($/tallo)</Label>
            <Input
              id={`costo_tallo_${index}`}
              type="number"
              step="0.01"
              placeholder="0"
              {...register(`bloques.${index}.costo_por_tallo`)}
            />
          </div>

          {/* Ingreso neto m2 */}
          <div>
            <Label htmlFor={`ingreso_${index}`}>Ingreso neto por metro cuadrado ($/m²)</Label>
            <Input
              id={`ingreso_${index}`}
              type="number"
              step="0.01"
              placeholder="0"
              {...register(`bloques.${index}.ingreso_neto_m2`)}
            />
          </div>

          {/* Porcentaje costos variables */}
          <div>
            <Label htmlFor={`costos_var_${index}`}>Porcentaje de costos variables %</Label>
            <Input
              id={`costos_var_${index}`}
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0"
              {...register(`bloques.${index}.porcentaje_costos_variables`)}
            />
          </div>

          {/* Productividad mano obra */}
          <div>
            <Label htmlFor={`prod_mano_${index}`}>Productividad de la mano de obra (tallos/jornal)</Label>
            <Input
              id={`prod_mano_${index}`}
              type="number"
              step="0.01"
              placeholder="0"
              {...register(`bloques.${index}.productividad_mano_obra`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Array dinámico de Nutrientes
// ============================================
function NutrientesArray({ bloqueIndex, control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `bloques.${bloqueIndex}.nutrientes`
  });

  const handleAdd = () => {
    append({ nombre: "", cantidad: 0, valor: 0 });
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Consumo de nutrientes (Fertilizantes)</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="text-xs md:text-sm">
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Agregar nutriente
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic">No hay nutrientes agregados</p>
      )}

      {fields.map((field, nutIndex) => (
        <div key={field.id} className="bg-white border rounded-lg p-3 md:p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Nutriente {nutIndex + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(nutIndex)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Nombre */}
            <div>
              <Label htmlFor={`nutriente_nombre_${bloqueIndex}_${nutIndex}`} className="text-xs md:text-sm">
                Nombre
              </Label>
              <Input
                id={`nutriente_nombre_${bloqueIndex}_${nutIndex}`}
                placeholder="Ej: NPK 15-15-15"
                {...register(`bloques.${bloqueIndex}.nutrientes.${nutIndex}.nombre`)}
                className="text-sm"
              />
              {errors?.bloques?.[bloqueIndex]?.nutrientes?.[nutIndex]?.nombre && (
                <p className="text-xs text-destructive">
                  {errors.bloques[bloqueIndex].nutrientes[nutIndex].nombre.message}
                </p>
              )}
            </div>

            {/* Cantidad */}
            <div>
              <Label htmlFor={`nutriente_cantidad_${bloqueIndex}_${nutIndex}`} className="text-xs md:text-sm">
                Cantidad (kg)
              </Label>
              <Input
                id={`nutriente_cantidad_${bloqueIndex}_${nutIndex}`}
                type="number"
                step="0.01"
                placeholder="0"
                {...register(`bloques.${bloqueIndex}.nutrientes.${nutIndex}.cantidad`)}
                className="text-sm"
              />
            </div>

            {/* Valor */}
            <div>
              <Label htmlFor={`nutriente_valor_${bloqueIndex}_${nutIndex}`} className="text-xs md:text-sm">
                Valor ($)
              </Label>
              <Input
                id={`nutriente_valor_${bloqueIndex}_${nutIndex}`}
                type="number"
                step="0.01"
                placeholder="0"
                {...register(`bloques.${bloqueIndex}.nutrientes.${nutIndex}.valor`)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
