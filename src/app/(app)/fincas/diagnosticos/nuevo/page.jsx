"use client";

import { Suspense } from "react";
import DiagnosticoWizard from "@/components/diagnosticos/DiagnosticoWizard";

export default function NuevoDiagnosticoPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DiagnosticoWizard />
    </Suspense>
  );
}
