"use client";

import { Menu, X } from "lucide-react";

export default function MobileMenu({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-gray-700" />
      ) : (
        <Menu className="h-6 w-6 text-gray-700" />
      )}
    </button>
  );
}
