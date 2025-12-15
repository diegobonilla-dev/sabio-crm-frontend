"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
  // Placeholder component for future pagination implementation
  // Currently showing page 1 of 1

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Mostrando todos los resultados
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button variant="outline" size="sm" disabled>
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
