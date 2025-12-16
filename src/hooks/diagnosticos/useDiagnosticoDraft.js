import { useCallback } from "react";
import useAuthStore from "@/app/lib/store";

export function useDiagnosticoDraft(fincaId) {
  const user = useAuthStore((state) => state.user);

  const getDraftKey = useCallback(() => {
    return `diagnostico_draft_${fincaId}_${user?.id}`;
  }, [fincaId, user]);

  const saveDraft = useCallback((draftData) => {
    try {
      const key = getDraftKey();
      const draft = {
        ...draftData,
        lastSaved: new Date().toISOString(),
        fincaId,
        userId: user?.id
      };
      localStorage.setItem(key, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [getDraftKey, fincaId, user]);

  const loadDraft = useCallback(() => {
    try {
      const key = getDraftKey();
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, [getDraftKey]);

  const clearDraft = useCallback(() => {
    try {
      const key = getDraftKey();
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [getDraftKey]);

  return {
    saveDraft,
    loadDraft,
    clearDraft
  };
}
