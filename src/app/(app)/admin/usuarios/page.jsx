"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/usuarios/useUsers";
import UsersTable from "@/components/usuarios/UsersTable";
import SearchAndFilters from "@/components/usuarios/SearchAndFilters";
import Pagination from "@/components/usuarios/Pagination";
import UserFormModal from "@/components/usuarios/UserFormModal";
import ChangePasswordModal from "@/components/usuarios/ChangePasswordModal";
import DeleteConfirmDialog from "@/components/usuarios/DeleteConfirmDialog";

/**
 * Página: Gestión de Usuarios (Solo Admin)
 * Ruta: /admin/usuarios
 */
export default function UsuariosPage() {
  // Query de usuarios
  const { data: users = [], isLoading, error } = useUsers();

  // Estados de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Usuario seleccionado para editar/eliminar/cambiar contraseña
  const [selectedUser, setSelectedUser] = useState(null);

  // Handlers para abrir modales
  const handleCreate = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Card principal */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Lista completa de usuarios con búsqueda y filtros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda y Filtros */}
          <SearchAndFilters />

          {/* Estado de carga */}
          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              Cargando usuarios...
            </div>
          )}

          {/* Estado de error */}
          {error && (
            <div className="text-center py-12 text-destructive">
              Error al cargar usuarios: {error.message}
            </div>
          )}

          {/* Tabla de usuarios */}
          {!isLoading && !error && (
            <>
              <UsersTable
                users={users}
                onEdit={handleEdit}
                onChangePassword={handleChangePassword}
                onDelete={handleDelete}
              />

              {/* Paginación */}
              <Pagination totalUsers={users} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <UserFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        user={null}
      />

      <UserFormModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
      />

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        user={selectedUser}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
      />
    </div>
  );
}
