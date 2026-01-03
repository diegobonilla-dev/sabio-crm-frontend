/**
 * Store Zustand para gestionar borradores (drafts) de diagnósticos
 *
 * Este store utiliza el middleware de persistencia de Zustand para
 * guardar automáticamente en localStorage los datos del wizard de diagnósticos
 * mientras el usuario navega entre los diferentes pasos.
 *
 * Características:
 * - Persistencia automática en localStorage
 * - Soporte para múltiples drafts simultáneos (por finca + usuario)
 * - Cálculo de completitud de formulario
 * - Limpieza automática de drafts antiguos
 * - Hidratación automática al cargar la app
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  saveImagesToIndexedDB,
  loadImagesFromIndexedDB,
  deleteImagesFromIndexedDB,
  collectAllImages,
  restoreImagesInFormData
} from '@/utils/indexedDB';

/**
 * Calcula el porcentaje de completitud de un objeto de datos
 * Revisa recursivamente si los campos tienen valores no vacíos
 */
const calculateCompleteness = (data, maxDepth = 3, currentDepth = 0) => {
  if (!data || typeof data !== 'object' || currentDepth > maxDepth) {
    return { filled: 0, total: 0 };
  }

  let filled = 0;
  let total = 0;

  Object.entries(data).forEach(([key, value]) => {
    // Ignorar campos de metadata
    if (key === '_metadata' || key === 'lastSaved') return;

    if (Array.isArray(value)) {
      // Para arrays, contar si tienen al menos un elemento
      total++;
      if (value.length > 0) filled++;
    } else if (value !== null && typeof value === 'object') {
      // Para objetos anidados, calcular recursivamente
      const nested = calculateCompleteness(value, maxDepth, currentDepth + 1);
      filled += nested.filled;
      total += nested.total;
    } else {
      // Para valores primitivos
      total++;
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== false // no contar false como vacío para booleanos
      ) {
        filled++;
      }
    }
  });

  return { filled, total };
};

/**
 * Genera el ID único del draft basado en fincaId y userId
 */
const generateDraftId = (fincaId, userId) => {
  return `${fincaId}_${userId}`;
};

/**
 * Remueve recursivamente todos los File objects de un objeto
 * Los reemplaza por null para mantener la estructura
 */
const removeFilesFromObject = (obj) => {
  if (obj instanceof File) {
    return null; // Reemplazar File por null
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeFilesFromObject(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const result = {};
    Object.keys(obj).forEach(key => {
      result[key] = removeFilesFromObject(obj[key]);
    });
    return result;
  }

  return obj;
};

/**
 * Store principal de drafts de diagnósticos
 */
export const useDiagnosticoDraftStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // ESTADO
      // ============================================

      /**
       * Objeto con todos los drafts guardados
       * Estructura: { [draftId]: { ...draftData } }
       */
      drafts: {},

      /**
       * ID del draft actualmente activo
       */
      activeDraftId: null,

      /**
       * Flag para saber si el store ya se hidrato desde localStorage
       */
      _hasHydrated: false,

      // ============================================
      // ACCIONES
      // ============================================

      /**
       * Marca el store como hidratado
       */
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      /**
       * Carga un draft existente o retorna null si no existe
       * @param {string} fincaId - ID de la finca
       * @param {string} userId - ID del usuario
       * @returns {object|null} - Draft data o null
       */
      loadDraft: async (fincaId, userId) => {
        const draftId = generateDraftId(fincaId, userId);
        const { drafts } = get();

        const draft = drafts[draftId];

        if (draft) {
          // 1. CARGAR IMÁGENES DESDE INDEXEDDB
          let formData = draft.formData;

          if (draft.hasImages) {
            try {
              const images = await loadImagesFromIndexedDB(draftId);
              if (images) {
                formData = restoreImagesInFormData(draft.formData, images);
                console.log(`📂 ${Object.keys(images).length} imágenes restauradas desde IndexedDB`);
              }
            } catch (error) {
              console.error('Error cargando imágenes desde IndexedDB:', error);
            }
          }

          // 2. ACTUALIZAR DRAFT ACTIVO
          set({ activeDraftId: draftId });

          return {
            ...draft,
            formData // Con imágenes restauradas
          };
        }

        return null;
      },

      /**
       * Guarda o actualiza un draft
       * @param {string} fincaId - ID de la finca
       * @param {string} userId - ID del usuario
       * @param {object} draftData - Datos del draft a guardar
       * @param {object} draftData.formData - Datos del formulario
       * @param {number} draftData.currentStep - Paso actual del wizard
       * @param {string} draftData.tipoDiagnostico - Tipo de diagnóstico
       */
      saveDraft: async (fincaId, userId, draftData) => {
        const draftId = generateDraftId(fincaId, userId);
        const { formData, currentStep, tipoDiagnostico } = draftData;

        // 1. SEPARAR IMÁGENES DEL RESTO DE DATOS
        const allImages = collectAllImages(formData);
        const formDataWithoutFiles = removeFilesFromObject(formData);

        // 2. GUARDAR IMÁGENES EN INDEXEDDB
        if (Object.keys(allImages).length > 0) {
          try {
            await saveImagesToIndexedDB(draftId, allImages);
            console.log(`💾 ${Object.keys(allImages).length} imágenes guardadas en IndexedDB`);
          } catch (error) {
            console.error('Error guardando imágenes en IndexedDB:', error);
          }
        }

        // 3. CALCULAR COMPLETITUD (sin contar Files)
        const { filled, total } = calculateCompleteness(formDataWithoutFiles);
        const completenessPercent = total > 0 ? Math.round((filled / total) * 100) : 0;

        // 4. GUARDAR EN LOCALSTORAGE (sin Files)
        const draft = {
          fincaId,
          userId,
          tipoDiagnostico,
          currentStep,
          formData: formDataWithoutFiles, // SIN FILES
          hasImages: Object.keys(allImages).length > 0,
          imageCount: Object.keys(allImages).length,
          lastSaved: new Date().toISOString(),
          completeness: completenessPercent,
          _metadata: {
            createdAt: get().drafts[draftId]?._metadata?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
          }
        };

        // Actualizar el store
        set((state) => ({
          drafts: {
            ...state.drafts,
            [draftId]: draft
          },
          activeDraftId: draftId
        }));

        return draft;
      },

      /**
       * Elimina un draft específico
       * @param {string} fincaId - ID de la finca
       * @param {string} userId - ID del usuario
       */
      deleteDraft: async (fincaId, userId) => {
        const draftId = generateDraftId(fincaId, userId);

        // 1. ELIMINAR IMÁGENES DE INDEXEDDB
        try {
          await deleteImagesFromIndexedDB(draftId);
          console.log('🗑️ Imágenes eliminadas de IndexedDB');
        } catch (error) {
          console.error('Error eliminando imágenes de IndexedDB:', error);
        }

        // 2. ELIMINAR DRAFT DE LOCALSTORAGE
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[draftId];

          return {
            drafts: newDrafts,
            activeDraftId: state.activeDraftId === draftId ? null : state.activeDraftId
          };
        });
      },

      /**
       * Elimina todos los drafts
       */
      clearAllDrafts: () => {
        set({ drafts: {}, activeDraftId: null });
      },

      /**
       * Limpia drafts antiguos (más de 30 días)
       */
      clearExpiredDrafts: () => {
        const now = new Date();
        const EXPIRY_DAYS = 30;

        set((state) => {
          const newDrafts = {};

          Object.entries(state.drafts).forEach(([draftId, draft]) => {
            const lastSaved = new Date(draft.lastSaved);
            const daysDiff = (now - lastSaved) / (1000 * 60 * 60 * 24);

            // Mantener solo drafts con menos de 30 días
            if (daysDiff < EXPIRY_DAYS) {
              newDrafts[draftId] = draft;
            }
          });

          return { drafts: newDrafts };
        });
      },

      /**
       * Obtiene el draft activo actualmente
       * @returns {object|null}
       */
      getActiveDraft: () => {
        const { activeDraftId, drafts } = get();
        return activeDraftId ? drafts[activeDraftId] : null;
      },

      /**
       * Obtiene la completitud del draft activo
       * @returns {number} - Porcentaje de 0-100
       */
      getActiveDraftCompleteness: () => {
        const draft = get().getActiveDraft();
        return draft?.completeness || 0;
      },

      /**
       * Lista todos los drafts guardados
       * @returns {array} - Array de drafts con sus IDs
       */
      listAllDrafts: () => {
        const { drafts } = get();
        return Object.entries(drafts).map(([id, draft]) => ({
          id,
          ...draft
        }));
      },

      /**
       * Actualiza solo el currentStep del draft activo
       * @param {number} step - Nuevo paso
       */
      updateCurrentStep: (step) => {
        const { activeDraftId } = get();
        if (!activeDraftId) return;

        set((state) => ({
          drafts: {
            ...state.drafts,
            [activeDraftId]: {
              ...state.drafts[activeDraftId],
              currentStep: step,
              lastSaved: new Date().toISOString(),
              _metadata: {
                ...state.drafts[activeDraftId]._metadata,
                updatedAt: new Date().toISOString(),
              }
            }
          }
        }));
      },

      /**
       * Merge parcial de formData sin sobrescribir todo
       * Útil para actualizar solo una sección del formulario
       * @param {object} partialFormData - Datos parciales a mergear
       */
      mergeFormData: (partialFormData) => {
        const { activeDraftId } = get();
        if (!activeDraftId) return;

        set((state) => {
          const currentDraft = state.drafts[activeDraftId];
          const mergedFormData = {
            ...currentDraft.formData,
            ...partialFormData
          };

          // Recalcular completitud
          const { filled, total } = calculateCompleteness(mergedFormData);
          const completenessPercent = total > 0 ? Math.round((filled / total) * 100) : 0;

          return {
            drafts: {
              ...state.drafts,
              [activeDraftId]: {
                ...currentDraft,
                formData: mergedFormData,
                completeness: completenessPercent,
                lastSaved: new Date().toISOString(),
                _metadata: {
                  ...currentDraft._metadata,
                  updatedAt: new Date().toISOString(),
                }
              }
            }
          };
        });
      },
    }),

    // ============================================
    // CONFIGURACIÓN DEL MIDDLEWARE DE PERSISTENCIA
    // ============================================
    {
      name: 'sabio-diagnostico-drafts', // Nombre en localStorage
      storage: createJSONStorage(() => localStorage),

      // Solo persistir drafts y activeDraftId (no _hasHydrated)
      partialize: (state) => ({
        drafts: state.drafts,
        activeDraftId: state.activeDraftId,
      }),

      // Callback después de hidratar desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);

          // Limpiar drafts antiguos al iniciar
          state.clearExpiredDrafts();
        }
      },

      // Versión del esquema (para futuras migraciones)
      version: 1,
    }
  )
);
