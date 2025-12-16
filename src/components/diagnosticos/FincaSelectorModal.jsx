"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFincas } from "@/hooks/fincas/useFincas";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

export default function FincaSelectorModal({ open, onOpenChange }) {
  const { data: fincas = [], isLoading } = useFincas();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredFincas = fincas.filter(finca =>
    finca.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFinca = (fincaId) => {
    // Navigate to tipo selector with fincaId
    router.push(`/fincas/diagnosticos/nuevo?fincaId=${fincaId}`);
    onOpenChange(false);
  };

  const handleCrearFinca = () => {
    // TODO: Abrir modal de crear finca
    onOpenChange(false);
    router.push('/fincas');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Finca</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar finca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create new button */}
          <Button
            onClick={handleCrearFinca}
            variant="outline"
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Crear Nueva Finca
          </Button>

          {/* List */}
          {isLoading ? (
            <div>Cargando fincas...</div>
          ) : (
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {filteredFincas.map((finca) => (
                <button
                  key={finca._id}
                  onClick={() => handleSelectFinca(finca._id)}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium">{finca.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {finca.tipo_produccion} • {finca.municipio}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
