"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Step2Default({ data, finca, onChange }) {
  const { watch } = useForm({
    defaultValues: data?.datos_default?.sistema_productivo || {}
  });

  // Auto-save on change
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        datos_default: {
          sistema_productivo: formValues
        }
      });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sistema Productivo - {finca?.tipo_produccion || 'Otro'}</h2>
        <p className="text-gray-600">Información sobre el sistema productivo</p>
      </div>

      <div className="border-2 border-yellow-400 bg-yellow-50 rounded-lg p-8 text-center">
        <p className="text-yellow-700 text-lg font-medium">Tipo de producción no configurado</p>
        <p className="text-sm text-yellow-600 mt-2">Tipo de finca: {finca?.tipo_produccion || 'No especificado'}</p>
        <p className="text-xs text-yellow-600 mt-1">Finca: {finca?.nombre}</p>
        <p className="text-xs text-gray-500 mt-4">Por favor, configure el tipo de producción de la finca desde el módulo de Fincas</p>
      </div>
    </div>
  );
}
