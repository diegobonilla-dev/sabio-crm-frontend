"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserCog,
  ChevronDown,
  Building,
  LayoutDashboard,
  Users,
  Sprout,
  ClipboardList,
  Settings
} from "lucide-react";
import useAuthStore from "@/app/lib/store";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { SidebarToggleButton } from "@/components/layout/SidebarToggleButton";
import { NavItem } from "@/components/layout/NavItem";
import { CollapsibleNavGroup } from "@/components/layout/CollapsibleNavGroup";
import MobileMenu from "@/components/layout/MobileMenu";
import MobileDrawer from "@/components/layout/MobileDrawer";
import BottomNav from "@/components/layout/BottomNav";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [isReady, setIsReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fincasOpen, setFincasOpen] = useState(false);

  // Hook para sidebar colapsable
  const { isCollapsed, toggle, isHydrated: isSidebarHydrated } = useSidebarCollapse();

  // Verificar si el usuario es admin o vendedor
  const isAdmin = user?.role === "sabio_admin";
  const isAdminOrVendedor = user?.role === "sabio_admin" || user?.role === "sabio_vendedor";

  useEffect(() => {
    if (hasHydrated) {
      setIsReady(true);
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Mostrar loading mientras se hidrata
  if (!isReady || !hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop - Colapsable */}
      {isSidebarHydrated && (
        <aside
          className={cn(
            "hidden md:flex flex-col bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-200",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          {/* Logo / Header */}
          <div className={cn(
            "border-b border-gray-200 flex items-center flex-shrink-0",
            "h-[57px] md:h-[65px]", // Altura fija para alinear con header principal
            isCollapsed ? "justify-center px-2" : "px-4"
          )}>
            {isCollapsed ? (
              <span className="text-xl font-bold text-blue-600">S</span>
            ) : (
              <h2 className="text-xl font-bold text-gray-800">SaBio CRM</h2>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            <NavItem
              href="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              isCollapsed={isCollapsed}
            />

            <NavItem
              href="/crm"
              icon={Users}
              label="CRM"
              isCollapsed={isCollapsed}
            />

            {/* Fincas - Grupo colapsable cuando no está collapsed */}
            {!isCollapsed ? (
              <CollapsibleNavGroup
                icon={Sprout}
                label="Fincas"
                items={[
                  { href: '/fincas', label: 'Fincas', icon: Sprout },
                  { href: '/fincas/diagnosticos', label: 'Diagnósticos', icon: ClipboardList }
                ]}
                isCollapsed={isCollapsed}
              />
            ) : (
              // Cuando está collapsed, mostrar items individuales
              <>
                <NavItem
                  href="/fincas"
                  icon={Sprout}
                  label="Fincas"
                  isCollapsed={isCollapsed}
                />
                <NavItem
                  href="/fincas/diagnosticos"
                  icon={ClipboardList}
                  label="Diagnósticos"
                  isCollapsed={isCollapsed}
                />
              </>
            )}

            <NavItem
              href="/admin"
              icon={Settings}
              label="Admin"
              isCollapsed={isCollapsed}
            />

            {isAdmin && (
              <NavItem
                href="/admin/usuarios"
                icon={UserCog}
                label="Usuarios"
                isCollapsed={isCollapsed}
              />
            )}

            {isAdminOrVendedor && (
              <NavItem
                href="/admin/corporativos"
                icon={Building}
                label="Corporativos"
                isCollapsed={isCollapsed}
              />
            )}
          </nav>
        </aside>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <nav className="py-2">
          <div
            className="px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </div>
          <Link
            href="/crm"
            className="px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors block"
            onClick={() => setMobileMenuOpen(false)}
          >
            CRM
          </Link>

          {/* Fincas con Desplegable - Mobile */}
          <Collapsible open={fincasOpen} onOpenChange={setFincasOpen}>
            <CollapsibleTrigger className="w-full px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between">
              <span>Fincas</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  fincasOpen ? "transform rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-gray-50">
              <Link
                href="/fincas"
                className="px-10 py-2 text-sm text-gray-700 active:bg-gray-100 cursor-pointer transition-colors block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fincas
              </Link>
              <Link
                href="/fincas/diagnosticos"
                className="px-10 py-2 text-sm text-gray-700 active:bg-gray-100 cursor-pointer transition-colors block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Diagnósticos
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <div
            className="px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </div>
          {isAdmin && (
            <Link
              href="/admin/usuarios"
              className="px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserCog className="h-4 w-4" />
              Usuarios
            </Link>
          )}
          {isAdminOrVendedor && (
            <Link
              href="/admin/corporativos"
              className="px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building className="h-4 w-4" />
              Corporativos
            </Link>
          )}
        </nav>
      </MobileDrawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 flex-shrink-0 h-[57px] md:h-[65px] flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Mobile: Hamburger + Logo */}
            <div className="flex items-center gap-3 md:hidden min-w-0">
              <MobileMenu
                isOpen={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
              <h1 className="text-lg font-semibold text-gray-800 truncate">Dashboard</h1>
            </div>

            {/* Desktop: Toggle Button + Título */}
            <div className="hidden md:flex items-center gap-3">
              {isSidebarHydrated && (
                <SidebarToggleButton isCollapsed={isCollapsed} onToggle={toggle} />
              )}
              <h1 className="text-2xl font-semibold text-gray-800">
                Dashboard
              </h1>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Email (solo desktop) */}
              <span className="hidden md:inline text-sm text-gray-600 truncate max-w-[200px]">
                {user?.email || 'Usuario'}
              </span>

              {/* User Avatar (mobile) - Primera letra del email */}
              <div className="md:hidden w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="text-sm text-gray-600 hover:text-gray-800 hover:underline px-2 py-1.5 md:px-0 flex-shrink-0 min-h-[44px] md:min-h-0 flex items-center"
              >
                <span className="hidden md:inline">Cerrar Sesión</span>
                <span className="md:hidden">Salir</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}
