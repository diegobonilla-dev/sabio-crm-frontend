"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFinca } from "@/hooks/fincas/useFincas";
import { useDiagnosticoDraft } from "@/hooks/diagnosticos/useDiagnosticoDraft";
import { useDiagnosticoMutations } from "@/hooks/diagnosticos/useDiagnosticoMutations";

// Import step components
import Step1InformacionGeneral from "./steps/Step1InformacionGeneral";
// TODO: Import other steps when created

const TOTAL_STEPS = 10;

export default function DiagnosticoWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fincaId = searchParams.get("fincaId");
  const tipoDiagnostico = searchParams.get("tipo") || "Ganaderia";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const { data: finca } = useFinca(fincaId);
  const { saveDraft, loadDraft, clearDraft } = useDiagnosticoDraft(fincaId);
  const { createDiagnostico, updateDiagnostico } = useDiagnosticoMutations();

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft.formData);
      setCurrentStep(draft.currentStep);
    }
  }, [loadDraft]);

  // Auto-save draft on formData change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveDraft({ formData, currentStep });
    }
  }, [formData, currentStep, saveDraft]);

  const handleStepChange = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await createDiagnostico.mutateAsync({
        finca: fincaId,
        tipo_diagnostico: tipoDiagnostico,
        ...formData,
        estado: 'Completado'
      });

      clearDraft();
      router.push('/fincas/diagnosticos');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1InformacionGeneral
            data={formData}
            finca={finca}
            onChange={handleStepChange}
          />
        );
      // TODO: Add more steps
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Paso {currentStep}</h3>
            <p className="text-gray-600">Este paso está en desarrollo</p>
          </div>
        );
    }
  };

  if (!fincaId) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600">No se ha seleccionado una finca</p>
            <Button onClick={() => router.push('/fincas/diagnosticos')} className="mt-4">
              Volver a diagnósticos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Nuevo Diagnóstico - {tipoDiagnostico}
          </h1>
          <p className="text-gray-600">
            Finca: {finca?.nombre || "Cargando..."}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Paso {currentStep} de {TOTAL_STEPS}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
          </div>
          <Progress value={(currentStep / TOTAL_STEPS) * 100} />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={createDiagnostico.isPending}>
              {createDiagnostico.isPending ? "Guardando..." : "Finalizar"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
