'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
        className="flex items-center gap-2 px-4 py-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
                "flex-shrink-0 w-8 h-8 rounded-full snap-center",
                "flex items-center justify-center text-sm font-semibold",
                "transition-all duration-200",
                status === 'completed' && "bg-green-500 text-white hover:bg-green-600",
                status === 'current' && "bg-green-700 text-white ring-2 ring-green-700 ring-offset-2 scale-110",
                status === 'pending' && "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
              aria-label={`${step.title} - ${status === 'completed' ? 'Completado' : status === 'current' ? 'Actual' : 'Pendiente'}`}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                step.id
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
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
    <aside className="hidden md:block lg:hidden w-12 border-r border-gray-200 bg-gray-50 flex-shrink-0">
      <div className="sticky top-20 py-4 space-y-2">
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
                      "w-full h-10 flex items-center justify-center",
                      "rounded-md transition-all duration-200",
                      status === 'current' && "bg-green-700 text-white shadow-sm",
                      status === 'completed' && "bg-green-50 text-green-700 hover:bg-green-100",
                      status === 'pending' && "text-gray-400 cursor-not-allowed"
                    )}
                    aria-label={step.title}
                    aria-current={status === 'current' ? 'step' : undefined}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
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
  return (
    <aside className="hidden lg:block w-[280px] border-r border-gray-200 bg-gray-50 flex-shrink-0">
      <div className="sticky top-0 py-6 px-4 space-y-1.5 h-screen overflow-y-auto">
        {steps.map((step) => {
          const status = getStepStatus(step.id, currentStep);
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              disabled={status === 'pending'}
              className={cn(
                "w-full p-2.5 rounded-lg text-left transition-all duration-200",
                "flex items-center gap-3",
                status === 'current' && "bg-green-700 text-white shadow-md",
                status === 'completed' && "bg-green-50 hover:bg-green-100",
                status === 'pending' && "cursor-not-allowed opacity-60"
              )}
              aria-label={step.title}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {/* Number/Check Circle */}
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full",
                "flex items-center justify-center text-xs font-bold",
                status === 'current' && "bg-white text-green-700",
                status === 'completed' && "bg-green-500 text-white",
                status === 'pending' && "bg-gray-300 text-gray-600"
              )}>
                {status === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  status === 'current' ? "text-white" : "text-gray-700"
                )}>
                  {step.title}
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
    </aside>
  );
}
