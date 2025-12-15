"use client";

import { useMemo } from "react";
import { Edit, Trash2, RefreshCw } from "lucide-react";
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
import useLeadFilterStore from "@/lib/store/leadFilterStore";

const etapaColors = {
  'Nuevo': 'bg-blue-500',
  'Contactado': 'bg-yellow-500',
  'Cotizado': 'bg-purple-500',
  'Negociacion': 'bg-orange-500',
  'Ganado': 'bg-green-500',
  'Perdido': 'bg-red-500'
};

export default function LeadsTable({ leads, onEdit, onDelete, onConvertir }) {
  const { searchQuery, etapaFilter } = useLeadFilterStore();

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.empresa_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contacto_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.telefono?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEtapa = etapaFilter === 'Todos' || lead.etapa_funnel === etapaFilter;

      return matchesSearch && matchesEtapa;
    });
  }, [leads, searchQuery, etapaFilter]);

  if (filteredLeads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron leads
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell className="font-medium">{lead.empresa_nombre}</TableCell>
              <TableCell>{lead.contacto_nombre}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.telefono}</TableCell>
              <TableCell>
                <Badge className={etapaColors[lead.etapa_funnel] || 'bg-gray-500'}>
                  {lead.etapa_funnel}
                </Badge>
              </TableCell>
              <TableCell>{lead.origen || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Botón Convertir - solo para leads no convertidos */}
                  {!lead.empresa_convertida && lead.etapa_funnel !== 'Perdido' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onConvertir(lead)}
                      title="Convertir a Cliente"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(lead)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(lead)}
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
