"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useResetPassword } from "@/hooks/usePasswordReset";
import { resetPasswordSchema } from "@/lib/validations/passwordReset.schema";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const { mutate: resetPassword, isPending, isError, error } = useResetPassword();

  const password = watch("newPassword");

  // Redirigir si no hay token
  useEffect(() => {
    if (!resetToken) {
      router.push("/forgot-password");
    }
  }, [resetToken, router]);

  const onSubmit = (data) => {
    if (!resetToken) return;

    resetPassword(
      { resetToken, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      }
    );
  };

  if (!resetToken) {
    return null;
  }

  // Password strength indicator
  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    if (pass.length < 6) return { strength: 1, label: "Muy débil", color: "bg-red-500" };
    if (pass.length < 10) return { strength: 2, label: "Débil", color: "bg-orange-500" };
    if (pass.length < 14) return { strength: 3, label: "Buena", color: "bg-yellow-500" };
    return { strength: 4, label: "Fuerte", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        {/* Header */}
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">SaBio</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {success ? "¡Contraseña actualizada!" : "Nueva Contraseña"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {success
              ? "Tu contraseña ha sido actualizada exitosamente"
              : "Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {success ? (
            /* Success State */
            <div className="space-y-6 py-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  Tu contraseña se ha cambiado correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </AlertDescription>
              </Alert>

              <p className="text-center text-sm text-gray-600">
                Serás redirigido al inicio de sesión en 3 segundos...
              </p>

              <Button
                onClick={() => router.push("/login")}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                Ir a iniciar sesión
              </Button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 h-12 ${errors.newPassword ? "border-red-500" : ""}`}
                    {...register("newPassword")}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Fortaleza: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    {...register("confirmPassword")}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Error Alert */}
              {isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error?.response?.data?.message || "Error al actualizar la contraseña. Intenta nuevamente."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-md transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Actualizando contraseña...
                  </>
                ) : (
                  "Actualizar contraseña"
                )}
              </Button>
            </form>
          )}

          {/* Security Tips */}
          {!success && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-xs leading-relaxed">
                <strong className="font-semibold">Consejos de seguridad:</strong>
                <ul className="mt-1 ml-4 list-disc space-y-1">
                  <li>Usa al menos 6 caracteres (recomendado 12+)</li>
                  <li>Combina letras, números y símbolos</li>
                  <li>No reutilices contraseñas de otras cuentas</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
