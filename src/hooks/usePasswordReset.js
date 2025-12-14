import { useMutation } from "@tanstack/react-query";
import axios from "@/app/lib/axios";

/**
 * Hook para solicitar código de recuperación de contraseña
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await axios.post("/auth/forgot-password", { email });
      return data;
    }
  });
};

/**
 * Hook para verificar el código OTP
 */
export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: async ({ email, otp }) => {
      const { data } = await axios.post("/auth/verify-otp", { email, otp });
      return data;
    }
  });
};

/**
 * Hook para restablecer la contraseña
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ resetToken, newPassword }) => {
      const { data } = await axios.post("/auth/reset-password", {
        resetToken,
        newPassword
      });
      return data;
    }
  });
};

/**
 * Hook para reenviar el código OTP
 */
export const useResendOTP = () => {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await axios.post("/auth/resend-otp", { email });
      return data;
    }
  });
};
