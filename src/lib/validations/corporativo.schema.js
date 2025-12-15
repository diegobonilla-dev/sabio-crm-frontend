import { z } from "zod";

export const createCorporativoSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
  tipo: z.string().optional(),
  descripcion: z.string().optional()
});

export const updateCorporativoSchema = createCorporativoSchema.partial();
