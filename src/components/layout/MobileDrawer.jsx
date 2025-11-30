"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function MobileDrawer({ isOpen, onClose, children }) {
  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay - Backdrop oscuro */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer - Panel lateral deslizable */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menú de navegación móvil"
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">SaBio CRM</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Contenido del drawer */}
        <div className="overflow-y-auto h-[calc(100%-73px)]">
          {children}
        </div>
      </aside>
    </>
  );
}
