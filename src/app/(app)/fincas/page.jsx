"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFincas } from "@/hooks/fincas/useFincas";
import FincasTable from "@/components/fincas/FincasTable";
import SearchAndFilters from "@/components/fincas/SearchAndFilters";
import Pagination from "@/components/fincas/Pagination";
import FincaFormModal from "@/components/fincas/FincaFormModal";
import DeleteConfirmDialog from "@/components/fincas/DeleteConfirmDialog";
import CorporativoAssignModal from "@/components/fincas/CorporativoAssignModal";

export default function FincasPage() {
  const { data: fincas = [], isLoading, error } = useFincas();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedFinca, setSelectedFinca] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCorporativoModalOpen, setIsCorporativoModalOpen] = useState(false);

  const handleNuevaFinca = () => {
    setSelectedFinca(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (finca) => {
    setSelectedFinca(finca);
    setIsFormModalOpen(true);
  };

  const handleDelete = (finca) => {
    setSelectedFinca(finca);
    setIsDeleteDialogOpen(true);
  };

  const handleAsignarCorporativo = (finca) => {
    setSelectedFinca(finca);
    setIsCorporativoModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedFinca(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedFinca(null);
  };

  const handleCloseCorporativoModal = () => {
    setIsCorporativoModalOpen(false);
    setSelectedFinca(null);
  };

  if (isLoading) return <div className="container mx-auto py-6 px-4">Cargando...</div>;
  if (error) return <div className="container mx-auto py-6 px-4">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fincas</h1>
          <p className="text-gray-600 mt-1">Gestiona las fincas de tus clientes</p>
        </div>
        <Button onClick={handleNuevaFinca} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Finca
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fincas</CardTitle>
          <CardDescription>
            {fincas.length} finca{fincas.length !== 1 ? 's' : ''} registrada{fincas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchAndFilters />
          <FincasTable
            fincas={fincas}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAsignarCorporativo={handleAsignarCorporativo}
          />
          <Pagination />
        </CardContent>
      </Card>

      {/* Modals */}
      <FincaFormModal
        open={isFormModalOpen}
        onOpenChange={handleCloseFormModal}
        finca={selectedFinca}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        finca={selectedFinca}
      />

      <CorporativoAssignModal
        open={isCorporativoModalOpen}
        onOpenChange={handleCloseCorporativoModal}
        finca={selectedFinca}
      />
    </div>
  );
}
