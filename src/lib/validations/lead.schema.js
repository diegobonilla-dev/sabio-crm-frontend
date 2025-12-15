import { z } from "zod";

export const createLeadSchema = z.object({
  empresa_nombre: z.string().min(3, "El nombre de la empresa debe tener al menos 3 caracteres").max(100),
  contacto_nombre: z.string().min(3, "El nombre del contacto debe tener al menos 3 caracteres").max(100),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  etapa_funnel: z.enum(['Nuevo', 'Contactado', 'Cotizado', 'Negociacion', 'Ganado', 'Perdido']).default('Nuevo'),
  origen: z.enum(['Web', 'Referido', 'Llamada directa', 'Evento', 'Redes sociales', 'Otro']).default('Otro').optional(),
  notas: z.string().optional()
});

export const updateLeadSchema = z.object({
  empresa_nombre: z.string().min(3).max(100).optional(),
  contacto_nombre: z.string().min(3).max(100).optional(),
  email: z.string().email().optional(),
  telefono: z.string().min(7).optional(),
  etapa_funnel: z.enum(['Nuevo', 'Contactado', 'Cotizado', 'Negociacion', 'Ganado', 'Perdido']).optional(),
  origen: z.enum(['Web', 'Referido', 'Llamada directa', 'Evento', 'Redes sociales', 'Otro']).optional(),
  motivo_perdida: z.string().optional(),
  notas: z.string().optional()
});

export const convertLeadSchema = z.object({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  nit: z.string().min(5, "El NIT debe tener al menos 5 caracteres"),
  razon_social: z.string().optional()
});
