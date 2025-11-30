"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserSchema, editUserSchema } from "@/lib/validations/user.schema";
import { useUserMutations } from "@/hooks/usuarios/useUserMutations";

const ROLE_OPTIONS = [
  { value: "sabio_admin", label: "Administrador" },
  { value: "sabio_vendedor", label: "Vendedor" },
  { value: "sabio_tecnico", label: "Técnico" },
  { value: "sabio_laboratorio", label: "Laboratorio" },
  { value: "cliente_owner", label: "Cliente Owner" },
  { value: "cliente_corporate", label: "Cliente Corporate" }
];

/**
 * Componente: Modal para crear o editar usuario
 * @param {boolean} open - Si el modal está abierto
 * @param {function} onOpenChange - Callback para cambiar estado del modal
 * @param {object|null} user - Usuario a editar (null para crear)
 */
export default function UserFormModal({ open, onOpenChange, user = null }) {
  const isEditMode = !!user;
  const { createUser, updateUser } = useUserMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      empresa: "",
      corporativo: ""
    }
  });

  const selectedRole = watch("role");

  // Llenar el formulario si estamos editando
  useEffect(() => {
    if (isEditMode && user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("role", user.role || "");
      setValue("empresa", user.empresa?._id || "");
      setValue("corporativo", user.corporativo?._id || "");
    } else {
      reset();
    }
  }, [isEditMode, user, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      // Limpiar campos vacíos antes de enviar
      const cleanData = {
        name: data.name,
        email: data.email,
        role: data.role,
      };

      // Solo agregar password si estamos creando
      if (!isEditMode && data.password) {
        cleanData.password = data.password;
      }

      // Solo agregar empresa si tiene valor
      if (data.empresa && data.empresa.trim() !== "") {
        cleanData.empresa = data.empresa;
      }

      // Solo agregar corporativo si tiene valor
      if (data.corporativo && data.corporativo.trim() !== "") {
        cleanData.corporativo = data.corporativo;
      }

      if (isEditMode) {
        await updateUser.mutateAsync({
          userId: user._id,
          data: cleanData
        });
      } else {
        await createUser.mutateAsync(cleanData);
      }

      // Cerrar modal y resetear formulario
      onOpenChange(false);
      reset();
    } catch (error) {
      // Los errores ya se manejan en el hook con toast
      console.error("Error en formulario:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifica los datos del usuario. Los cambios se guardarán inmediatamente."
              : "Completa el formulario para crear un nuevo usuario en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              placeholder="Ej: Juan Pérez"
              {...register("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@sabio.com"
              {...register("email")}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password (solo en modo crear) */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setValue("role", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Empresa (solo si rol es cliente_owner) */}
          {selectedRole === "cliente_owner" && (
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa (ID)</Label>
              <Input
                id="empresa"
                placeholder="ID de la empresa"
                {...register("empresa")}
                disabled={isSubmitting}
              />
              {errors.empresa && (
                <p className="text-sm text-destructive">
                  {errors.empresa.message}
                </p>
              )}
            </div>
          )}

          {/* Corporativo (solo si rol es cliente_corporate) */}
          {selectedRole === "cliente_corporate" && (
            <div className="space-y-2">
              <Label htmlFor="corporativo">Corporativo (ID)</Label>
              <Input
                id="corporativo"
                placeholder="ID del corporativo"
                {...register("corporativo")}
                disabled={isSubmitting}
              />
              {errors.corporativo && (
                <p className="text-sm text-destructive">
                  {errors.corporativo.message}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : isEditMode
                ? "Guardar Cambios"
                : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
