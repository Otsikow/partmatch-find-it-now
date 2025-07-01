
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
        .not('completed_at', 'is', null) // Only completed transactions
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching completed transactions:', error);
        return;
      }

      // Filter out transactions that have already been rated
      const unratedTransactions = [];
      if (data) {
        for (const transaction of data) {
          const { data: existingReview } = await supabase
            .from('reviews')
            .select('id')
            .eq('offer_id', transaction.id)
            .eq('reviewer_id', user.id)
            .maybeSingle();

          if (!existingReview) {
            const sellerName = transaction.profiles 
              ? `${transaction.profiles.first_name || ''} ${transaction.profiles.last_name || ''}`.trim() || 'Seller'
              : 'Seller';

            unratedTransactions.push({
              offer_id: transaction.id,
              seller_id: transaction.supplier_id,
              seller_name: sellerName,
              completed_at: transaction.completed_at
            });
          }
        }
      }

      setPendingRatings(unratedTransactions);
    } catch (error) {
      console.error('Error fetching completed transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRated = (offerId: string) => {
    setPendingRatings(prev => prev.filter(rating => rating.offer_id !== offerId));
  };

  useEffect(() => {
    fetchPendingRatings();
  }, [user]);

  return {
    pendingRatings,
    loading,
    refetch: fetchPendingRatings,
    markAsRated
  };
};
