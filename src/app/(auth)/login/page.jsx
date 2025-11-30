"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/app/lib/axios";
import useAuthStore from "@/app/lib/store";
import {
  Activity,
  Bell,
  Users,
  Eye,
  EyeOff
} from "lucide-react";

// Define Zod schema for login form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/admin");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Set up TanStack Query mutation for login API call
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Display success toast
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión exitosamente",
      });

      // Update Zustand store with JWT token
      login(data.token);

      // Navigate to admin dashboard
      router.push("/admin");
    },
    onError: (error) => {
      // Display error toast with API message
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description:
          error.response?.data?.message ||
          "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Panel - Features (Desktop only, verde/turquesa) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #10b981 40%, #064e3b 60%, #064e3b 100%)'
      }}>
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/logo-sabio.png"
              alt="SaBio Logo"
              width={122}
              height={113}
              priority
              className="object-contain"
            />
          </div>

          {/* Features */}
          <div className="space-y-8 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Monitoreo en Tiempo Real</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Rastrea tus fincas asignadas con precisión y conocimientos basados en datos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Alertas Inteligentes</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Recibe notificaciones de problemas críticos antes de que se conviertan en un dolor de cabeza
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Colaboración en Equipo</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Coordinación fluida en todo tu portafolio
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-white/70 text-sm">
            LOGIN
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 lg:w-[55%] flex items-center justify-center p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg p-3">
              <Image
                src="/images/logo-sabio.png"
                alt="SaBio Logo"
                width={56}
                height={56}
                priority
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Bienvenido de nuevo
            </h1>
            <p className="text-gray-600 text-base">
              Inicia sesión para continuar a tu panel de control
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo Electrónico Corporativo
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  {...register("email")}
                  className={`h-12 px-4 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300"}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  {...register("password")}
                  className={`h-12 px-4 pr-12 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <Label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                  Recuérdame
                </Label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-base rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
