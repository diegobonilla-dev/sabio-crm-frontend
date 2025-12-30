'use client';

import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getStepStatus } from './wizard-config';

/**
 * Variante Mobile: Progress horizontal con números circulares
 * Se muestra solo en mobile (< md)
 * NOTA: El control de visibilidad se hace desde el componente padre
 */
export function WizardProgressMobile({ steps, currentStep, onStepClick }) {
  const scrollContainerRef = useRef(null);

  // Auto-scroll al paso actual cuando cambia
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentButton = scrollContainerRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (currentButton) {
        currentButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentStep]);

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
      {/* Progress Numbers */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 px-4 py-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {steps.map((step) => {
          const status = getStepStatus(step.id, currentStep);
          return (
            <button
              key={step.id}
              data-step={step.id}
              onClick={() => onStepClick(step.id)}
              disabled={status === 'pending'}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-0.5 snap-center",
                "transition-all duration-200"
              )}
              aria-label={`${step.title} - ${status === 'completed' ? 'Completado' : status === 'current' ? 'Actual' : 'Pendiente'}`}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {/* Número arriba - más pequeño */}
              <span className={cn(
                "text-[10px] font-medium",
                status === 'completed' && "text-gray-700",
                status === 'current' && "text-gray-900",
                status === 'pending' && "text-gray-400"
              )}>
                {step.id}
              </span>

              {/* Círculo con check o vacío - más pequeño */}
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200",
                status === 'completed' && "bg-[#10B981]",
                status === 'current' && "bg-[#4B8BF4]",
                status === 'pending' && "bg-gray-200 cursor-not-allowed"
              )}>
                {status === 'completed' && (
                  <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Variante Tablet: Sidebar vertical mini (48px) con números + checks
 * Se muestra solo en tablet (md pero no lg)
 */
export function WizardProgressTablet({ steps, currentStep, onStepClick }) {
  return (
    <aside className="hidden md:block lg:hidden w-14 border-r border-gray-200 bg-gray-50 flex-shrink-0">
      <div className="sticky top-20 py-4 px-1.5 space-y-2.5">
        {steps.map((step) => {
          const status = getStepStatus(step.id, currentStep);
          return (
            <TooltipProvider key={step.id} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onStepClick(step.id)}
                    disabled={status === 'pending'}
                    className={cn(
                      "w-full flex flex-col items-center gap-1",
                      "transition-all duration-200"
                    )}
                    aria-label={step.title}
                    aria-current={status === 'current' ? 'step' : undefined}
                  >
                    {/* Número arriba - más pequeño */}
                    <span className={cn(
                      "text-[10px] font-medium",
                      status === 'completed' && "text-gray-700",
                      status === 'current' && "text-gray-900",
                      status === 'pending' && "text-gray-400"
                    )}>
                      {step.id}
                    </span>

                    {/* Círculo - más pequeño */}
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200",
                      status === 'completed' && "bg-[#10B981]",
                      status === 'current' && "bg-[#4B8BF4]",
                      status === 'pending' && "bg-gray-200 cursor-not-allowed"
                    )}>
                      {status === 'completed' && (
                        <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                      )}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <div className="max-w-[200px]">
                    <p className="font-medium">{step.title}</p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </aside>
  );
}

/**
 * Variante Desktop: Sidebar vertical completo (280px) con números, textos y descripciones
 * Se muestra solo en desktop (>= lg)
 */
export function WizardProgressDesktop({ steps, currentStep, onStepClick }) {
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <aside className="hidden lg:block w-[280px] border-r border-gray-200 bg-gray-50 flex-shrink-0">
      <div className="sticky top-0 h-screen overflow-y-auto flex flex-col">
        {/* Barra de Progreso - Solo en el panel izquierdo, arriba del listado */}
        <div className="px-4 pt-4 pb-3">
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#10B981] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Listado de Steps */}
        <div className="px-4 pb-6 space-y-3">
          {steps.map((step) => {
            const status = getStepStatus(step.id, currentStep);
            return (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                disabled={status === 'pending'}
                className={cn(
                  "w-full py-2.5 px-2 rounded-lg text-left transition-all duration-200",
                  "flex items-center gap-2.5",
                  status === 'current' && "bg-[#EFF6FF]",
                  status === 'completed' && "hover:bg-gray-100",
                  status === 'pending' && "cursor-not-allowed opacity-60"
                )}
                aria-label={step.title}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {/* Círculo con check - MÁS PEQUEÑO */}
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full",
                  "flex items-center justify-center transition-all duration-200",
                  status === 'current' && "bg-[#4B8BF4]",
                  status === 'completed' && "bg-[#10B981]",
                  status === 'pending' && "bg-gray-200"
                )}>
                  {status === 'completed' && (
                    <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                  )}
                </div>

                {/* Número - Mismo color que el texto */}
                <span className={cn(
                  "flex-shrink-0 text-sm font-medium min-w-[1.5rem]",
                  status === 'completed' && "text-gray-700",
                  status === 'current' && "text-gray-900",
                  status === 'pending' && "text-gray-400"
                )}>
                  {step.id}.
                </span>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    status === 'completed' && "text-gray-700",
                    status === 'current' && "text-gray-900",
                    status === 'pending' && "text-gray-400"
                  )}>
                    {step.title}
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      {step.fraction}
                    </span>
                  </p>
                </div>
              </button>
            );
          })}

          {/* Info Box - Tip del paso actual */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900 font-medium mb-1">
              💡 Consejo
            </p>
            <p className="text-xs text-blue-800">
              {steps.find(s => s.id === currentStep)?.tip || "Completa todos los campos requeridos"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
