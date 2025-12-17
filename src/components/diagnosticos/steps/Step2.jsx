"use client";

import Step2Ganaderia from "./step2-types/Step2Ganaderia";
import Step2Flores from "./step2-types/Step2Flores";
import Step2Frutales from "./step2-types/Step2Frutales";
import Step2Cafe from "./step2-types/Step2Cafe";
import Step2Aguacate from "./step2-types/Step2Aguacate";
import Step2Default from "./step2-types/Step2Default";

/**
 * Componente Wrapper para el Paso 2: Sistema Productivo
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
export default function Step2({ data, finca, onChange }) {
  // Determinar el tipo de producción de la finca
  const tipoProduccion = finca?.tipo_produccion || 'Ganaderia';

  // Renderizado condicional según tipo de producción
  switch (tipoProduccion) {
    case 'Ganaderia':
      return <Step2Ganaderia data={data} finca={finca} onChange={onChange} />;

    case 'Flores':
      return <Step2Flores data={data} finca={finca} onChange={onChange} />;

    case 'Frutales':
      return <Step2Frutales data={data} finca={finca} onChange={onChange} />;

    case 'Cafe':
      return <Step2Cafe data={data} finca={finca} onChange={onChange} />;

    case 'Aguacate':
      return <Step2Aguacate data={data} finca={finca} onChange={onChange} />;

    case 'Mixto':
    case 'Otro':
    default:
      return <Step2Default data={data} finca={finca} onChange={onChange} />;
  }
}
