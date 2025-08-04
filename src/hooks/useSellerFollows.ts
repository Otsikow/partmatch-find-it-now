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
    if (!user?.id) {
      console.log('useSellerFollows: No user ID available');
      setLoading(false);
      return;
    }

    try {
      console.log('useSellerFollows: Fetching followed sellers for user:', user.id);
      
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

      if (error) {
        console.error('useSellerFollows: Error fetching follows:', error);
        throw error;
      }

      console.log('useSellerFollows: Follows data:', data);

      // If no follows, set empty array and return
      if (!data || data.length === 0) {
        console.log('useSellerFollows: No follows found');
        setFollowedSellers([]);
        setLoading(false);
        return;
      }

      // Fetch seller details separately
      const sellerIds = data.map(follow => follow.seller_id);
      console.log('useSellerFollows: Fetching seller details for IDs:', sellerIds);
      
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

      if (sellersError) {
        console.error('useSellerFollows: Error fetching sellers:', sellersError);
        throw sellersError;
      }

      console.log('useSellerFollows: Sellers data:', sellersData);

      // Combine the data
      const followsWithSellers = data.map(follow => ({
        ...follow,
        seller: sellersData?.find(seller => seller.id === follow.seller_id)
      }));

      console.log('useSellerFollows: Combined data:', followsWithSellers);
      setFollowedSellers(followsWithSellers);
    } catch (error) {
      console.error('useSellerFollows: Error in fetchFollowedSellers:', error);
      toast.error('Failed to load followed sellers');
      setFollowedSellers([]); // Set empty array on error
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