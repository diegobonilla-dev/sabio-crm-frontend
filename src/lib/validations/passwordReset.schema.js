import { z } from "zod";

// Schema para solicitar recuperación de contraseña
export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido")
    .toLowerCase()
});

// Schema para verificar el código OTP
export const verifyOTPSchema = z.object({
  otp: z.string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código solo debe contener números")
});

// Schema para restablecer la contraseña
export const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña es demasiado larga"),

  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});
