"use client";

import Step3Ganaderia from "./step3-types/Step3Ganaderia";
import Step3Flores from "./step3-types/Step3Flores";
import Step3Frutales from "./step3-types/Step3Frutales";
import Step3Cafe from "./step3-types/Step3Cafe";
import Step3Aguacate from "./step3-types/Step3Aguacate";
import Step3Default from "./step3-types/Step3Default";

/**
 * Componente Wrapper para el Paso 3: Fertilización y Fumigación
 *
 * Este componente determina qué formulario específico renderizar
 * según el tipo de producción de la finca.
 *
 * Cada sub-componente maneja su propio:
 * - Formulario con React Hook Form
 * - Validación con Zod
 * - Auto-save con debounce 300ms
 * - Sección general (información agregada de toda la finca)
 * - Sección diferencial opcional (por lotes/bloques)
 *
 * @param {Object} data - Datos del diagnóstico actual
 * @param {Object} finca - Datos de la finca (incluye tipo_produccion)
 * @param {Function} onChange - Callback para guardar cambios
 */
export default function Step3({ data, finca, onChange }) {
  // Determinar el tipo de producción de la finca
  const tipoProduccion = finca?.tipo_produccion || 'Ganaderia';

  // Renderizado condicional según tipo de producción
  switch (tipoProduccion) {
    case 'Ganaderia':
      return <Step3Ganaderia data={data} finca={finca} onChange={onChange} />;

    case 'Flores':
      return <Step3Flores data={data} finca={finca} onChange={onChange} />;

    case 'Frutales':
      return <Step3Frutales data={data} finca={finca} onChange={onChange} />;

    case 'Cafe':
      return <Step3Cafe data={data} finca={finca} onChange={onChange} />;

    case 'Aguacate':
      return <Step3Aguacate data={data} finca={finca} onChange={onChange} />;

    case 'Mixto':
    case 'Otro':
    default:
      return <Step3Default data={data} finca={finca} onChange={onChange} />;
  }
}
