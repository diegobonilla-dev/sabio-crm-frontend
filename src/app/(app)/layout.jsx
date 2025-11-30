"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCog } from "lucide-react";
import useAuthStore from "@/app/lib/store";
import MobileMenu from "@/components/layout/MobileMenu";
import MobileDrawer from "@/components/layout/MobileDrawer";
import BottomNav from "@/components/layout/BottomNav";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [isReady, setIsReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Verificar si el usuario es admin
  const isAdmin = user?.role === "sabio_admin";

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
      {/* Sidebar Desktop */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">SaBio CRM</h2>
        </div>
        <nav className="mt-4">
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
            Dashboard
          </div>
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
            CRM
          </div>
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
            Fincas
          </div>
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
            Admin
          </div>
          {isAdmin && (
            <Link
              href="/admin/usuarios"
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors flex items-center gap-2"
            >
              <UserCog className="h-4 w-4" />
              Usuarios
            </Link>
          )}
        </nav>
      </aside>

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
          <div
            className="px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            CRM
          </div>
          <div
            className="px-6 py-3 text-gray-700 active:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Fincas
          </div>
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
        </nav>
      </MobileDrawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Mobile: Hamburger + Logo */}
            <div className="flex items-center gap-3 md:hidden min-w-0">
              <MobileMenu
                isOpen={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
              <h1 className="text-lg font-semibold text-gray-800 truncate">Dashboard</h1>
            </div>

            {/* Desktop: Solo título */}
            <h1 className="hidden md:block text-2xl font-semibold text-gray-800">
              Dashboard
            </h1>

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
