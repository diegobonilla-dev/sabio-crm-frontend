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
// PASO 4: MANEJO DE PASTOREO Y FORRAJES
// ============================================

// Schema para especie de pasto
const especiePastoSchema = z.object({
  especie: z.string().optional(),
  orden: z.coerce.number().min(1).max(3)
});

// Schema para punto de muestreo individual
const puntoMuestreoSchema = z.object({
  coordenada_gps: z.string().optional(),
  pendiente_porcentaje: z.coerce.number().min(0).max(45).optional(),
  aspecto_pendiente: z.enum(['N', 'S', 'E', 'O', 'NE', 'NO', 'SE', 'SO']).optional(),

  // VESS
  vess_colchon_pasto: z.coerce.number().min(1).max(3).optional(),
  vess_suelo: z.coerce.number().min(1).max(5).optional(),

  // Características del suelo
  textura_predominante: z.enum(['Arenosa', 'Franca', 'Arcillosa']).optional(),
  color_predominante: z.enum(['Oscuro', 'Claro', 'Rojizo']).optional(),
  olor_predominante: z.enum(['Orgánico', 'Áspero', 'Ácido', 'Neutro']).optional(),

  // Compactación
  penetrometro_200psi_cm: z.coerce.number().min(0).max(90).optional(),
  nivel_compactacion: z.enum(['Bajo', 'Medio', 'Alto']).optional(),
  evidencia_compactacion_superficial: z.boolean().optional(),

  // Condiciones
  drenaje: z.enum(['Adecuado', 'Deficiente']).optional(),
  evidencia_erosion: z.boolean().optional(),

  // Salud del pasto
  puntuacion_salud_pasto: z.coerce.number().min(0).max(3).optional(),
  especies_no_deseadas_presentes: z.boolean().optional(),
  nivel_especies_no_deseadas: z.enum(['Bajo', 'Medio', 'Alto']).optional(),
  sintomas_estres: z.array(z.string()).optional(),

  // Biodiversidad
  lombrices_rojas: z.coerce.number().min(0).optional(),
  lombrices_grises: z.coerce.number().min(0).optional(),
  lombrices_blancas: z.coerce.number().min(0).optional(),
  huevos_lombrices: z.coerce.number().min(0).optional(),
  tipos_diferentes_huevos: z.coerce.number().min(0).optional(),
  presencia_micelio_hongos: z.enum(['Abundante', 'Moderado', 'Poco', 'Ninguno']).optional(),
  raices_activas_visibles: z.enum(['Abundante', 'Moderado', 'Poco', 'Ninguno']).optional(),

  // Fotos (strings por ahora)
  foto_salud_pasto_calidad: z.string().optional(),
  foto_salud_pasto_raiz: z.string().optional(),
  foto_perfil_suelo: z.string().optional(),

  // Observaciones
  observaciones_punto: z.string().optional()
});

// Schema para plaga/enfermedad
const plagaEnfermedadPastoreoSchema = z.object({
  nombre: z.string(),
  nivel_dano: z.enum(['sin_dano', 'leve', 'moderado', 'grave'])
});

// Schema para mediciones de forraje
const medicionesForraje = z.object({
  se_realizaron: z.boolean().optional(),
  motivo_no_realizacion: z.string().optional(),
  aforo_entrada_kg_ms_m2: z.coerce.number().min(0).optional(),
  altura_entrada_cm: z.coerce.number().min(0).optional(),
  hora_muestreo_ms: z.string().optional(),
  aforo_salida_kg_ms_m2: z.coerce.number().min(0).optional(),
  altura_salida_cm: z.coerce.number().min(0).optional(),
  oferta_forraje_verde_kg_vaca_dia: z.coerce.number().min(0).optional(),
  oferta_area_m2_vaca_dia: z.coerce.number().min(0).optional(),
  porcentaje_materia_seca: z.coerce.number().min(0).max(100).optional(),
  grados_brix: z.coerce.number().min(0).optional(),
  ph_hoja: z.coerce.number().min(0).max(14).optional(),
  hora_muestreo_brix_ph: z.string().optional()
});

// Schema para lote evaluado
const loteEvaluadoPastoreoSchema = z.object({
  nombre_lote: z.string().min(1, "El nombre del lote es requerido"),
  area_m2: z.coerce.number().min(0).optional(),
  topografia: z.enum(['Plano', 'Inclinación leve', 'Inclinación fuerte']).optional(),
  mediciones_forraje: medicionesForraje.optional(),
  puntos_muestreo: z.array(puntoMuestreoSchema).max(9, "Máximo 9 puntos de muestreo").optional(),
  plagas_enfermedades: z.array(plagaEnfermedadPastoreoSchema).optional()
});

// Schema principal para Manejo de Pastoreo (Paso 4)
export const manejoPastoreoSchema = z.object({
  general: z.object({
    finca_hace_aforo: z.boolean().optional(),
    metodo_aforo: z.enum([
      'Platómetro',
      'Visual',
      'Corte y peso',
      'Bastón de aforo',
      'No se hace en la finca'
    ]).optional(),
    tipo_pastoreo: z.enum(['Rotacional', 'Continuo']).optional(),
    periodo_rotacion_dias: z.coerce.number().min(0).optional(),
    periodo_ocupacion_dias: z.coerce.number().min(0).optional(),
    franja_pastoreo_m2: z.coerce.number().min(0).optional(),
    especies_pasto: z.array(especiePastoSchema).max(3, "Máximo 3 especies").optional(),
    cobertura_general: z.enum(['Alta', 'Media', 'Baja']).optional(),
    uniformidad_general: z.enum(['Buena', 'Irregular']).optional()
  }).optional(),
  cuantos_lotes_evaluados: z.coerce.number().min(0).optional(),
  lotes_evaluados: z.array(loteEvaluadoPastoreoSchema).optional()
});

// ============================================
// PASO 4: MANEJO DE CULTIVO (FRUTALES)
// ============================================

// Schema para especie predominante frutal
const especiePredomianteFrutalSchema = z.object({
  especie: z.string().optional(),
  orden: z.coerce.number().min(1).max(4)
});

// Schema para punto de muestreo individual (Frutales)
const puntoMuestreoFrutalSchema = z.object({
  coordenada_gps: z.string().optional(),
  pendiente_porcentaje: z.coerce.number().min(0).max(45).optional(),
  aspecto_pendiente: z.enum(['N', 'S', 'E', 'O', 'NE', 'NO', 'SE', 'SO']).optional(),

  // VESS
  vess_colchon_pasto: z.coerce.number().min(1).max(3).optional(),
  vess_suelo: z.coerce.number().min(1).max(5).optional(),

  // Características del suelo
  textura_predominante: z.enum(['Arenosa', 'Franca', 'Arcillosa']).optional(),
  color_predominante: z.enum(['Oscuro', 'Claro', 'Rojizo']).optional(),
  olor_predominante: z.enum(['Orgánico', 'Áspero', 'Ácido', 'Neutro']).optional(),

  // Compactación
  penetrometro_200psi_cm: z.coerce.number().min(0).max(90).optional(),
  nivel_compactacion: z.enum(['Bajo', 'Medio', 'Alto']).optional(),
  evidencia_compactacion_superficial: z.boolean().optional(),

  // Condiciones
  drenaje: z.enum(['Adecuado', 'Deficiente']).optional(),
  evidencia_erosion: z.boolean().optional(),

  // Salud del árbol
  puntuacion_salud_arbol: z.coerce.number().min(0).max(3).optional(),
  especies_no_deseadas_presentes: z.boolean().optional(),
  nivel_especies_no_deseadas: z.enum(['Bajo', 'Medio', 'Alto']).optional(),
  sintomas_estres: z.array(z.string()).optional(),

  // Biodiversidad
  lombrices_rojas: z.coerce.number().min(0).optional(),
  lombrices_grises: z.coerce.number().min(0).optional(),
  lombrices_blancas: z.coerce.number().min(0).optional(),
  huevos_lombrices: z.coerce.number().min(0).optional(),
  tipos_diferentes_huevos: z.coerce.number().min(0).optional(),
  presencia_micelio_hongos: z.enum(['Abundante', 'Moderado', 'Poco', 'Ninguno']).optional(),
  raices_activas_visibles: z.enum(['Abundante', 'Moderado', 'Poco', 'Ninguno']).optional(),

  // Conductividad eléctrica
  conductividad_electrica: z.coerce.number().min(0).optional(),

  // Fotos (strings por ahora)
  foto_salud_arbol: z.string().optional(),
  foto_perfil_suelo: z.string().optional(),

  // Observaciones
  observaciones_punto: z.string().optional()
});

// Schema para plaga/enfermedad (Frutales)
const plagaEnfermedadFrutalSchema = z.object({
  nombre: z.string(),
  nivel_dano: z.enum(['sin_dano', 'leve', 'moderado', 'grave'])
});

// Schema para lote evaluado (Frutales)
const loteEvaluadoFrutalSchema = z.object({
  // Datos básicos
  nombre_lote: z.string().optional(),

  // Sistema productivo
  numero_arboles_ha: z.coerce.number().min(0).optional(),
  edad_cultivo_siembra: z.coerce.number().min(0).optional(),
  edad_cultivo_produccion: z.coerce.number().min(0).optional(),
  notas_resiembras: z.string().optional(),
  rendimiento_kg_ha: z.coerce.number().min(0).optional(),
  periodo_rendimiento: z.enum(['Anual', 'Por ciclo', 'Por cosecha', 'Traviesa']).optional(),
  produccion_promedio_arbol: z.coerce.number().min(0).optional(),
  porcentaje_exportacion: z.coerce.number().min(0).max(100).optional(),
  tasa_descarte: z.coerce.number().min(0).max(100).optional(),
  tipo_riego: z.enum(['Gravedad', 'Aspersores', 'Goteo', 'Manguera']).optional(),
  precio_venta_kg: z.coerce.number().min(0).optional(),

  // Información del lote
  area_lote_m2: z.coerce.number().min(0).optional(),
  coordenadas_gps_centro: z.string().optional(),
  topografia_general: z.enum(['Plano', 'Inclinación leve', 'Inclinación fuerte']).optional(),

  // Puntos de muestreo
  puntos_muestreo: z.array(puntoMuestreoFrutalSchema).max(9, "Máximo 9 puntos de muestreo").optional(),

  // Plagas y enfermedades
  plagas_enfermedades: z.array(plagaEnfermedadFrutalSchema).optional(),
  otras_plagas_observadas: z.string().optional()
});

// Schema principal para Manejo de Cultivo (Paso 4 - Frutales)
export const manejoCultivoFrutalesSchema = z.object({
  general: z.object({
    metodo_plateo: z.array(z.string()).optional(),
    deshierbe: z.array(z.string()).optional(),
    frecuencia_plateo: z.enum(['Mensual', 'Bimestral', 'Trimestral', 'Dos veces al año']).optional(),
    especies_predominantes: z.array(especiePredomianteFrutalSchema).max(4, "Máximo 4 especies").optional(),
    arboles_resembrados: z.coerce.number().min(0).optional(),
    tipo_podas: z.array(z.string()).optional(),
    ultimas_podas_realizadas: z.string().optional(),
    cantidad_fertilizante_sintetico_por_arbol: z.coerce.number().min(0).optional(),
    usa_abono_organico: z.boolean().optional(),
    tipos_abono_organico: z.string().optional(),
    cantidad_abono_organico_por_arbol: z.coerce.number().min(0).optional()
  }).optional(),
  cuantos_lotes_evaluados: z.coerce.number().min(0).optional(),
  lotes_evaluados: z.array(loteEvaluadoFrutalSchema).optional()
});

// ============================================
// PASO 4: MANEJO DE CULTIVO (FLORES)
// ============================================

// Schema para especie predominante floral
const especiePredomianteFloralSchema = z.object({
  especie: z.string().optional(),
  orden: z.coerce.number().min(1).max(4)
});

// Schema para punto de muestreo individual (Flores)
const puntoMuestreoFloralSchema = z.object({
  coordenada_gps: z.string().optional(),
  pendiente_porcentaje: z.coerce.number().min(0).max(100).optional(),
  aspecto_pendiente: z.enum(['N', 'S', 'E', 'O', 'NE', 'NO', 'SE', 'SO']).optional(),

  // VESS
  vess_colchon_pasto: z.coerce.number().min(1).max(3).optional(),
  vess_suelo: z.coerce.number().min(1).max(5).optional(),

  // Características del suelo
  textura_predominante: z.enum(['Arenosa', 'Franca', 'Arcillosa']).optional(),
  color_predominante: z.enum(['Oscuro', 'Claro', 'Rojizo']).optional(),
  olor_predominante: z.enum(['Orgánico', 'Áspero', 'Ácido', 'Neutro']).optional(),

  // Compactación
  penetrometro_200psi_cm: z.coerce.number().min(0).max(90).optional(),
  nivel_compactacion: z.enum(['Bajo', 'Medio', 'Alto']).optional(),
  evidencia_compactacion_superficial: z.boolean().optional(),

  // Condiciones
  drenaje: z.enum(['Adecuado', 'Deficiente']).optional(),
  evidencia_erosion: z.boolean().optional(),

  // Salud de la cobertura/cultivo
  puntuacion_salud_cobertura: z.coerce.number().min(0).max(3).optional(),
  especies_no_deseadas_presentes: z.boolean().optional(),
  nivel_especies_no_deseadas: z.enum(['Bajo', 'Medio', 'Alto']).optional(),
  sintomas_estres: z.array(z.string()).optional(),

  // Biodiversidad
  lombrices_rojas: z.coerce.number().min(0).optional(),
  lombrices_grises: z.coerce.number().min(0).optional(),
  lombrices_blancas: z.coerce.number().min(0).optional(),
  huevos_lombrices: z.coerce.number().min(0).optional(),
  tipos_diferentes_huevos: z.coerce.number().min(0).optional(),
  presencia_micelio_hongos: z.enum(['Abundante', 'Moderado', 'Poco', 'Ninguno']).optional(),
  raices_activas_visibles: z.enum(['Abundante', 'Moderado', 'Poco', 'Ninguno']).optional(),

  // Conductividad eléctrica
  conductividad_electrica: z.coerce.number().min(0).optional(),

  // Fotos (strings por ahora)
  foto_salud_cultivo: z.string().optional(),
  foto_perfil_suelo: z.string().optional(),

  // Observaciones
  observaciones_punto: z.string().optional()
});

// Schema para plaga/enfermedad (Flores)
const plagaEnfermedadFloralSchema = z.object({
  nombre: z.string(),
  nivel_dano: z.enum(['sin_dano', 'leve', 'moderado', 'grave'])
});

// Schema para bloque evaluado (Flores)
const bloqueEvaluadoFloralSchema = z.object({
  // Datos básicos
  nombre_bloque: z.string().optional(),

  // Información del bloque
  area_bloque_m2: z.coerce.number().min(0).optional(),
  coordenadas_gps_centro: z.string().optional(),
  topografia_general: z.enum(['Plano', 'Inclinación leve', 'Inclinación fuerte']).optional(),

  // Puntos de muestreo
  puntos_muestreo: z.array(puntoMuestreoFloralSchema).max(9, "Máximo 9 puntos de muestreo").optional(),

  // Plagas y enfermedades
  plagas_enfermedades: z.array(plagaEnfermedadFloralSchema).optional(),
  otras_plagas_observadas: z.string().optional()
});

// Schema principal para Manejo de Cultivo (Paso 4 - Flores)
export const manejoCultivoFloresSchema = z.object({
  general: z.object({
    metodo_plateo: z.array(z.string()).optional(),
    deshierbe: z.array(z.string()).optional(),
    frecuencia_plateo: z.enum(['Mensual', 'Bimestral', 'Trimestral', 'Dos veces al año']).optional(),
    especies_predominantes: z.array(especiePredomianteFloralSchema).max(4, "Máximo 4 especies").optional(),
    plantas_resembradas: z.coerce.number().min(0).optional(),
    tipo_podas: z.array(z.string()).optional(),
    ultimas_podas_realizadas: z.string().optional(),
    cantidad_fertilizante_sintetico_por_cama: z.coerce.number().min(0).optional(),
    usa_abono_organico: z.boolean().optional(),
    tipos_abono_organico: z.string().optional(),
    cantidad_abono_organico_por_cama: z.coerce.number().min(0).optional()
  }).optional(),
  cuantos_bloques_evaluados: z.coerce.number().min(0).optional(),
  bloques_evaluados: z.array(bloqueEvaluadoFloralSchema).optional()
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
