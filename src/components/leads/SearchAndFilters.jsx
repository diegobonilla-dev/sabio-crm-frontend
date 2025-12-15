"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useLeadFilterStore from "@/lib/store/leadFilterStore";

export default function SearchAndFilters() {
  const { searchQuery, etapaFilter, setSearchQuery, setEtapaFilter } = useLeadFilterStore();

  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por empresa, contacto, email o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={etapaFilter} onValueChange={setEtapaFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por etapa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todas las etapas</SelectItem>
          <SelectItem value="Nuevo">Nuevo</SelectItem>
          <SelectItem value="Contactado">Contactado</SelectItem>
          <SelectItem value="Cotizado">Cotizado</SelectItem>
          <SelectItem value="Negociacion">Negociación</SelectItem>
          <SelectItem value="Ganado">Ganado</SelectItem>
          <SelectItem value="Perdido">Perdido</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
