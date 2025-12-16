"use client";

import { useMemo } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDiagnosticoFilterStore from "@/lib/store/diagnosticoFilterStore";

const tipoColors = {
  'Ganaderia': 'bg-green-500',
  'Flores': 'bg-pink-500',
  'Frutales': 'bg-orange-500',
  'Cafe': 'bg-amber-700',
  'Aguacate': 'bg-lime-500'
};

const estadoColors = {
  'Borrador': 'bg-gray-400',
  'En_Progreso': 'bg-blue-500',
  'Completado': 'bg-green-600'
};

const estadoLabels = {
  'Borrador': 'Borrador',
  'En_Progreso': 'En Progreso',
  'Completado': 'Completado'
};

export default function DiagnosticosTable({ diagnosticos, onEdit, onDelete }) {
  const { searchQuery, tipoFilter, estadoFilter, fincaFilter } = useDiagnosticoFilterStore();

  const filteredDiagnosticos = useMemo(() => {
    return diagnosticos.filter((diagnostico) => {
      const matchesSearch =
        diagnostico.finca?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diagnostico.tecnico_responsable?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTipo = tipoFilter === 'Todos' || diagnostico.tipo_diagnostico === tipoFilter;

      const matchesEstado = estadoFilter === 'Todos' || diagnostico.estado === estadoFilter;

      const matchesFinca = fincaFilter === 'Todos' || diagnostico.finca?._id === fincaFilter;

      return matchesSearch && matchesTipo && matchesEstado && matchesFinca;
    });
  }, [diagnosticos, searchQuery, tipoFilter, estadoFilter, fincaFilter]);

  if (filteredDiagnosticos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron diagnósticos
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Finca</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha Visita</TableHead>
            <TableHead>Técnico</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDiagnosticos.map((diagnostico) => (
            <TableRow key={diagnostico._id}>
              <TableCell className="font-medium">
                {diagnostico.finca?.nombre || "-"}
              </TableCell>
              <TableCell>
                <Badge className={tipoColors[diagnostico.tipo_diagnostico] || 'bg-gray-500'}>
                  {diagnostico.tipo_diagnostico}
                </Badge>
              </TableCell>
              <TableCell>
                {diagnostico.fecha_visita
                  ? new Date(diagnostico.fecha_visita).toLocaleDateString('es-CO')
                  : "-"}
              </TableCell>
              <TableCell>
                {diagnostico.tecnico_responsable?.name || "-"}
              </TableCell>
              <TableCell>
                <Badge className={estadoColors[diagnostico.estado] || 'bg-gray-400'}>
                  {estadoLabels[diagnostico.estado] || diagnostico.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(diagnostico)}
                    title="Ver/Editar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(diagnostico)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
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
