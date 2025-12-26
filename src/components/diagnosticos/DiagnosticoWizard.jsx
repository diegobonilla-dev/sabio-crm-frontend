"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { useFinca } from "@/hooks/fincas/useFincas";
import { useDiagnosticoDraft } from "@/hooks/diagnosticos/useDiagnosticoDraft";
import { useDiagnosticoMutations } from "@/hooks/diagnosticos/useDiagnosticoMutations";

// Import step components
import Step1InformacionGeneral from "./steps/Step1InformacionGeneral";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5IndicadoresP4G from "./steps/Step5IndicadoresP4G";
import Step6Sostenibilidad from "./steps/Step6Sostenibilidad";
// TODO: Import other steps when created

const STEPS_CONFIG = [
  { id: 1, title: "Información General", fraction: "1/10" },
  { id: 2, title: "Sistema Productivo", fraction: "2/10" },
  { id: 3, title: "Fertilización y Fumigación", fraction: "3/10" },
  { id: 4, title: "Manejo de Pastoreo/Cultivo", fraction: "4/10" },
  { id: 5, title: "Indicadores P4G", fraction: "5/10" },
  { id: 6, title: "Sostenibilidad", fraction: "6/10" },
  { id: 7, title: "Evaluación por Lote", fraction: "7/10" },
  { id: 8, title: "Aspectos Económicos", fraction: "8/10" },
  { id: 9, title: "Observaciones", fraction: "9/10" },
  { id: 10, title: "Validación y Cierre", fraction: "10/10" },
];

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
  const { createDiagnostico/* , updateDiagnostico  */} = useDiagnosticoMutations();

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
    <div className="min-h-screen bg-gray-50">
      {/* Header con Progreso */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Diagnóstico</h1>
              <p className="text-sm text-gray-600">
                {finca?.nombre || "Cargando..."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Guardar Borrador
              </Button>
              <Button variant="outline" size="sm">
                Generar PDF
              </Button>
              <Button size="sm">
                Enviar para Firma
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Completado
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((currentStep / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <Progress value={(currentStep / TOTAL_STEPS) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Lista de Pasos */}
          <Card className="w-80 flex-shrink-0 p-4 h-fit">
            <h2 className="font-semibold text-gray-900 mb-4">Progreso del Diagnóstico</h2>
            <div className="space-y-1">
              {STEPS_CONFIG.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isCurrent
                        ? "bg-green-50 border border-green-200"
                        : isCompleted
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isCurrent ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{step.fraction}</span>
                  </div>
                );
              })}
            </div>

            {/* Recordatorio */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                  i
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-900">Recordatorio</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Guarda tu progreso frecuentemente. Los datos se almacenan automáticamente cada 5 minutos.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Content Area */}
          <Card className="flex-1 p-6">
            {/* Step Content */}
            <div className="min-h-[500px]">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
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
      </div>
    </div>
  );
}
