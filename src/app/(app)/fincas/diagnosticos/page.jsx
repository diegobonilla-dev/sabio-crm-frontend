"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiagnosticos } from "@/hooks/diagnosticos/useDiagnosticos";
import DiagnosticosTable from "@/components/diagnosticos/DiagnosticosTable";
import SearchAndFilters from "@/components/diagnosticos/SearchAndFilters";
import Pagination from "@/components/diagnosticos/Pagination";
import FincaSelectorModal from "@/components/diagnosticos/FincaSelectorModal";
import DeleteConfirmDialog from "@/components/diagnosticos/DeleteConfirmDialog";

export default function DiagnosticosPage() {
  const { data: diagnosticos = [], isLoading, error } = useDiagnosticos();

  const [isFincaSelectorOpen, setIsFincaSelectorOpen] = useState(false);
  const [selectedDiagnostico, setSelectedDiagnostico] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleNuevoDiagnostico = () => {
    setIsFincaSelectorOpen(true);
  };

  const handleEdit = (diagnostico) => {
    // TODO: Navigate to edit wizard
    console.log(diagnostico)
  };

  const handleDelete = (diagnostico) => {
    setSelectedDiagnostico(diagnostico);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diagnósticos</h1>
          <p className="text-gray-600 mt-1">Gestiona los diagnósticos de fincas</p>
        </div>
        <Button onClick={handleNuevoDiagnostico} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Diagnóstico
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Diagnósticos</CardTitle>
          <CardDescription>
            {diagnosticos.length} diagnóstico{diagnosticos.length !== 1 ? 's' : ''} registrado{diagnosticos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchAndFilters />
          <DiagnosticosTable
            diagnosticos={diagnosticos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination />
        </CardContent>
      </Card>

      {/* Modals */}
      <FincaSelectorModal
        open={isFincaSelectorOpen}
        onOpenChange={setIsFincaSelectorOpen}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        diagnostico={selectedDiagnostico}
      />
    </div>
  );
}
