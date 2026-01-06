"use client";

import { useMemo } from "react";
import { Edit, Trash2, Building2 } from "lucide-react";
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
import useFincaFilterStore from "@/lib/store/fincaFilterStore";

const tipoColors = {
  'Ganaderia': 'bg-green-500',
  'Flores': 'bg-pink-500',
  'Frutales': 'bg-orange-500',
  'Cafe': 'bg-amber-700',
  'Aguacate': 'bg-lime-500',
  'Mixto': 'bg-purple-500',
  'Otro': 'bg-gray-500'
};

// Función para capitalizar texto
const capitalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function FincasTable({ fincas, onEdit, onDelete, onAsignarCorporativo }) {
  const { searchQuery, tipoFilter, empresaFilter } = useFincaFilterStore();

  const filteredFincas = useMemo(() => {
    return fincas.filter((finca) => {
      const matchesSearch =
        finca.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finca.municipio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finca.empresa_owner?.nombre_comercial?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTipo = tipoFilter === 'Todos' || finca.tipo_produccion === tipoFilter;

      const matchesEmpresa = empresaFilter === 'Todos' ||
        finca.empresa_owner?._id === empresaFilter;

      return matchesSearch && matchesTipo && matchesEmpresa;
    });
  }, [fincas, searchQuery, tipoFilter, empresaFilter]);

  if (filteredFincas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron fincas
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Área (ha)</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Corporativos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFincas.map((finca) => (
            <TableRow key={finca._id}>
              <TableCell className="font-medium">{finca.nombre}</TableCell>
              <TableCell>{finca.empresa_owner?.nombre_comercial || "-"}</TableCell>
              <TableCell>
                <Badge className={tipoColors[finca.tipo_produccion] || 'bg-gray-500'}>
                  {finca.tipo_produccion}
                </Badge>
              </TableCell>
              <TableCell>{finca.area}</TableCell>
              <TableCell>
                {finca.municipio && finca.departamento
                  ? `${capitalize(finca.municipio)}, ${capitalize(finca.departamento)}`
                  : capitalize(finca.municipio) || capitalize(finca.departamento) || "-"}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {finca.corporativos_asociados?.length || 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAsignarCorporativo(finca)}
                    title="Asignar corporativo"
                  >
                    <Building2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(finca)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(finca)}
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
