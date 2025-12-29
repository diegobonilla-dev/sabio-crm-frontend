'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Item de navegación del sidebar que se adapta al estado colapsado/expandido
 *
 * @param {Object} props
 * @param {string} props.href - URL de destino
 * @param {React.ComponentType} [props.icon] - Componente de icono (lucide-react)
 * @param {string} props.label - Texto del item
 * @param {boolean} props.isCollapsed - Si el sidebar está colapsado
 * @param {string|number} [props.badge] - Badge opcional (ej: contador)
 */
export function NavItem({
  href,
  icon: Icon,
  label,
  isCollapsed,
  badge
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        "hover:bg-gray-100 active:bg-gray-200",
        isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100",
        !isActive && "text-gray-700",
        isCollapsed && "justify-center px-2"
      )}
    >
      {Icon && (
        <Icon className={cn(
          "flex-shrink-0",
          isActive ? "h-5 w-5" : "h-5 w-5"
        )} />
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm font-medium truncate">
            {label}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white font-semibold">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  // Si está colapsado, mostrar tooltip
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p className="font-medium">{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
