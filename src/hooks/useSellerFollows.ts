import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SellerFollow {
  id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  seller?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
    rating: number;
    total_ratings: number;
    is_verified: boolean;
    city?: string;
    country?: string;
  };
}

export const useSellerFollows = () => {
  const { user } = useAuth();
  const [followedSellers, setFollowedSellers] = useState<SellerFollow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowedSellers = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('seller_follows')
        .select(`
          id,
          buyer_id,
          seller_id,
          created_at
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch seller details separately
      const sellerIds = data?.map(follow => follow.seller_id) || [];
      const { data: sellersData, error: sellersError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          profile_photo_url,
          rating,
          total_ratings,
          is_verified,
          city,
          country
        `)
        .in('id', sellerIds);

      if (sellersError) throw sellersError;

      // Combine the data
      const followsWithSellers = data?.map(follow => ({
        ...follow,
        seller: sellersData?.find(seller => seller.id === follow.seller_id)
      })) || [];

      setFollowedSellers(followsWithSellers);
    } catch (error) {
      console.error('Error fetching followed sellers:', error);
      toast.error('Failed to load followed sellers');
    } finally {
      setLoading(false);
    }
  };

  const followSeller = async (sellerId: string) => {
    if (!user?.id) {
      toast.error('Please login to follow sellers');
      return false;
    }

    try {
      const { error } = await supabase
        .from('seller_follows')
        .insert({
          buyer_id: user.id,
          seller_id: sellerId
        });

      if (error) throw error;
      
      toast.success('Seller followed successfully');
      fetchFollowedSellers();
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('You are already following this seller');
      } else {
        console.error('Error following seller:', error);
        toast.error('Failed to follow seller');
      }
      return false;
    }
  };

  const unfollowSeller = async (sellerId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('seller_follows')
        .delete()
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId);

      if (error) throw error;
      
      toast.success('Seller unfollowed successfully');
      fetchFollowedSellers();
      return true;
    } catch (error) {
      console.error('Error unfollowing seller:', error);
      toast.error('Failed to unfollow seller');
      return false;
    }
  };

  const isFollowing = (sellerId: string) => {
    return followedSellers.some(follow => follow.seller_id === sellerId);
  };

  useEffect(() => {
    fetchFollowedSellers();
  }, [user?.id]);

  return {
    followedSellers,
    loading,
    followSeller,
    unfollowSeller,
    isFollowing,
    refetch: fetchFollowedSellers
  };
};