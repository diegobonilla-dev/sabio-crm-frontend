"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import useUserFilters from "@/hooks/usuarios/useUserFilters";

const ROLE_OPTIONS = [
  { value: "all", label: "Todos los roles" },
  { value: "sabio_admin", label: "Administrador" },
  { value: "sabio_vendedor", label: "Vendedor" },
  { value: "sabio_tecnico", label: "Técnico" },
  { value: "sabio_laboratorio", label: "Laboratorio" },
  { value: "cliente_owner", label: "Cliente Owner" },
  { value: "cliente_corporate", label: "Cliente Corporate" }
];

/**
 * Componente: Búsqueda y filtros para usuarios
 */
export default function SearchAndFilters() {
  const {
    searchQuery,
    roleFilter,
    setSearchQuery,
    setRoleFilter,
    resetFilters
  } = useUserFilters();

  const hasActiveFilters = searchQuery !== "" || roleFilter !== "all";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Búsqueda */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            title="Limpiar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
