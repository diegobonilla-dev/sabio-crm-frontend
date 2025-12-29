'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';

/**
 * Hook para manejar el estado colapsado/expandido del sidebar
 * con persistencia en localStorage
 *
 * @returns {Object} Estado y funciones del sidebar
 * @returns {boolean} isCollapsed - Si el sidebar está colapsado
 * @returns {Function} toggle - Función para alternar el estado
 * @returns {boolean} isHydrated - Si el estado se ha cargado desde localStorage
 */
export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar estado desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
    setIsHydrated(true);
  }, []);

  // Función para alternar y persistir el estado
  const toggle = () => {
    setIsCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(newValue));
      return newValue;
    });
  };

  return { isCollapsed, toggle, isHydrated };
}
