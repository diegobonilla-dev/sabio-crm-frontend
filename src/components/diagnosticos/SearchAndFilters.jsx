"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDiagnosticoFilterStore from "@/lib/store/diagnosticoFilterStore";

const TIPOS = ['Todos', 'Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate'];
const ESTADOS = ['Todos', 'Borrador', 'En_Progreso', 'Completado'];

export default function SearchAndFilters() {
  const {
    searchQuery,
    tipoFilter,
    estadoFilter,
    setSearchQuery,
    setTipoFilter,
    setEstadoFilter,
    resetFilters,
  } = useDiagnosticoFilterStore();

  const hasActiveFilters = searchQuery || tipoFilter !== 'Todos' || estadoFilter !== 'Todos';

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por finca o técnico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tipo Filter */}
      <Select value={tipoFilter} onValueChange={setTipoFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          {TIPOS.map((tipo) => (
            <SelectItem key={tipo} value={tipo}>
              {tipo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Estado Filter */}
      <Select value={estadoFilter} onValueChange={setEstadoFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          {ESTADOS.map((estado) => (
            <SelectItem key={estado} value={estado}>
              {estado === 'En_Progreso' ? 'En Progreso' : estado}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={resetFilters} className="gap-2">
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
