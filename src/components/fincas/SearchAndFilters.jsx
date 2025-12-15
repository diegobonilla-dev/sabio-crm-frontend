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
import useFincaFilterStore from "@/lib/store/fincaFilterStore";

const tiposProduccion = ['Todos', 'Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate', 'Mixto', 'Otro'];

export default function SearchAndFilters() {
  const {
    searchQuery,
    tipoFilter,
    setSearchQuery,
    setTipoFilter,
    resetFilters
  } = useFincaFilterStore();

  const hasActiveFilters = searchQuery || tipoFilter !== 'Todos';

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, municipio, empresa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter by tipo */}
      <Select value={tipoFilter} onValueChange={setTipoFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tipo de producción" />
        </SelectTrigger>
        <SelectContent>
          {tiposProduccion.map((tipo) => (
            <SelectItem key={tipo} value={tipo}>
              {tipo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={resetFilters} className="gap-2">
          <X className="h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
