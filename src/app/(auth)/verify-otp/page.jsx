"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { useVerifyOTP, useResendOTP } from "@/hooks/usePasswordReset";
import { verifyOTPSchema } from "@/lib/validations/passwordReset.schema";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutos
  const [canResend, setCanResend] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(verifyOTPSchema)
  });

  const { mutate: verifyCode, isPending, isError, error } = useVerifyOTP();
  const { mutate: resendCode, isPending: isResending } = useResendOTP();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  // Format time MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-submit cuando se completan 6 dígitos
  useEffect(() => {
    if (otp.length === 6) {
      setValue("otp", otp);
      handleSubmit(onSubmit)();
    }
  }, [otp]);

  const onSubmit = () => {
    if (!email) {
      router.push("/forgot-password");
      return;
    }

    verifyCode(
      { email, otp },
      {
        onSuccess: (data) => {
          // Guardar el resetToken y redirigir
          router.push(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
        }
      }
    );
  };

  const handleResend = () => {
    if (!email) return;

    resendCode(email, {
      onSuccess: () => {
        setCountdown(300);
        setCanResend(false);
        setOtp("");
      }
    });
  };

  // Redirigir si no hay email
  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  // Ocultar parte del email
  const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + "*".repeat(b.length));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        {/* Header */}
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">SaBio</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verifica tu identidad
          </CardTitle>
          <CardDescription className="text-gray-600">
            Ingresa el código de 6 dígitos enviado a tu correo electrónico corporativo
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <p className="text-sm text-gray-700">
              Código enviado a: <span className="font-medium">{maskedEmail}</span>
            </p>
          </div>

          {/* OTP Input */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isPending}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                </InputOTPGroup>
                <div className="mx-2 text-2xl text-gray-400">-</div>
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {errors.otp && (
              <p className="text-sm text-red-600 text-center">{errors.otp.message}</p>
            )}

            {/* Error Alert */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.response?.data?.message || "Código incorrecto. Intenta nuevamente."}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button (opcional, se auto-submit) */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-md transition-all"
              disabled={isPending || otp.length !== 6}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando código...
                </>
              ) : (
                "Verificar código"
              )}
            </Button>
          </form>

          {/* Timer & Resend */}
          <div className="text-center space-y-2">
            {countdown > 0 ? (
              <p className="text-sm text-gray-600">
                <AlertCircle className="inline h-4 w-4 mr-1 text-gray-500" />
                El código caduca en{" "}
                <span className="font-mono font-semibold text-emerald-600">
                  {formatTime(countdown)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-red-600 font-medium">
                El código ha expirado
              </p>
            )}

            <Button
              variant="link"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
              onClick={handleResend}
              disabled={!canResend || isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                "Reenviar código"
              )}
            </Button>
          </div>

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

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 pt-2">
            Sus datos están protegidos con seguridad de empresarial Sabio
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
