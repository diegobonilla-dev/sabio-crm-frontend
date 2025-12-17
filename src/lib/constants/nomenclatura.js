/**
 * Nomenclatura dinámica para diagnósticos según tipo de finca
 *
 * Define los términos específicos que se usan en cada tipo de producción
 * para mantener la UI coherente con la terminología del sector.
 *
 * Estructura de 3 niveles:
 * - División Primaria: Nivel más alto de organización
 * - División Secundaria: Subdivisión de la primaria
 * - División Terciaria: Nivel más granular (para muestreo biológico)
 *
 * En el backend se mantienen nombres genéricos mientras que en el
 * frontend se traducen a términos específicos del usuario.
 */

export const NOMENCLATURA_FINCA = {
  Ganaderia: {
    division_primaria: {
      singular: 'Lote',
      plural: 'Lotes',
      label: 'Número total de lotes'
    },
    division_secundaria: {
      singular: 'Potrero',
      plural: 'Potreros',
      label: 'Potreros por lote'
    },
    division_terciaria: {
      singular: 'Franja',
      plural: 'Franjas',
      label: 'Franjas por potrero'
    },
    area_dedicada: 'Área dedicada a producción lechera (ha)',
    tipo_produccion_label: 'Ganadería/Lechería'
  },

  Flores: {
    division_primaria: {
      singular: 'Bloque',
      plural: 'Bloques',
      label: 'Número total de bloques'
    },
    division_secundaria: {
      singular: 'Nave',
      plural: 'Naves',
      label: 'Naves por bloque'
    },
    division_terciaria: {
      singular: 'Cama',
      plural: 'Camas',
      label: 'Camas por nave'
    },
    area_dedicada: 'Área dedicada a producción de flores (ha)',
    tipo_produccion_label: 'Flores'
  },

  Frutales: {
    division_primaria: {
      singular: 'Lote',
      plural: 'Lotes',
      label: 'Número total de lotes'
    },
    division_secundaria: {
      singular: 'Sección',
      plural: 'Secciones',
      label: 'Secciones por lote'
    },
    division_terciaria: {
      singular: 'Plato',
      plural: 'Platos',
      label: 'Platos por sección'
    },
    area_dedicada: 'Área dedicada a producción frutal (ha)',
    tipo_produccion_label: 'Frutales'
  },

  Cafe: {
    division_primaria: {
      singular: 'Lote',
      plural: 'Lotes',
      label: 'Número total de lotes'
    },
    division_secundaria: {
      singular: 'Sección',
      plural: 'Secciones',
      label: 'Secciones por lote'
    },
    division_terciaria: {
      singular: 'Surco',
      plural: 'Surcos',
      label: 'Surcos por sección'
    },
    area_dedicada: 'Área dedicada a producción de café (ha)',
    tipo_produccion_label: 'Café'
  },

  Aguacate: {
    division_primaria: {
      singular: 'Lote',
      plural: 'Lotes',
      label: 'Número total de lotes'
    },
    division_secundaria: {
      singular: 'Sección',
      plural: 'Secciones',
      label: 'Secciones por lote'
    },
    division_terciaria: {
      singular: 'Planta',
      plural: 'Plantas',
      label: 'Plantas por sección'
    },
    area_dedicada: 'Área dedicada a producción de aguacate (ha)',
    tipo_produccion_label: 'Aguacate'
  },

  Mixto: {
    division_primaria: {
      singular: 'Lote',
      plural: 'Lotes',
      label: 'Número total de lotes'
    },
    division_secundaria: {
      singular: 'Sección',
      plural: 'Secciones',
      label: 'Secciones por lote'
    },
    division_terciaria: {
      singular: 'Sublote',
      plural: 'Sublotes',
      label: 'Sublotes por sección'
    },
    area_dedicada: 'Área dedicada a producción (ha)',
    tipo_produccion_label: 'Mixto'
  },

  Otro: {
    division_primaria: {
      singular: 'Lote',
      plural: 'Lotes',
      label: 'Número total de lotes'
    },
    division_secundaria: {
      singular: 'Sección',
      plural: 'Secciones',
      label: 'Secciones por lote'
    },
    division_terciaria: {
      singular: 'Sublote',
      plural: 'Sublotes',
      label: 'Sublotes por sección'
    },
    area_dedicada: 'Área dedicada a producción (ha)',
    tipo_produccion_label: 'Otro'
  }
};

/**
 * Obtiene la nomenclatura para un tipo de finca específico
 * @param {string} tipoProduccion - Tipo de producción de la finca
 * @returns {object} Objeto con la nomenclatura específica
 */
export const getNomenclatura = (tipoProduccion) => {
  return NOMENCLATURA_FINCA[tipoProduccion] || NOMENCLATURA_FINCA.Otro;
};
