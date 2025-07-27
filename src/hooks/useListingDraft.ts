import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const useListingDraft = <T,>(formId: string, initialData: T) => {
  const { user } = useAuth();
  const draftKey = `listing-draft-${formId}-${user?.id || 'guest'}`;
  const guestDraftKey = `listing-draft-${formId}-guest`;

  const [formData, setFormData] = useState<T>(initialData);
  const [draftExists, setDraftExists] = useState(false);

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for guest draft first (priority for login flow)
    const guestDraft = localStorage.getItem(guestDraftKey);
    const userDraft = localStorage.getItem(draftKey);
    
    if (user && guestDraft) {
      // User just logged in, migrate guest draft
      const parsedGuestDraft = JSON.parse(guestDraft);
      setFormData(parsedGuestDraft);
      localStorage.removeItem(guestDraftKey);
      localStorage.setItem(draftKey, guestDraft);
      setDraftExists(true);
    } else if (userDraft) {
      // Load existing user draft
      const parsedUserDraft = JSON.parse(userDraft);
      setFormData(parsedUserDraft);
      setDraftExists(true);
    } else if (guestDraft) {
      // Load existing guest draft
      const parsedGuestDraft = JSON.parse(guestDraft);
      setFormData(parsedGuestDraft);
      setDraftExists(true);
    }
  }, [draftKey, guestDraftKey, user]);

  const loadDraft = () => {
    // Try guest draft first (for login flow), then user draft
    const guestDraft = localStorage.getItem(guestDraftKey);
    const userDraft = localStorage.getItem(draftKey);
    
    if (user && guestDraft) {
      const parsedGuestDraft = JSON.parse(guestDraft);
      setFormData(parsedGuestDraft);
      localStorage.removeItem(guestDraftKey);
      localStorage.setItem(draftKey, JSON.stringify(parsedGuestDraft));
    } else if (userDraft) {
      setFormData(JSON.parse(userDraft));
    } else if (guestDraft) {
      setFormData(JSON.parse(guestDraft));
    }
  };

  const saveDraft = useCallback(
    (data: T) => {
      // Save immediately instead of with delay
      localStorage.setItem(draftKey, JSON.stringify(data));
    },
    [draftKey]
  );

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
    localStorage.removeItem(guestDraftKey);
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
  }, [draftKey, guestDraftKey]);

  useEffect(() => {
    saveDraft(formData);
  }, [formData, saveDraft]);

  return { formData, setFormData, draftExists, loadDraft, clearDraft };
};

export default useListingDraft;
