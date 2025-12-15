"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCorporativoFilterStore from "@/lib/store/corporativoFilterStore";

export default function CorporativosTable({ corporativos, onEdit, onDelete }) {
  const { searchQuery } = useCorporativoFilterStore();

  const filteredCorporativos = useMemo(() => {
    return corporativos.filter((corporativo) => {
      const matchesSearch =
        corporativo.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        corporativo.tipo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        corporativo.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [corporativos, searchQuery]);

  if (filteredCorporativos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron corporativos
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fincas Asociadas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCorporativos.map((corporativo) => (
            <TableRow key={corporativo._id}>
              <TableCell className="font-medium">{corporativo.nombre}</TableCell>
              <TableCell>{corporativo.tipo || "-"}</TableCell>
              <TableCell>{corporativo.descripcion || "-"}</TableCell>
              <TableCell>
                {corporativo.fincas_asociadas?.length || 0}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(corporativo)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(corporativo)}
                    title="Eliminar"
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
