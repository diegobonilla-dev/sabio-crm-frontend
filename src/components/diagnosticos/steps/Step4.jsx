"use client";

import Step4Ganaderia from "./step4-types/Step4Ganaderia";
import Step4Flores from "./step4-types/Step4Flores";
import Step4Frutales from "./step4-types/Step4Frutales";
import Step4Cafe from "./step4-types/Step4Cafe";
import Step4Aguacate from "./step4-types/Step4Aguacate";
import Step4Default from "./step4-types/Step4Default";

/**
 * Componente Wrapper para el Paso 4
 *
 * Ganadería: "Manejo de Pastoreo y Forrajes"
 * Frutales/Flores/Otros: "Manejo de Cultivo"
 *
 * Este componente determina qué formulario específico renderizar
 * según el tipo de producción de la finca.
 *
 * Cada sub-componente maneja su propio:
 * - Formulario con React Hook Form
 * - Validación con Zod
 * - Auto-save con debounce 300ms
 *
 * @param {Object} data - Datos del diagnóstico actual
 * @param {Object} finca - Datos de la finca (incluye tipo_produccion)
 * @param {Function} onChange - Callback para guardar cambios
 */
export default function Step4({ data, finca, onChange }) {
  // Determinar el tipo de producción de la finca
  const tipoProduccion = finca?.tipo_produccion || 'Ganaderia';

  // Renderizado condicional según tipo de producción
  switch (tipoProduccion) {
    case 'Ganaderia':
      return <Step4Ganaderia data={data} finca={finca} onChange={onChange} />;

    case 'Flores':
      return <Step4Flores data={data} finca={finca} onChange={onChange} />;

    case 'Frutales':
      return <Step4Frutales data={data} finca={finca} onChange={onChange} />;

    case 'Cafe':
      return <Step4Cafe data={data} finca={finca} onChange={onChange} />;

    case 'Aguacate':
      return <Step4Aguacate data={data} finca={finca} onChange={onChange} />;

    case 'Mixto':
    case 'Otro':
    default:
      return <Step4Default data={data} finca={finca} onChange={onChange} />;
  }
}
