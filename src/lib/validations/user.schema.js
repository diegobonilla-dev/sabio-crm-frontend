import { z } from "zod";

// Schema para CREAR usuario
export const createUserSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo"),

  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido")
    .toLowerCase(),

  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña es demasiado larga"),

  role: z.enum([
    "sabio_admin",
    "sabio_vendedor",
    "sabio_tecnico",
    "sabio_laboratorio",
    "cliente_owner",
    "cliente_corporate"
  ], {
    required_error: "Debes seleccionar un rol"
  }),

  // Campos opcionales (condicionales según rol)
  empresa: z.string().optional(),
  corporativo: z.string().optional()
});

// Schema para EDITAR usuario (sin password requerido)
export const editUserSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo"),

  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido")
    .toLowerCase(),

  role: z.enum([
    "sabio_admin",
    "sabio_vendedor",
    "sabio_tecnico",
    "sabio_laboratorio",
    "cliente_owner",
    "cliente_corporate"
  ]),

  empresa: z.string().optional(),
  corporativo: z.string().optional()
});

// Schema para CAMBIAR CONTRASEÑA
export const changePasswordSchema = z.object({
  newPassword: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña es demasiado larga"),

  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});
