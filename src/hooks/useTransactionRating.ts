
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactionRating = () => {
  const { user } = useAuth();
  const [pendingRatings, setPendingRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingRatings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching pending ratings for user:', user.id);

      // Fix the query - use IS NULL instead of IS FALSE for timestamp field
      const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          supplier_id,
          completed_at,
          profiles!supplier_id(first_name, last_name)
        `)
        .eq('buyer_id', user.id)
        .eq('transaction_completed', true)
        .is('completed_at', null) // Use IS NULL instead of IS FALSE
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching completed transactions:', error);
        return;
      }

      setPendingRatings(data || []);
    } catch (error) {
      console.error('Error fetching completed transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRatings();
  }, [user]);

  return {
    pendingRatings,
    loading,
    refetch: fetchPendingRatings
  };
};
