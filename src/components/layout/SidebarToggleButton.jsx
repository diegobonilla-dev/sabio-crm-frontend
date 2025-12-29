'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Botón para colapsar/expandir el sidebar
 * Se muestra solo en desktop (md:)
 *
 * @param {Object} props
 * @param {boolean} props.isCollapsed - Estado actual del sidebar
 * @param {Function} props.onToggle - Función para alternar el estado
 */
export function SidebarToggleButton({ isCollapsed, onToggle }) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden md:flex h-9 w-9"
            aria-label={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <ChevronLeft className="h-5 w-5 transition-transform duration-200" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p>{isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
