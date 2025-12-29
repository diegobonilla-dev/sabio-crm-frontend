"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import DiagnosticoWizard from "@/components/diagnosticos/DiagnosticoWizard";

export default function NuevoDiagnosticoPage() {
  // Deshabilitar scroll del main cuando montamos el wizard
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.overflow = 'hidden';
    }

    return () => {
      if (mainElement) {
        mainElement.style.overflow = '';
      }
    };
  }, []);

  return (
    <div className="-m-4 -mb-20 md:-m-6 md:-mb-6 h-screen overflow-hidden">
      <Suspense fallback={<div>Cargando...</div>}>
        <DiagnosticoWizard />
      </Suspense>
    </div>
  );
}
