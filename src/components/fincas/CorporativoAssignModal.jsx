"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFincaMutations } from "@/hooks/fincas/useFincaMutations";
import { useCorporativos } from "@/hooks/corporativos/useCorporativos";

export default function CorporativoAssignModal({ open, onOpenChange, finca }) {
  const { data: corporativos = [], isLoading } = useCorporativos();
  const { asociarCorporativo } = useFincaMutations();
  const [selectedCorporativo, setSelectedCorporativo] = useState("");

  const corporativosAsociados = finca?.corporativos_asociados || [];
  const corporativosDisponibles = corporativos.filter(
    (corp) => !corporativosAsociados.some((asoc) => asoc._id === corp._id)
  );

  const handleAsociar = async () => {
    if (!selectedCorporativo || !finca?._id) return;

    try {
      await asociarCorporativo.mutateAsync({
        fincaId: finca._id,
        corporativoId: selectedCorporativo,
      });
      setSelectedCorporativo("");
    } catch (error) {
      console.error("Error al asociar corporativo:", error);
    }
  };

  const handleClose = () => {
    setSelectedCorporativo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Asignar Corporativos</DialogTitle>
          <DialogDescription>
            Gestiona los corporativos asociados a la finca <strong>{finca?.nombre}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Corporativos asociados */}
          <div>
            <h4 className="text-sm font-medium mb-2">Corporativos asociados</h4>
            {corporativosAsociados.length === 0 ? (
              <p className="text-sm text-gray-500">No hay corporativos asociados</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {corporativosAsociados.map((corp) => (
                  <Badge key={corp._id} variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    {corp.nombre}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Agregar nuevo corporativo */}
          <div>
            <h4 className="text-sm font-medium mb-2">Agregar corporativo</h4>
            <div className="flex gap-2">
              <Select
                value={selectedCorporativo}
                onValueChange={setSelectedCorporativo}
                disabled={isLoading || corporativosDisponibles.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={
                      isLoading
                        ? "Cargando..."
                        : corporativosDisponibles.length === 0
                        ? "No hay corporativos disponibles"
                        : "Seleccionar corporativo"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {corporativosDisponibles.map((corp) => (
                    <SelectItem key={corp._id} value={corp._id}>
                      {corp.nombre} {corp.tipo ? `(${corp.tipo})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAsociar}
                disabled={!selectedCorporativo || asociarCorporativo.isPending}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
