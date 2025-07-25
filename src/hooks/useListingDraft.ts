import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const useListingDraft = <T,>(formId: string, initialData: T) => {
  const { user } = useAuth();
  const draftKey = `listing-draft-${formId}-${user?.id || 'guest'}`;

  const [formData, setFormData] = useState<T>(initialData);
  const [draftExists, setDraftExists] = useState(false);

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setDraftExists(true);
    }
  }, [draftKey]);

  const loadDraft = () => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  };

  const saveDraft = useCallback(
    (data: T) => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(data));
      }, 5000);
    },
    [draftKey]
  );

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
  }, [draftKey]);

  useEffect(() => {
    saveDraft(formData);
  }, [formData, saveDraft]);

  return { formData, setFormData, draftExists, loadDraft, clearDraft };
};

export default useListingDraft;
