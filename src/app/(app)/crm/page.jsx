"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeads } from "@/hooks/leads/useLeads";
import LeadsTable from "@/components/leads/LeadsTable";
import SearchAndFilters from "@/components/leads/SearchAndFilters";
import Pagination from "@/components/leads/Pagination";
import LeadFormModal from "@/components/leads/LeadFormModal";
import DeleteConfirmDialog from "@/components/leads/DeleteConfirmDialog";
import ConvertirLeadModal from "@/components/leads/ConvertirLeadModal";

export default function CRMPage() {
  const { data: leads = [], isLoading, error } = useLeads();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConvertirModalOpen, setIsConvertirModalOpen] = useState(false);

  const handleNuevoLead = () => {
    setSelectedLead(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setIsFormModalOpen(true);
  };

  const handleDelete = (lead) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleConvertir = (lead) => {
    setSelectedLead(lead);
    setIsConvertirModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedLead(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedLead(null);
  };

  const handleCloseConvertirModal = () => {
    setIsConvertirModalOpen(false);
    setSelectedLead(null);
  };

  if (isLoading) return <div className="container mx-auto py-6 px-4">Cargando...</div>;
  if (error) return <div className="container mx-auto py-6 px-4">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM - Leads</h1>
          <p className="text-gray-600 mt-1">Gestiona tus prospectos y oportunidades de venta</p>
        </div>
        <Button onClick={handleNuevoLead} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Lead
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>
            {leads.length} lead{leads.length !== 1 ? 's' : ''} registrado{leads.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchAndFilters />
          <LeadsTable
            leads={leads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onConvertir={handleConvertir}
          />
          <Pagination />
        </CardContent>
      </Card>

      {/* Modals */}
      <LeadFormModal
        open={isFormModalOpen}
        onOpenChange={handleCloseFormModal}
        lead={selectedLead}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        lead={selectedLead}
      />

      <ConvertirLeadModal
        open={isConvertirModalOpen}
        onOpenChange={handleCloseConvertirModal}
        lead={selectedLead}
      />
    </div>
  );
}
