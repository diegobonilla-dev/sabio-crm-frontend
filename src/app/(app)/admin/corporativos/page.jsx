"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCorporativos } from "@/hooks/corporativos/useCorporativos";
import CorporativosTable from "@/components/corporativos/CorporativosTable";
import SearchAndFilters from "@/components/corporativos/SearchAndFilters";
import Pagination from "@/components/corporativos/Pagination";
import CorporativoFormModal from "@/components/corporativos/CorporativoFormModal";
import DeleteConfirmDialog from "@/components/corporativos/DeleteConfirmDialog";

export default function CorporativosPage() {
  const { data: corporativos = [], isLoading, error } = useCorporativos();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCorporativo, setSelectedCorporativo] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleNuevoCorporativo = () => {
    setSelectedCorporativo(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (corporativo) => {
    setSelectedCorporativo(corporativo);
    setIsFormModalOpen(true);
  };

  const handleDelete = (corporativo) => {
    setSelectedCorporativo(corporativo);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCorporativo(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCorporativo(null);
  };

  if (isLoading) return <div className="container mx-auto py-6 px-4">Cargando...</div>;
  if (error) return <div className="container mx-auto py-6 px-4">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Corporativos</h1>
          <p className="text-gray-600 mt-1">Gestiona los corporativos del sistema</p>
        </div>
        <Button onClick={handleNuevoCorporativo} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Corporativo
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Corporativos</CardTitle>
          <CardDescription>
            {corporativos.length} corporativo{corporativos.length !== 1 ? 's' : ''} registrado{corporativos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchAndFilters />
          <CorporativosTable
            corporativos={corporativos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination />
        </CardContent>
      </Card>

      {/* Modals */}
      <CorporativoFormModal
        open={isFormModalOpen}
        onOpenChange={handleCloseFormModal}
        corporativo={selectedCorporativo}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        corporativo={selectedCorporativo}
      />
    </div>
  );
}
