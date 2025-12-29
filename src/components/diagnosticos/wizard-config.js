/**
 * Configuración de pasos del wizard de diagnóstico
 * Centraliza la información de todos los pasos para reutilizar en diferentes variantes
 */

export const STEPS_CONFIG = [
  {
    id: 1,
    title: "Información General",
    description: "Datos básicos de la finca y el diagnóstico",
    fraction: "1/9",
    tip: "Completa la información general de la finca para comenzar el diagnóstico",
    columns: 2, // Número de columnas en desktop
  },
  {
    id: 2,
    title: "Sistema Productivo",
    description: "Características del sistema de producción",
    fraction: "2/9",
    tip: "Describe el sistema productivo según el tipo de finca",
    columns: 2,
  },
  {
    id: 3,
    title: "Fertilización y Fumigación",
    description: "Prácticas de manejo fitosanitario",
    fraction: "3/9",
    tip: "Registra las prácticas de fertilización y control de plagas",
    columns: 2,
  },
  {
    id: 4,
    title: "Manejo de Pastoreo/Cultivo",
    description: "Sistemas de manejo productivo",
    fraction: "4/9",
    tip: "Detalla las prácticas de manejo según el tipo de producción",
    columns: 2,
  },
  {
    id: 5,
    title: "Indicadores P4G",
    description: "Indicadores de sostenibilidad P4G",
    fraction: "5/9",
    tip: "Completa los indicadores de sostenibilidad requeridos",
    columns: 2,
  },
  {
    id: 6,
    title: "Sostenibilidad",
    description: "Prácticas sostenibles implementadas",
    fraction: "6/9",
    tip: "Documenta las prácticas de sostenibilidad ambiental",
    columns: 2,
  },
  {
    id: 7,
    title: "Biofábrica del Cliente",
    description: "Uso de productos biológicos",
    fraction: "7/9",
    tip: "Registra el uso de productos biológicos en la finca",
    columns: 2,
  },
  {
    id: 8,
    title: "Observaciones y Seguimiento",
    description: "Observaciones técnicas y plan de seguimiento",
    fraction: "8/9",
    tip: "Documenta observaciones técnicas, recomendaciones y programa la próxima visita",
    columns: 1,
  },
  {
    id: 9,
    title: "Validación y Cierre",
    description: "Revisión final y cierre del diagnóstico",
    fraction: "9/9",
    tip: "Revisa toda la información antes de finalizar",
    columns: 1,
  },
];

export const TOTAL_STEPS = STEPS_CONFIG.length;

/**
 * Obtiene el estado de un paso
 * @param {number} stepId - ID del paso
 * @param {number} currentStep - Paso actual
 * @returns {'completed' | 'current' | 'pending'}
 */
export function getStepStatus(stepId, currentStep) {
  if (stepId < currentStep) return 'completed';
  if (stepId === currentStep) return 'current';
  return 'pending';
}

/**
 * Calcula el porcentaje de progreso
 * @param {number} currentStep - Paso actual (1-based)
 * @returns {number} Porcentaje de 0 a 100
 */
export function calculateProgress(currentStep) {
  return Math.round((currentStep / TOTAL_STEPS) * 100);
}
