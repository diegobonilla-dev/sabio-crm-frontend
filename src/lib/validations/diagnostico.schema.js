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
