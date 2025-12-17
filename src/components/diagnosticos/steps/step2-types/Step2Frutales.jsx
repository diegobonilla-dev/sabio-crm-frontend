"use client";

export default function Step2Frutales({ data, finca, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sistema Productivo - Frutales</h2>
        <p className="text-gray-600">Información sobre parcelas, variedades y producción frutal</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-lg font-medium">Formulario en construcción...</p>
        <p className="text-sm text-gray-400 mt-2">Tipo de finca: {finca?.tipo_produccion}</p>
        <p className="text-xs text-gray-400 mt-1">Finca: {finca?.nombre}</p>
      </div>
    </div>
  );
}
