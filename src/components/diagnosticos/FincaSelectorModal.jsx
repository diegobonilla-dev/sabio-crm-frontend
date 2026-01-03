"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFincas } from "@/hooks/fincas/useFincas";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

export default function FincaSelectorModal({ open, onOpenChange }) {
  const { data: fincas = [], isLoading } = useFincas();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFinca, setSelectedFinca] = useState(null);
  const router = useRouter();

  const filteredFincas = fincas.filter(finca =>
    finca.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFinca = (fincaId) => {
    setSelectedFinca(fincaId);
  };

  const handleContinuar = () => {
    if (!selectedFinca) return;

    // Buscar la finca seleccionada para obtener su tipo_produccion
    const finca = fincas.find(f => f._id === selectedFinca);

    if (!finca) {
      console.error('Finca no encontrada');
      return;
    }

    // Validar que el tipo_produccion sea válido para diagnósticos
    // Excluir 'Mixto' y 'Otro' que no tienen flujo de diagnóstico
    const tiposValidos = ['Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate'];

    if (!tiposValidos.includes(finca.tipo_produccion)) {
      console.error('Tipo de producción no válido para diagnósticos:', finca.tipo_produccion);
      alert(`La finca seleccionada tiene tipo "${finca.tipo_produccion}" que no tiene un flujo de diagnóstico disponible. Por favor selecciona una finca con tipo: Ganadería, Flores, Frutales, Café o Aguacate.`);
      return;
    }

    // Navegar con el tipo auto-detectado
    router.push(`/fincas/diagnosticos/nuevo?fincaId=${selectedFinca}&tipo=${finca.tipo_produccion}`);
    onOpenChange(false);

    // Reset state
    setSelectedFinca(null);
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
          <DialogDescription className="sr-only">
            Seleccione una finca para crear el diagnóstico
          </DialogDescription>
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
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {filteredFincas.map((finca) => (
                <button
                  key={finca._id}
                  onClick={() => handleSelectFinca(finca._id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedFinca === finca._id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{finca.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {finca.tipo_produccion} • {finca.municipio}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Botón Continuar - Solo requiere finca seleccionada */}
          {selectedFinca && (
            <Button
              onClick={handleContinuar}
              className="w-full"
            >
              Continuar al Diagnóstico
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
