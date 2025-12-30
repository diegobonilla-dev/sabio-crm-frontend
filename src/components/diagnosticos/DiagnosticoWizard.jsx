"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, FileText, Send, Clock } from "lucide-react";
import { useFinca } from "@/hooks/fincas/useFincas";
import { useDiagnosticoDraft } from "@/hooks/diagnosticos/useDiagnosticoDraft";
import { useDiagnosticoMutations } from "@/hooks/diagnosticos/useDiagnosticoMutations";

// Import wizard components
import {
  WizardProgressMobile,
  WizardProgressTablet,
  WizardProgressDesktop
} from "./WizardProgress";
import { STEPS_CONFIG, TOTAL_STEPS } from "./wizard-config";

// Import step components
import Step1InformacionGeneral from "./steps/Step1InformacionGeneral";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5IndicadoresP4G from "./steps/Step5IndicadoresP4G";
import Step6Sostenibilidad from "./steps/Step6Sostenibilidad";
import Step7Biofabrica from "./steps/Step7Biofabrica";
import Step8Observaciones from "./steps/Step8Observaciones";
import Step9ValidacionCierre from "./steps/Step9ValidacionCierre";

export default function DiagnosticoWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fincaId = searchParams.get("fincaId");
  const tipoDiagnostico = searchParams.get("tipo") || "Ganaderia";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const { data: finca } = useFinca(fincaId);
  const { saveDraft, loadDraft, clearDraft } = useDiagnosticoDraft(fincaId);
  const { createDiagnostico } = useDiagnosticoMutations();

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

  const handleStepClick = (stepId) => {
    // Permitir navegar a pasos completados o al actual
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top en mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Scroll to top en mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      case 2:
        return (
          <Step2
            data={formData}
            finca={finca}
            onChange={handleStepChange}
          />
        );
      case 3:
        return (
          <Step3
            data={formData}
            finca={finca}
            onChange={handleStepChange}
          />
        );
      case 4:
        return (
          <Step4
            data={formData}
            finca={finca}
            onChange={handleStepChange}
          />
        );
      case 5:
        return (
          <Step5IndicadoresP4G
            data={formData}
            onChange={handleStepChange}
          />
        );
      case 6:
        return (
          <Step6Sostenibilidad
            data={formData}
            onChange={handleStepChange}
          />
        );
      case 7:
        return (
          <Step7Biofabrica
            data={formData}
            onChange={handleStepChange}
          />
        );
      case 8:
        return (
          <Step8Observaciones
            data={formData}
            onChange={handleStepChange}
          />
        );
      case 9:
        return (
          <Step9ValidacionCierre
            data={formData}
            onChange={handleStepChange}
          />
        );
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

  const currentStepConfig = STEPS_CONFIG.find(s => s.id === currentStep);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Mobile Progress - Horizontal sticky - SOLO < md */}
      <div className="md:hidden">
        <WizardProgressMobile
          steps={STEPS_CONFIG}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main Layout con Sidebars - Ocupa el resto de la altura */}
      <div className="flex flex-1 min-h-0">
        {/* Tablet Progress - Sidebar mini */}
        <WizardProgressTablet
          steps={STEPS_CONFIG}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Desktop Progress - Sidebar completo */}
        <WizardProgressDesktop
          steps={STEPS_CONFIG}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Content Area - Responsive con estructura flex */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header con info de finca - STICKY en desktop */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="px-4 md:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between gap-4 w-full">
                {/* Info de la finca */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                    Diagnóstico: {finca?.nombre || "Cargando..."}
                  </h1>
                </div>

                {/* Actions - Desktop only */}
                <div className="hidden lg:flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1.5" />
                    Guardar Borrador
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Generar PDF
                  </Button>
                  <Button size="sm" disabled={currentStep < TOTAL_STEPS}>
                    <Send className="h-4 w-4 mr-1.5" />
                    Enviar para Firma
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content - Scrollable con padding bottom para mobile */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 md:px-6 lg:px-8 py-6 lg:py-8 pb-40 md:pb-32 lg:pb-20">
              {/* Step Header - Mobile/Tablet */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentStepConfig?.title}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    En progreso
                  </span>
                </div>
                {currentStepConfig?.description && (
                  <p className="text-sm text-gray-600">
                    {currentStepConfig.description}
                  </p>
                )}
              </div>

              {/* Step Header - Desktop */}
              <div className="hidden lg:block mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {currentStepConfig?.title}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full flex-shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    En progreso
                  </span>
                </div>
                {currentStepConfig?.description && (
                  <p className="text-gray-600">
                    {currentStepConfig.description}
                  </p>
                )}
              </div>

              {/* Step Content */}
              <div className="mb-6">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="border-t border-gray-200 pt-6 mt-8">
                {/* Mobile/Tablet - Grid de 2 columnas */}
                <div className="grid grid-cols-2 gap-3 lg:hidden">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="min-h-[44px]"
                  >
                    ← Anterior
                  </Button>

                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      onClick={handleNext}
                      className="min-h-[44px]"
                    >
                      Siguiente →
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={createDiagnostico.isPending}
                      className="min-h-[44px]"
                    >
                      {createDiagnostico.isPending ? "Guardando..." : "Finalizar"}
                    </Button>
                  )}
                </div>

                {/* Desktop - Layout horizontal con contador central */}
                <div className="hidden lg:flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    ← Anterior
                  </Button>

                  <span className="text-sm text-gray-600">
                    Paso {currentStep} de {TOTAL_STEPS}
                  </span>

                  {currentStep < TOTAL_STEPS ? (
                    <Button onClick={handleNext}>
                      Siguiente →
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={createDiagnostico.isPending}
                    >
                      {createDiagnostico.isPending ? "Guardando..." : "Finalizar"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Actions móviles - Bottom */}
              <div className="lg:hidden mt-6 pt-6 border-t border-gray-200 flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Save className="h-4 w-4 mr-1.5" />
                  Guardar Borrador
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Generar PDF
                  </Button>
                  <Button size="sm" disabled={currentStep < TOTAL_STEPS}>
                    <Send className="h-4 w-4 mr-1.5" />
                    Enviar Firma
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
