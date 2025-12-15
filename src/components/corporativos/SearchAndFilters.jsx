"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useCorporativoFilterStore from "@/lib/store/corporativoFilterStore";

export default function SearchAndFilters() {
  const { searchQuery, setSearchQuery } = useCorporativoFilterStore();

  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, tipo o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
