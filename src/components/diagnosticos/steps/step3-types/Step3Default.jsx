"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { fertilizacionFumigacionSchema } from "@/lib/validations/diagnostico.schema";
import { Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Paso 3: Fertilización y Fumigación - General
 *
 * Estructura:
 * - Sección A: Información General (toda la finca)
 * - Sección B: Manejo Diferencial Opcional (por divisiones)
 */
export default function Step3Default({ data, onChange }) {
  const [activeLoteIndex, setActiveLoteIndex] = useState(null);

  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(fertilizacionFumigacionSchema),
    defaultValues: data?.datos_default?.fertilizacion_fumigacion || {
      general: {
        usa_fertilizacion_quimica: false,
        productos_quimicos: [],
        usa_abono_organico: false,
        usa_fertilizante_foliar: false,
        tipos_aplicacion: [],
        usa_fumigacion: false,
        sistemas_fumigacion: [],
        insecticidas: [],
        fungicida: {},
        coadyuvante: {},
        tiene_plan_rotacion: false
      },
      tiene_manejo_diferencial: false,
      cuantos_lotes_diferenciados: 0,
      lotes_diferenciados: []
    }
  });

  // Watches para condicionales
  const usaFertilizacionQuimica = watch("general.usa_fertilizacion_quimica");
  const usaAbonoOrganico = watch("general.usa_abono_organico");
  const usaFumigacion = watch("general.usa_fumigacion");
  const tieneManejoDiferencial = watch("tiene_manejo_diferencial");

  // Arrays dinámicos - Sección General
  const { fields: productosQuimicos, append: appendProducto, remove: removeProducto } = useFieldArray({
    control,
    name: "general.productos_quimicos"
  });

  const { fields: insecticidas, append: appendInsecticida, remove: removeInsecticida } = useFieldArray({
    control,
    name: "general.insecticidas"
  });

  // Arrays dinámicos - Lotes Diferenciados
  const { fields: lotesDiferenciados, append: appendLote, remove: removeLote } = useFieldArray({
    control,
    name: "lotes_diferenciados"
  });

  // Sincronizar con datos al montar el componente
  useEffect(() => {
    if (data?.fertilizacion_fumigacion) {
      reset(data.fertilizacion_fumigacion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Auto-guardar cambios en el formulario (con debounce)
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        fertilizacion_fumigacion: formValues
      });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Handlers
  const handleAddProductoQuimico = () => {
    appendProducto({
      nombre_producto: "",
      formula_npk: "",
      bultos_por_ha: 0,
      periodo: "rotacion",
      costo_por_bulto: 0
    });
  };

  const handleAddInsecticida = () => {
    appendInsecticida({
      nombre_comercial: "",
      ingrediente_activo: "",
      dosis: 0,
      unidad_dosis: "cc/L"
    });
  };

  const handleAddLoteDiferenciado = () => {
    const newLote = {
      nombre_lote: `División ${lotesDiferenciados.length + 1}`,
      usa_fertilizacion_quimica: false,
      productos_quimicos: [],
      usa_abono_organico: false,
      usa_fumigacion: false,
      insecticidas: [],
      observaciones: ""
    };
    appendLote(newLote);
    setActiveLoteIndex(lotesDiferenciados.length);
  };

  const toggleLote = (index) => {
    setActiveLoteIndex(activeLoteIndex === index ? null : index);
  };

  const isLoteComplete = (index) => {
    const lote = getValues(`lotes_diferenciados.${index}`);
    return lote?.nombre_lote && lote.nombre_lote.trim() !== "";
  };

  // Handler para checkboxes múltiples
  const handleTipoAplicacionChange = (value, checked) => {
    const current = watch("general.tipos_aplicacion") || [];
    if (checked) {
      setValue("general.tipos_aplicacion", [...current, value]);
    } else {
      setValue("general.tipos_aplicacion", current.filter(v => v !== value));
    }
  };

  const handleSistemaFumigacionChange = (value, checked) => {
    const current = watch("general.sistemas_fumigacion") || [];
    if (checked) {
      setValue("general.sistemas_fumigacion", [...current, value]);
    } else {
      setValue("general.sistemas_fumigacion", current.filter(v => v !== value));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Fertilización y Fumigación - General</h2>
        <p className="text-sm md:text-base text-gray-600">Información general y manejo diferencial por división</p>
      </div>

      {/* ========================================== */}
      {/* SECCIÓN A: INFORMACIÓN GENERAL            */}
      {/* ========================================== */}
      <div className="border-2 border-blue-200 rounded-lg p-4 md:p-6 bg-blue-50/30">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-blue-900">Sección A: Información General de la Finca</h3>

        {/* ============ FERTILIZACIÓN ============ */}
        <div className="space-y-6 bg-white rounded-lg p-4 md:p-6 border">
          <h4 className="text-base md:text-lg font-semibold text-gray-900">Fertilización</h4>

          {/* ¿Usa fertilización química? */}
          <div>
            <Label htmlFor="usa_fertilizacion_quimica" className="text-base font-semibold">
              ¿Usa fertilización química? *
            </Label>
            <Select
              onValueChange={(value) => setValue("general.usa_fertilizacion_quimica", value === "true")}
              defaultValue={watch("general.usa_fertilizacion_quimica")?.toString() || "false"}
            >
              <SelectTrigger className="mt-2 max-w-xs">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condicional: Si usa fertilización química */}
          {usaFertilizacionQuimica && (
            <div className="space-y-4 pl-4 border-l-4 border-green-500">
              {/* Costo del último año */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="costo_ultimo_ano">Costo del último año en fertilización ($)</Label>
                  <Input
                    id="costo_ultimo_ano"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...register("general.costo_ultimo_ano_fertilizacion")}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={watch("general.costo_fertilizacion_es_aproximado") || false}
                      onCheckedChange={(checked) => setValue("general.costo_fertilizacion_es_aproximado", checked)}
                    />
                    <span className="text-sm">Es aproximado</span>
                  </label>
                </div>
              </div>

              {/* Productos químicos - Array dinámico */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Productos Químicos</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddProductoQuimico}
                    className="text-xs md:text-sm border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Agregar producto
                  </Button>
                </div>

                {productosQuimicos.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No hay productos agregados</p>
                )}

                {productosQuimicos.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 border rounded-lg p-3 md:p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Producto {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProducto(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Nombre del producto */}
                      <div className="md:col-span-2">
                        <Label className="text-xs md:text-sm">Nombre del producto *</Label>
                        <Input
                          placeholder="Ej: Urea"
                          {...register(`general.productos_quimicos.${index}.nombre_producto`)}
                          className="text-sm"
                        />
                        {errors?.general?.productos_quimicos?.[index]?.nombre_producto && (
                          <p className="text-xs text-destructive">
                            {errors.general.productos_quimicos[index].nombre_producto.message}
                          </p>
                        )}
                      </div>

                      {/* Fórmula N-P-K */}
                      <div className="bg-pink-50 border border-pink-200 rounded p-2">
                        <Label className="text-xs md:text-sm">Fórmula N-P-K</Label>
                        <Input
                          placeholder="Ej: 46-0-0"
                          {...register(`general.productos_quimicos.${index}.formula_npk`)}
                          className="text-sm mt-1"
                        />
                        <p className="text-xs text-pink-700 mt-1">🟣 Consultar con técnico: ¿Implementar base de datos de productos?</p>
                      </div>

                      {/* Bultos por HA */}
                      <div>
                        <Label className="text-xs md:text-sm">Bultos por HA</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          {...register(`general.productos_quimicos.${index}.bultos_por_ha`)}
                          className="text-sm"
                        />
                      </div>

                      {/* Periodo */}
                      <div>
                        <Label className="text-xs md:text-sm">Periodo</Label>
                        <Select
                          onValueChange={(value) => setValue(`general.productos_quimicos.${index}.periodo`, value)}
                          defaultValue={watch(`general.productos_quimicos.${index}.periodo`) || "rotacion"}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rotacion">Por rotación</SelectItem>
                            <SelectItem value="ciclo">Por ciclo</SelectItem>
                            <SelectItem value="anual">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Costo por bulto */}
                      <div className="bg-pink-50 border border-pink-200 rounded p-2">
                        <Label className="text-xs md:text-sm">Costo por bulto (50kg) $</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          {...register(`general.productos_quimicos.${index}.costo_por_bulto`)}
                          className="text-sm mt-1"
                        />
                        <p className="text-xs text-pink-700 mt-1">🟣 Consultar: ¿Base de datos de precios?</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ¿Usa abono orgánico? */}
          <div>
            <Label htmlFor="usa_abono_organico" className="text-base font-semibold">
              ¿Usa abono orgánico? *
            </Label>
            <Select
              onValueChange={(value) => setValue("general.usa_abono_organico", value === "true")}
              defaultValue={watch("general.usa_abono_organico")?.toString() || "false"}
            >
              <SelectTrigger className="mt-2 max-w-xs">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condicional: Si usa abono orgánico */}
          {usaAbonoOrganico && (
            <div className="space-y-4 pl-4 border-l-4 border-green-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de abono */}
                <div>
                  <Label>Tipo de abono orgánico</Label>
                  <Select
                    onValueChange={(value) => setValue("general.tipo_abono_organico", value)}
                    defaultValue={watch("general.tipo_abono_organico") || "CASERO"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASERO">CASERO</SelectItem>
                      <SelectItem value="COMERCIAL">COMERCIAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Costo */}
                <div>
                  <Label>Costo del abono orgánico</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      className="flex-1"
                      {...register("general.costo_abono_organico")}
                    />
                    <Select
                      onValueChange={(value) => setValue("general.unidad_costo_abono", value)}
                      defaultValue={watch("general.unidad_costo_abono") || "bulto"}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bulto">Por bulto</SelectItem>
                        <SelectItem value="kg">Por kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ¿Usa fertilizante foliar? */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <Label htmlFor="usa_fertilizante_foliar" className="text-base font-semibold">
              ¿Usa fertilizante foliar? *
            </Label>
            <Select
              onValueChange={(value) => setValue("general.usa_fertilizante_foliar", value === "true")}
              defaultValue={watch("general.usa_fertilizante_foliar")?.toString() || "false"}
            >
              <SelectTrigger className="mt-2 max-w-xs">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-pink-700 mt-2">🟣 Consultar: ¿Este campo es general o solo para Frutales/Café/Aguacate?</p>
          </div>

          {/* Tipo de aplicación (múltiple) */}
          <div>
            <Label className="text-base font-semibold">Tipo de aplicación (seleccione todas las que apliquen)</Label>
            <div className="mt-2 space-y-2">
              {['Granular', 'Liquido', 'Foliar'].map((tipo) => (
                <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={(watch("general.tipos_aplicacion") || []).includes(tipo)}
                    onCheckedChange={(checked) => handleTipoAplicacionChange(tipo, checked)}
                  />
                  <span className="text-sm">{tipo}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ============ FUMIGACIÓN ============ */}
        <div className="space-y-6 bg-white rounded-lg p-4 md:p-6 border mt-6">
          <h4 className="text-base md:text-lg font-semibold text-gray-900">Fumigación</h4>

          {/* ¿Usa fumigación? */}
          <div>
            <Label htmlFor="usa_fumigacion" className="text-base font-semibold">
              ¿Usa fumigación? *
            </Label>
            <Select
              onValueChange={(value) => setValue("general.usa_fumigacion", value === "true")}
              defaultValue={watch("general.usa_fumigacion")?.toString() || "false"}
            >
              <SelectTrigger className="mt-2 max-w-xs">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condicional: Si usa fumigación */}
          {usaFumigacion && (
            <div className="space-y-4 pl-4 border-l-4 border-blue-500">
              {/* Sistema de fumigación (múltiple) */}
              <div>
                <Label className="text-base font-semibold">Sistema de fumigación (seleccione todos los que use)</Label>
                <div className="mt-2 space-y-2">
                  {[
                    'Canecas con gravedad',
                    'Canecas con estacionaria',
                    'Fumigadora',
                    'Bomba de espalda',
                    'Otro'
                  ].map((sistema) => (
                    <label key={sistema} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={(watch("general.sistemas_fumigacion") || []).includes(sistema)}
                        onCheckedChange={(checked) => handleSistemaFumigacionChange(sistema, checked)}
                      />
                      <span className="text-sm">{sistema}</span>
                    </label>
                  ))}
                </div>

                {/* Otro sistema (condicional) */}
                {(watch("general.sistemas_fumigacion") || []).includes('Otro') && (
                  <div className="mt-2 ml-6">
                    <Label className="text-xs md:text-sm">Especifique otro sistema</Label>
                    <Input
                      placeholder="Escriba aquí"
                      {...register("general.otro_sistema_fumigacion")}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Costo anual de venenos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Costo anual de venenos ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...register("general.costo_anual_venenos")}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={watch("general.costo_venenos_es_aproximado") || false}
                      onCheckedChange={(checked) => setValue("general.costo_venenos_es_aproximado", checked)}
                    />
                    <span className="text-sm">Es aproximado</span>
                  </label>
                </div>
              </div>

              {/* Insecticidas - Array dinámico */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Insecticidas</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddInsecticida}
                    className="text-xs md:text-sm border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Agregar insecticida
                  </Button>
                </div>

                {insecticidas.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No hay insecticidas agregados</p>
                )}

                {insecticidas.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 border rounded-lg p-3 md:p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Insecticida {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInsecticida(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Nombre comercial */}
                      <div className="md:col-span-2">
                        <Label className="text-xs md:text-sm">Nombre comercial *</Label>
                        <Input
                          placeholder="Ej: Karate"
                          {...register(`general.insecticidas.${index}.nombre_comercial`)}
                          className="text-sm"
                        />
                        {errors?.general?.insecticidas?.[index]?.nombre_comercial && (
                          <p className="text-xs text-destructive">
                            {errors.general.insecticidas[index].nombre_comercial.message}
                          </p>
                        )}
                      </div>

                      {/* Ingrediente activo */}
                      <div className="bg-pink-50 border border-pink-200 rounded p-2">
                        <Label className="text-xs md:text-sm">Ingrediente activo</Label>
                        <Input
                          placeholder="Ej: Lambda-cyhalothrin"
                          {...register(`general.insecticidas.${index}.ingrediente_activo`)}
                          className="text-sm mt-1"
                        />
                        <p className="text-xs text-pink-700 mt-1">🟣 Consultar: ¿Base de datos de ingredientes activos?</p>
                      </div>

                      {/* Dosis */}
                      <div>
                        <Label className="text-xs md:text-sm">Dosis</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0"
                            className="flex-1 text-sm"
                            {...register(`general.insecticidas.${index}.dosis`)}
                          />
                          <Select
                            onValueChange={(value) => setValue(`general.insecticidas.${index}.unidad_dosis`, value)}
                            defaultValue={watch(`general.insecticidas.${index}.unidad_dosis`) || "cc/L"}
                          >
                            <SelectTrigger className="w-28 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ml/200L">ml/200L</SelectItem>
                              <SelectItem value="cc/L">cc/L</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fungicida (único) */}
              <div className="bg-gray-50 border rounded-lg p-3 md:p-4">
                <h5 className="text-sm font-semibold mb-3">Fungicida</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Label className="text-xs md:text-sm">Nombre comercial</Label>
                    <Input
                      placeholder="Ej: Score"
                      {...register("general.fungicida.nombre_comercial")}
                      className="text-sm"
                    />
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded p-2">
                    <Label className="text-xs md:text-sm">Ingrediente activo</Label>
                    <Input
                      placeholder="Ej: Difenoconazole"
                      {...register("general.fungicida.ingrediente_activo")}
                      className="text-sm mt-1"
                    />
                    <p className="text-xs text-pink-700 mt-1">🟣 Consultar: ¿Base de datos?</p>
                  </div>
                  <div>
                    <Label className="text-xs md:text-sm">Dosis (cc/L)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...register("general.fungicida.dosis")}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Coadyuvante (único) */}
              <div className="bg-gray-50 border rounded-lg p-3 md:p-4">
                <h5 className="text-sm font-semibold mb-3">Coadyuvante</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Label className="text-xs md:text-sm">Nombre comercial</Label>
                    <Input
                      placeholder="Ej: Cosmoagua"
                      {...register("general.coadyuvante.nombre_comercial")}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs md:text-sm">Ingrediente activo</Label>
                    <Input
                      placeholder="Ej: Nonilfenol"
                      {...register("general.coadyuvante.ingrediente_activo")}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs md:text-sm">Dosis (cc/L)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...register("general.coadyuvante.dosis")}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Rotación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>¿Tienen plan de rotación de productos?</Label>
                  <Select
                    onValueChange={(value) => setValue("general.tiene_plan_rotacion", value === "true")}
                    defaultValue={watch("general.tiene_plan_rotacion")?.toString() || "false"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Sí</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rotación sugerida (días)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    {...register("general.rotacion_dias")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* SECCIÓN B: MANEJO DIFERENCIAL            */}
      {/* ========================================== */}
      <div className="border-2 border-purple-200 rounded-lg p-4 md:p-6 bg-purple-50/30">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-purple-900">Sección B: Manejo Diferencial por División (Opcional)</h3>

        {/* Pregunta inicial */}
        <div className="bg-white border border-purple-200 rounded-lg p-4 mb-4">
          <Label htmlFor="tiene_manejo_diferencial" className="text-base font-semibold">
            ¿Tiene manejo diferencial de fertilización/fumigación por divisiones?
          </Label>
          <Select
            onValueChange={(value) => setValue("tiene_manejo_diferencial", value === "true")}
            defaultValue={watch("tiene_manejo_diferencial")?.toString() || "false"}
          >
            <SelectTrigger className="mt-2 max-w-xs">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sí</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-2">
            Si maneja algunos divisiones de forma diferente al resto, seleccione &quot;Sí&quot;
          </p>
        </div>

        {/* Condicional: Si tiene manejo diferencial */}
        {tieneManejoDiferencial && (
          <div className="space-y-4">
            {/* Pregunta informativa */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <Label htmlFor="cuantos_lotes_diferenciados" className="text-base font-semibold">
                ¿Cuántos divisiones tienen manejo diferencial?
              </Label>
              <Input
                id="cuantos_lotes_diferenciados"
                type="number"
                min="0"
                className="mt-2 max-w-xs"
                {...register("cuantos_lotes_diferenciados")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Este valor es informativo. Agregue los divisiones uno por uno usando el botón &quot;+ Agregar división&quot;
              </p>
            </div>

            {/* Lista de lotes diferenciados */}
            {lotesDiferenciados.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base md:text-lg font-semibold">Divisións con manejo diferencial ({lotesDiferenciados.length})</h4>

                {lotesDiferenciados.map((lote, index) => {
                  const isActive = activeLoteIndex === index;
                  const isComplete = isLoteComplete(index);

                  return (
                    <Collapsible
                      key={lote.id}
                      open={isActive}
                      onOpenChange={() => toggleLote(index)}
                      className="border rounded-lg bg-white"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2 md:gap-3">
                            {isComplete ? (
                              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 flex-shrink-0" />
                            )}
                            <span className="font-medium text-sm md:text-base truncate">
                              {watch(`lotes_diferenciados.${index}.nombre_lote`) || `División ${index + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`¿Eliminar "${watch(`lotes_diferenciados.${index}.nombre_lote`) || `División ${index + 1}`}"?`)) {
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

                      <CollapsibleContent>
                        <div className="border-t p-4 md:p-6 bg-gray-50">
                          <LoteDiferenciadoForm
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

            {/* Botón agregar división */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddLoteDiferenciado}
              className="w-full md:w-auto border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar división
            </Button>

            {lotesDiferenciados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm md:text-base">No hay divisiones diferenciados. Haga clic en &quot;Agregar división&quot; para comenzar.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Formulario de lote diferenciado
// ============================================
function LoteDiferenciadoForm({ index, register, control, setValue, watch, errors }) {
  const usaFertilizacionQuimica = watch(`lotes_diferenciados.${index}.usa_fertilizacion_quimica`);
  const usaFumigacion = watch(`lotes_diferenciados.${index}.usa_fumigacion`);

  // Arrays dinámicos dentro del lote
  const { fields: productosQuimicos, append: appendProducto, remove: removeProducto } = useFieldArray({
    control,
    name: `lotes_diferenciados.${index}.productos_quimicos`
  });

  const { fields: insecticidas, append: appendInsecticida, remove: removeInsecticida } = useFieldArray({
    control,
    name: `lotes_diferenciados.${index}.insecticidas`
  });

  return (
    <div className="space-y-4">
      {/* Nombre del división */}
      <div>
        <Label htmlFor={`nombre_lote_${index}`}>Nombre/Número del división *</Label>
        <Input
          id={`nombre_lote_${index}`}
          placeholder="Ej: División 1"
          {...register(`lotes_diferenciados.${index}.nombre_lote`)}
        />
        {errors?.lotes_diferenciados?.[index]?.nombre_lote && (
          <p className="text-sm text-destructive">{errors.lotes_diferenciados[index].nombre_lote.message}</p>
        )}
      </div>

      {/* ¿Usa fertilización química? */}
      <div>
        <Label>¿Usa fertilización química en este división?</Label>
        <Select
          onValueChange={(value) => setValue(`lotes_diferenciados.${index}.usa_fertilizacion_quimica`, value === "true")}
          defaultValue={watch(`lotes_diferenciados.${index}.usa_fertilizacion_quimica`)?.toString() || "false"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Sí</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Condicional: Productos químicos */}
      {usaFertilizacionQuimica && (
        <div className="space-y-3 pl-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Productos químicos en este división</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendProducto({
                nombre_producto: "",
                formula_npk: "",
                bultos_por_ha: 0,
                periodo: "rotacion",
                costo_por_bulto: 0
              })}
              className="text-xs border-green-600 text-green-600"
            >
              <Plus className="h-3 w-3 mr-1" />
              Agregar
            </Button>
          </div>

          {productosQuimicos.map((field, pIndex) => (
            <div key={field.id} className="bg-white border rounded p-2 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Producto {pIndex + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProducto(pIndex)}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Nombre del producto"
                {...register(`lotes_diferenciados.${index}.productos_quimicos.${pIndex}.nombre_producto`)}
                className="text-xs"
              />
            </div>
          ))}

          {productosQuimicos.length === 0 && (
            <p className="text-xs text-gray-500 italic">No hay productos agregados</p>
          )}
        </div>
      )}

      {/* ¿Usa fumigación? */}
      <div>
        <Label>¿Usa fumigación en este división?</Label>
        <Select
          onValueChange={(value) => setValue(`lotes_diferenciados.${index}.usa_fumigacion`, value === "true")}
          defaultValue={watch(`lotes_diferenciados.${index}.usa_fumigacion`)?.toString() || "false"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Sí</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Condicional: Insecticidas */}
      {usaFumigacion && (
        <div className="space-y-3 pl-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Insecticidas en este división</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendInsecticida({
                nombre_comercial: "",
                ingrediente_activo: "",
                dosis: 0,
                unidad_dosis: "cc/L"
              })}
              className="text-xs border-blue-600 text-blue-600"
            >
              <Plus className="h-3 w-3 mr-1" />
              Agregar
            </Button>
          </div>

          {insecticidas.map((field, iIndex) => (
            <div key={field.id} className="bg-white border rounded p-2 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Insecticida {iIndex + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInsecticida(iIndex)}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Nombre comercial"
                {...register(`lotes_diferenciados.${index}.insecticidas.${iIndex}.nombre_comercial`)}
                className="text-xs"
              />
            </div>
          ))}

          {insecticidas.length === 0 && (
            <p className="text-xs text-gray-500 italic">No hay insecticidas agregados</p>
          )}
        </div>
      )}

      {/* Observaciones */}
      <div>
        <Label>Observaciones de este división</Label>
        <Input
          placeholder="Notas adicionales..."
          {...register(`lotes_diferenciados.${index}.observaciones`)}
        />
      </div>
    </div>
  );
}
