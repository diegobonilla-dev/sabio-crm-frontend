"use client";

import { useMemo } from "react";
import { Pencil, Trash2, KeyRound } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UserRoleBadge from "./UserRoleBadge";
import useUserFilters from "@/hooks/usuarios/useUserFilters";

/**
 * Componente: Tabla de usuarios con búsqueda, filtros y paginación
 */
export default function UsersTable({
  users = [],
  onEdit,
  onChangePassword,
  onDelete
}) {
  const { searchQuery, roleFilter, currentPage, pageSize } = useUserFilters();

  // Filtrado y paginación en memoria
  const filteredAndPaginatedUsers = useMemo(() => {
    if (!users || users.length === 0) return [];

    // 1. Filtrar por búsqueda (nombre o email)
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    // 2. Paginación
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filtered.slice(startIndex, endIndex);
  }, [users, searchQuery, roleFilter, currentPage, pageSize]);

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay usuarios disponibles
      </div>
    );
  }

  if (filteredAndPaginatedUsers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No se encontraron usuarios con los filtros aplicados
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndPaginatedUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserRoleBadge role={user.role} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    title="Editar usuario"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onChangePassword(user)}
                    title="Cambiar contraseña"
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
                    title="Eliminar usuario"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
