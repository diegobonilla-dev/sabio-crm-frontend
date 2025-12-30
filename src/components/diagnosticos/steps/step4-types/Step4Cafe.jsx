"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * Paso 4: Manejo de Cultivo - Café (Placeholder)
 */
export default function Step4Cafe({ data, onChange }) {
  const { register, watch, setValue, reset } = useForm({
    defaultValues: data?.datos_cafe?.manejo_cultivo || { tipo_manejo: "", observaciones_generales: "" }
  });

  // Sincronizar con datos al montar el componente
  useEffect(() => {
    if (data?.datos_cafe?.manejo_cultivo) {
      reset(data.datos_cafe.manejo_cultivo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ datos_cafe: { manejo_cultivo: formValues } });
    }, 300);
    return () => clearTimeout(timeout);
  }, [formValues, onChange]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/30 border border-blue-200 rounded-lg p-6 space-y-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">☕</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Información General de Manejo de Cultivo</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>⚠️ En desarrollo:</strong> Este formulario se adaptará según las necesidades específicas de café.
              </p>
              <p className="text-xs text-yellow-700">
                Próximamente: manejo de sombra, poda, renovación, broca, roya, y otras prácticas específicas.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4 mt-6">
          <div>
            <Label>Tipo de manejo</Label>
            <Select value={watch("tipo_manejo")} onValueChange={(value) => setValue("tipo_manejo", value)}>
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Orgánico">Orgánico</SelectItem>
                <SelectItem value="Convencional">Convencional</SelectItem>
                <SelectItem value="Mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Observaciones generales</Label>
            <Textarea {...register("observaciones_generales")} rows={6} />
          </div>
        </div>
      </div>
      <div className="bg-purple-50/30 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">📊 Evaluación por Lotes</h3>
        <p className="text-sm text-purple-800">Próximamente: evaluación por lotes cafeteros con campos específicos.</p>
      </div>
    </div>
  );
}
