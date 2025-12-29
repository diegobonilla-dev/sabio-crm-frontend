'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavItem } from './NavItem';

/**
 * Grupo colapsable de items de navegación
 * Se adapta al estado colapsado/expandido del sidebar
 *
 * @param {Object} props
 * @param {React.ComponentType} [props.icon] - Icono del grupo
 * @param {string} props.label - Título del grupo
 * @param {Array} props.items - Items del grupo [{href, label, icon?}]
 * @param {boolean} props.isCollapsed - Si el sidebar está colapsado
 */
export function CollapsibleNavGroup({
  icon: Icon,
  label,
  items,
  isCollapsed
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Si el sidebar está colapsado, no mostrar el collapsible
  // Los items se mostrarán como NavItems individuales en el padre
  if (isCollapsed) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
          "hover:bg-gray-100 active:bg-gray-200 text-gray-700"
        )}
      >
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <span className="flex-1 text-sm font-medium text-left truncate">
          {label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-1">
        <div className="ml-2 pl-3 border-l-2 border-gray-200 space-y-1">
          {items.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isCollapsed={false}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
