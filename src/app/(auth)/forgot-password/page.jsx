"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useForgotPassword } from "@/hooks/usePasswordReset";
import { forgotPasswordSchema } from "@/lib/validations/passwordReset.schema";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const { mutate: sendCode, isPending, isError, error } = useForgotPassword();

  const onSubmit = (data) => {
    sendCode(data.email, {
      onSuccess: () => {
        // Redirigir a verify-otp con el email en query params
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        {/* Header */}
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">SaBio</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Recupera tu Acceso
          </CardTitle>
          <CardDescription className="text-gray-600">
            Introduce tu correo electrónico corporativo. Te enviaremos un enlace de recuperación con alta prioridad.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="manager@sabio.com"
                  className={`pl-10 h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  {...register("email")}
                  disabled={isPending}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Error Alert */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.response?.data?.message || "Error al enviar el código. Intenta nuevamente."}
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
                  Enviando código...
                </>
              ) : (
                "Enviar enlace de recuperación"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>

          {/* Back to Login */}
          <Link href="/login">
            <Button
              variant="ghost"
              className="w-full h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a iniciar sesión
            </Button>
          </Link>

          {/* Security Notice */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-xs leading-relaxed">
              <strong className="font-semibold">Aviso de seguridad</strong>
              <br />
              Para su protección, los enlaces de recuperación caducan después de 30 minutos y solo se pueden usar una vez.
            </AlertDescription>
          </Alert>

          {/* Support Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda?{" "}
              <a
                href="mailto:soporte@sabio.com.co"
                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
              >
                Contactar con soporte
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
