"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * Paso 4: Manejo de Cultivo - Flores (Placeholder)
 *
 * Este componente es un placeholder básico que se desarrollará
 * con campos específicos para flores en futuras iteraciones.
 */
export default function Step4Flores({ data, onChange }) {
  const { register, watch, setValue } = useForm({
    defaultValues: data?.datos_flores?.manejo_cultivo || {
      tipo_manejo: "",
      observaciones_generales: ""
    }
  });

  // Auto-save on change
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
  }, [formValues, onChange]);

  return (
    <div className="space-y-6">
      {/* Sección A: General */}
      <div className="bg-blue-50/30 border border-blue-200 rounded-lg p-6 space-y-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🌸</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Información General de Manejo de Cultivo
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>⚠️ En desarrollo:</strong> Este formulario se adaptará según las necesidades específicas de flores.
              </p>
              <p className="text-xs text-yellow-700">
                Los campos mostrados son temporales. Próximamente se incluirán:
                manejo de plagas y enfermedades florales, control climático, poscosecha,
                calidad de tallos, y otras prácticas específicas de floricultura.
              </p>
            </div>
          </div>
        </div>

        {/* Campos básicos aplicables */}
        <div className="space-y-4 mt-6">
          <div>
            <Label>Tipo de manejo</Label>
            <Select
              value={watch("tipo_manejo")}
              onValueChange={(value) => setValue("tipo_manejo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de manejo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Orgánico">Orgánico</SelectItem>
                <SelectItem value="Convencional">Convencional</SelectItem>
                <SelectItem value="Mixto">Mixto</SelectItem>
                <SelectItem value="En transición">En transición</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Observaciones generales</Label>
            <Textarea
              {...register("observaciones_generales")}
              placeholder="Ingrese observaciones generales sobre el manejo del cultivo..."
              rows={6}
            />
          </div>
        </div>
      </div>

      {/* Sección B: Bloques (placeholder simple) */}
      <div className="bg-purple-50/30 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Evaluación por Bloques
            </h3>
            <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                Esta sección se desarrollará próximamente con campos específicos para evaluación
                de bloques florales, incluyendo: estado sanitario, calidad de tallos,
                productividad, incidencia de botrytis, trips y otras plagas comunes, y análisis por bloque.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nota para el desarrollador */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-xs text-slate-600 italic">
          💡 <strong>Nota técnica:</strong> Este placeholder seguirá el mismo patrón de desarrollo
          que Step4Ganaderia.jsx una vez se definan los campos específicos para flores.
        </p>
      </div>
    </div>
  );
}
