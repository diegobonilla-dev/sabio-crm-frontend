import { z } from "zod";

export const informacionGeneralSchema = z.object({
  fecha_visita: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora es requerida"),
  tecnico_responsable: z.string().optional(),
  nombre_cliente: z.string().optional(),
  telefono_cliente: z.string().optional(),
  empresa: z.string().optional(),
  nit: z.string().optional(),
  nombre_finca: z.string().optional(),
  vereda: z.string().optional(),
  municipio: z.string().optional(),
  departamento: z.string().optional(),
  coordenadas_gps: z.string().optional(),
  area_total: z.coerce.number().optional(),
  area_dedicada: z.coerce.number().optional(),
  area_reserva: z.coerce.number().optional(),
  numero_divisiones: z.coerce.number().optional(),
  tiene_mapas: z.boolean().optional(),
  tendencia_climatica: z.string().optional(),
  tiene_registros: z.boolean().optional(),
});

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
