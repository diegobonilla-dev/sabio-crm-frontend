"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Step2Cafe({ data, finca, onChange }) {
  const { watch } = useForm({
    defaultValues: data?.datos_cafe?.sistema_productivo || {}
  });

  // Auto-save on change
  const formValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        datos_cafe: {
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
        <h2 className="text-2xl font-bold">Sistema Productivo - Café</h2>
        <p className="text-gray-600">Información sobre lotes, variedades y cultivo de café</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-lg font-medium">Formulario en construcción...</p>
        <p className="text-sm text-gray-400 mt-2">Tipo de finca: {finca?.tipo_produccion}</p>
        <p className="text-xs text-gray-400 mt-1">Finca: {finca?.nombre}</p>
      </div>
    </div>
  );
}
