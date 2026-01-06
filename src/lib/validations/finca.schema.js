import { z } from "zod";

export const createFincaSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  area: z.number().positive("El área debe ser un número positivo"),
  tipo_produccion: z.enum(['Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate', 'Mixto', 'Otro'], {
    required_error: "Selecciona un tipo de producción"
  }),
  municipio: z.string().min(1, "El municipio es obligatorio"),
  departamento: z.string().min(1, "El departamento es obligatorio"),
  vereda: z.string().optional(),
  coordenadas_gps: z.string().optional(),
  cultivo_principal: z.string().optional(),
  empresa_owner: z.string().min(1, "Debes seleccionar una empresa")
});

export const updateFincaSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
  area: z.number().positive("El área debe ser un número positivo").optional(),
  tipo_produccion: z.enum(['Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate', 'Mixto', 'Otro']).optional(),
  municipio: z.string().optional(),
  departamento: z.string().optional(),
  vereda: z.string().optional(),
  coordenadas_gps: z.string().optional(),
  cultivo_principal: z.string().optional()
});
