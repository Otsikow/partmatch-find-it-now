
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CompletedTransaction {
  offer_id: string;
  seller_id: string;
  seller_name: string;
  has_rated: boolean;
  completed_at: string;
}

export const useTransactionRating = () => {
  const { user } = useAuth();
  const [pendingRatings, setPendingRatings] = useState<CompletedTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingRatings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Fetching pending ratings for user:', user.id);

      // Get completed transactions where the user is the buyer and hasn't rated yet
      const { data: completedOffers, error } = await supabase
        .from('offers')
        .select(`
          id,
          supplier_id,
          completed_at,
          profiles!supplier_id(first_name, last_name)
        `)
        .eq('buyer_id', user.id)
        .eq('transaction_completed', true)
        .is('completed_at', false) // Only get offers that haven't been rated yet
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching completed transactions:', error);
        return;
      }

      console.log('Found completed offers:', completedOffers?.length || 0);

      if (!completedOffers || completedOffers.length === 0) {
        setPendingRatings([]);
        return;
      }

      // Check which ones haven't been rated yet
      const pendingRatingPromises = completedOffers.map(async (offer) => {
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('offer_id', offer.id)
          .eq('reviewer_id', user.id)
          .maybeSingle();

        const sellerName = offer.profiles 
          ? `${offer.profiles.first_name || ''} ${offer.profiles.last_name || ''}`.trim()
          : 'Unknown Seller';

        return {
          offer_id: offer.id,
          seller_id: offer.supplier_id,
          seller_name: sellerName,
          has_rated: !!existingReview,
          completed_at: offer.completed_at
        };
      });

      const transactionsWithRatingStatus = await Promise.all(pendingRatingPromises);
      const unratedTransactions = transactionsWithRatingStatus.filter(t => !t.has_rated);

      console.log('Pending ratings found:', unratedTransactions.length);
      setPendingRatings(unratedTransactions);
    } catch (error) {
      console.error('Error fetching pending ratings:', error);
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
    fetchPendingRatings,
    markAsRated
  };
};
