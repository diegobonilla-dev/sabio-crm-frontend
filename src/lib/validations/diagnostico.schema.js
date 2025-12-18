import { z } from "zod";

export const informacionGeneralSchema = z.object({
  // Fecha y hora
  fecha_visita: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora es requerida"),

  // Técnico y cliente principal
  tecnico_responsable: z.string().optional(),
  nombre_cliente: z.string().optional(),
  telefono_cliente: z.string().optional(),

  // Quien atiende la visita (NUEVO)
  nombre_quien_atiende: z.string().optional(),
  telefono_quien_atiende: z.string().optional(),

  // Empresa y documentación
  empresa: z.string().optional(),
  nit: z.string().optional(),
  caja_compensacion: z.string().optional(), // NUEVO

  // Compradores/Corporativos (NUEVO) - Se guardará como array en backend
  compradores_corporativos: z.string().optional(), // String separado por comas en UI

  // Finca
  nombre_finca: z.string().optional(),
  vereda: z.string().optional(),
  municipio: z.string().optional(),
  departamento: z.string().optional(),
  coordenadas_gps: z.string().optional(),

  // Áreas
  area_total: z.coerce.number().optional(),
  area_dedicada: z.coerce.number().optional(), // Label dinámico según tipo de finca
  area_reserva: z.coerce.number().optional(),

  // Divisiones (label dinámico: "potreros", "bloques", etc.)
  numero_divisiones: z.coerce.number().optional(),

  // Información adicional
  tiene_mapas: z.boolean().optional(),
  tendencia_climatica: z.string().optional(),
  tiene_registros: z.boolean().optional(),
});

// ============================================
// PASO 2: SISTEMA PRODUCTIVO (Por tipo de finca)
// ============================================

// Schema para suplemento individual
const suplementoSchema = z.object({
  tipo: z.string().min(1, "El tipo de suplemento es requerido"),
  kgDia: z.coerce.number().min(0, "Debe ser un valor positivo"),
  precioKg: z.coerce.number().min(0, "Debe ser un valor positivo")
});

// Schema para materia seca individual
const materiaSecaSchema = z.object({
  tipo: z.string().min(1, "El tipo de materia seca es requerido"),
  porcentaje: z.coerce.number().min(0, "Debe ser un valor positivo").max(100, "No puede superar 100%")
});

// Schema para un lote individual
const loteGanaderiaSchema = z.object({
  nombre_lote: z.string().min(1, "El nombre del lote es requerido"),
  total_litros: z.coerce.number().min(0).optional(),
  periodo_litros: z.enum(['litros_dia', 'litros_mes']).optional(),
  total_litros_305_dias: z.coerce.number().min(0).optional(),
  numero_vacas_ordeno: z.coerce.number().min(0).optional(),
  precio_venta_leche: z.coerce.number().min(0).optional(),
  concentrado_total_kg_dia: z.coerce.number().min(0).optional(),
  precio_concentrado_kg: z.coerce.number().min(0).optional(),
  usa_suplemento: z.boolean().optional(),
  suplementos: z.array(suplementoSchema).optional(),
  materia_seca: z.array(materiaSecaSchema).optional(),
  raza_predominante: z.string().optional(),
  peso_promedio_vaca: z.coerce.number().min(0).optional()
});

// Schema principal para Ganadería (Paso 2)
export const sistemaProductivoGanaderiaSchema = z.object({
  cuantos_lotes_alta_produccion: z.coerce.number().min(0).optional(),
  lotes: z.array(loteGanaderiaSchema).optional()
});

// Schema para un lote frutal individual
const loteFrutalSchema = z.object({
  nombre_lote: z.string().min(1, "El nombre del lote es requerido"),
  arboles_por_ha: z.coerce.number().min(0).optional(),
  edad_siembra: z.coerce.number().min(0).optional(),
  edad_produccion: z.coerce.number().min(0).optional(),
  notas_edad: z.string().optional(),
  rendimiento_ha: z.coerce.number().min(0).optional(),
  periodo_rendimiento: z.enum(['Anual', 'Por ciclo', 'Por cosecha', 'Traviesa']).optional(),
  produccion_promedio_arbol: z.coerce.number().min(0).optional(),
  porcentaje_exportacion: z.coerce.number().min(0).max(100).optional(),
  tasa_descarte: z.coerce.number().min(0).max(100).optional(),
  tipo_riego: z.enum(['Gravedad', 'Aspersores', 'Goteo', 'Manguera']).optional(),
  precio_venta_kg: z.coerce.number().min(0).optional()
});

// Schema para nutriente individual (Flores)
const nutrienteSchema = z.object({
  nombre: z.string().min(1, "El nombre del nutriente es requerido"),
  cantidad: z.coerce.number().min(0, "Debe ser un valor positivo"),
  valor: z.coerce.number().min(0, "Debe ser un valor positivo")
});

// Schema para un bloque floral individual
const bloqueFloralSchema = z.object({
  nombre_bloque: z.string().min(1, "El nombre del bloque es requerido"),
  tallos_cosechados: z.coerce.number().min(0).optional(),
  porcentaje_exportacion: z.coerce.number().min(0).max(100).optional(),
  tiempo_ciclo_cosecha: z.coerce.number().min(0).optional(),
  tasa_descarte: z.coerce.number().min(0).max(100).optional(),
  nutrientes: z.array(nutrienteSchema).optional(),
  precio_venta_kg: z.coerce.number().min(0).optional(),
  costo_por_tallo: z.coerce.number().min(0).optional(),
  ingreso_neto_m2: z.coerce.number().min(0).optional(),
  porcentaje_costos_variables: z.coerce.number().min(0).max(100).optional(),
  productividad_mano_obra: z.coerce.number().min(0).optional()
});

// Schemas placeholder para otros tipos (expandir según necesidad)
export const sistemaProductivoFloresSchema = z.object({
  cuantos_bloques_productivos: z.coerce.number().min(0).optional(),
  bloques: z.array(bloqueFloralSchema).optional()
});

export const sistemaProductivoFrutalesSchema = z.object({
  cuantos_lotes_productivos: z.coerce.number().min(0).optional(),
  lotes: z.array(loteFrutalSchema).optional()
});

export const sistemaProductivoCafeSchema = z.object({
  // TODO: Definir campos específicos para café
});

export const sistemaProductivoAguacateSchema = z.object({
  // TODO: Definir campos específicos para aguacate
});

// ============================================
// PASO 3: FERTILIZACIÓN Y FUMIGACIÓN
// ============================================

// Schema para producto químico individual
const productoQuimicoSchema = z.object({
  nombre_producto: z.string().min(1, "El nombre del producto es requerido"),
  formula_npk: z.string().optional(),
  bultos_por_ha: z.coerce.number().min(0, "Debe ser un valor positivo").optional(),
  periodo: z.enum(['rotacion', 'ciclo', 'anual']).optional(),
  costo_por_bulto: z.coerce.number().min(0, "Debe ser un valor positivo").optional()
});

// Schema para insecticida individual
const insecticidaSchema = z.object({
  nombre_comercial: z.string().min(1, "El nombre comercial es requerido"),
  ingrediente_activo: z.string().optional(),
  dosis: z.coerce.number().min(0, "Debe ser un valor positivo").optional(),
  unidad_dosis: z.enum(['ml/200L', 'cc/L']).optional()
});

// Schema para sección general de fertilización y fumigación
const fertilizacionFumigacionGeneralSchema = z.object({
  // Fertilización química
  usa_fertilizacion_quimica: z.boolean().optional(),
  costo_ultimo_ano_fertilizacion: z.coerce.number().min(0).optional(),
  costo_fertilizacion_es_aproximado: z.boolean().optional(),
  productos_quimicos: z.array(productoQuimicoSchema).optional(),

  // Abono orgánico
  usa_abono_organico: z.boolean().optional(),
  tipo_abono_organico: z.enum(['CASERO', 'COMERCIAL']).optional(),
  costo_abono_organico: z.coerce.number().min(0).optional(),
  unidad_costo_abono: z.enum(['bulto', 'kg']).optional(),

  // Fertilización foliar
  usa_fertilizante_foliar: z.boolean().optional(),
  tipos_aplicacion: z.array(z.string()).optional(), // ['Granular', 'Liquido', 'Foliar']

  // Fumigación
  usa_fumigacion: z.boolean().optional(),
  sistemas_fumigacion: z.array(z.string()).optional(), // ['Canecas con gravedad', etc.]
  otro_sistema_fumigacion: z.string().optional(),
  costo_anual_venenos: z.coerce.number().min(0).optional(),
  costo_venenos_es_aproximado: z.boolean().optional(),

  // Productos de fumigación
  insecticidas: z.array(insecticidaSchema).optional(),
  fungicida: z.object({
    nombre_comercial: z.string().optional(),
    ingrediente_activo: z.string().optional(),
    dosis: z.coerce.number().min(0).optional()
  }).optional(),
  coadyuvante: z.object({
    nombre_comercial: z.string().optional(),
    ingrediente_activo: z.string().optional(),
    dosis: z.coerce.number().min(0).optional()
  }).optional(),

  // Rotación
  tiene_plan_rotacion: z.boolean().optional(),
  rotacion_dias: z.coerce.number().min(0).optional()
});

// Schema para lote/bloque diferenciado (manejo específico)
const loteDiferenciadoSchema = z.object({
  nombre_lote: z.string().min(1, "El nombre es requerido"),
  usa_fertilizacion_quimica: z.boolean().optional(),
  productos_quimicos: z.array(productoQuimicoSchema).optional(),
  usa_abono_organico: z.boolean().optional(),
  usa_fumigacion: z.boolean().optional(),
  insecticidas: z.array(insecticidaSchema).optional(),
  observaciones: z.string().optional()
});

// Schema principal para Fertilización y Fumigación (Paso 3)
export const fertilizacionFumigacionSchema = z.object({
  general: fertilizacionFumigacionGeneralSchema.optional(),
  tiene_manejo_diferencial: z.boolean().optional(),
  cuantos_lotes_diferenciados: z.coerce.number().min(0).optional(),
  lotes_diferenciados: z.array(loteDiferenciadoSchema).optional()
});

// ============================================
// SCHEMA PRINCIPAL DE DIAGNÓSTICO
// ============================================

export const createDiagnosticoSchema = z.object({
  finca: z.string().min(1, "La finca es requerida"),
  tipo_diagnostico: z.enum(['Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate']),
  fecha_visita: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora es requerida"),
  estado: z.enum(['Borrador', 'En_Progreso', 'Completado']).optional(),
  informacion_general: informacionGeneralSchema.optional(),
  datos_ganaderia: z.any().optional(),
  datos_flores: z.any().optional(),
  datos_frutales: z.any().optional(),
  datos_cafe: z.any().optional(),
  datos_aguacate: z.any().optional(),
});
