
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SavedPart {
  id: string;
  part_id: string;
  created_at: string;
  notes?: string;
  list_name: string;
  car_parts: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    currency: string;
    condition: string;
    address?: string;
    city?: string;
    images?: string[];
    supplier_id: string;
    profiles?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

export const useSavedParts = () => {
  const { user } = useAuth();
  const [savedParts, setSavedParts] = useState<SavedPart[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedParts = async () => {
    if (!user) {
      console.log('useSavedParts: No user found');
      setLoading(false);
      return;
    }

    console.log('useSavedParts: Fetching for user:', user.id);

    try {
      const { data, error } = await supabase
        .from('saved_parts')
        .select(`
          id,
          part_id,
          created_at,
          notes,
          list_name,
          car_parts(
            id,
            title,
            make,
            model,
            year,
            price,
            currency,
            condition,
            address,
            city,
            images,
            supplier_id,
            profiles(
              first_name,
              last_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('useSavedParts: Query result:', data);
      setSavedParts(data || []);
    } catch (error) {
      console.error('Error fetching saved parts:', error);
      toast.error('Failed to load saved parts');
    } finally {
      setLoading(false);
    }
  };

  const savePart = async (partId: string, notes?: string, listName: string = 'default') => {
    if (!user) {
      toast.error('Please login to save parts');
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_parts')
        .insert({
          user_id: user.id,
          part_id: partId,
          notes,
          list_name: listName
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info('Part is already in your saved list');
          return false;
        }
        throw error;
      }

      toast.success('Part saved successfully!');
      fetchSavedParts();
      return true;
    } catch (error) {
      console.error('Error saving part:', error);
      toast.error('Failed to save part');
      return false;
    }
  };

  const removeSavedPart = async (partId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_parts')
        .delete()
        .eq('user_id', user.id)
        .eq('part_id', partId);

      if (error) throw error;

      toast.success('Part removed from saved list');
      fetchSavedParts();
      return true;
    } catch (error) {
      console.error('Error removing saved part:', error);
      toast.error('Failed to remove part');
      return false;
    }
  };

  const isPartSaved = (partId: string) => {
    return savedParts.some(saved => saved.part_id === partId);
  };

  useEffect(() => {
    fetchSavedParts();
  }, [user]);

  return {
    savedParts,
    loading,
    savePart,
    removeSavedPart,
    isPartSaved,
    refetch: fetchSavedParts
  };
};
