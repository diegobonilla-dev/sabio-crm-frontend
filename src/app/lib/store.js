"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      // Actions
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      login: (token) => {
        try {
          // Decode JWT to extract user claims
          const decoded = jwtDecode(token);

          // Update state with token, user data, and authentication status
          set({
            token,
            user: {
              id: decoded.id,
              email: decoded.email,
              role: decoded.role,
            },
            isAuthenticated: true,
          });

          // IMPORTANTE: Sincronizar con cookie para que el middleware pueda leerlo
          if (typeof document !== 'undefined') {
            // Guardar token en cookie (expira en 24 horas)
            document.cookie = `sabio-auth-token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
          }
        } catch (error) {
          console.error('Error decoding JWT token:', error);
          // Reset state if token is invalid
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }
      },

      logout: () => {
        // Reset state to initial values
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });

        // IMPORTANTE: Limpiar cookie también
        if (typeof document !== 'undefined') {
          document.cookie = 'sabio-auth-token=; path=/; max-age=0';
        }
      },
    }),
    {
      name: 'sabio-auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Marcar como hidratado
        state?.setHasHydrated(true);

        // IMPORTANTE: Al hidratar desde localStorage, sincronizar cookie
        if (state?.token && typeof document !== 'undefined') {
          document.cookie = `sabio-auth-token=${state.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
        }
      },
    }
  )
);

export default useAuthStore;
