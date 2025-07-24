
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeBuyerStats {
  averageRating: number;
  totalRatings: number;
}

interface CategoryStats {
  engineParts: number;
  brakeParts: number;
  suspensionParts: number;
  bodyParts: number;
  accessories: number;
}

interface RealTimeStats {
  activeParts: number;
  activeRequests: number;
  partsMatched: number;
  sellers: number;
  totalUsers: number;
  countries: number;
  categories: CategoryStats;
  buyers: RealTimeBuyerStats;
  loading: boolean;
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    activeParts: 0,
    activeRequests: 0,
    partsMatched: 0,
    sellers: 0,
    totalUsers: 0,
    countries: 0,
    categories: {
      engineParts: 0,
      brakeParts: 0,
      suspensionParts: 0,
      bodyParts: 0,
      accessories: 0
    },
    buyers: {
      averageRating: 0,
      totalRatings: 0
    },
    loading: true
  });

  const fetchStats = async () => {
    try {
      // Get active parts count
      const { count: partsCount } = await supabase
        .from('car_parts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Get active requests count (pending status)
      const { count: activeRequestsCount } = await supabase
        .from('part_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get parts matched count (offers with accepted status)
      const { count: partsMatchedCount } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted');

      // Get sellers count (users with type supplier)
      const { count: sellersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'supplier');

      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get unique countries count from profiles
      const { data: countriesData } = await supabase
        .from('profiles')
        .select('country')
        .not('country', 'is', null);

      const uniqueCountries = new Set(countriesData?.map(item => item.country).filter(Boolean));
      const countriesCount = uniqueCountries.size;

      // Get category counts
      const [engineResult, brakeResult, suspensionResult, bodyResult, accessoriesResult] = await Promise.all([
        supabase.from('car_parts').select('*', { count: 'exact', head: true }).ilike('part_type', '%engine%').eq('status', 'available'),
        supabase.from('car_parts').select('*', { count: 'exact', head: true }).ilike('part_type', '%brake%').eq('status', 'available'),
        supabase.from('car_parts').select('*', { count: 'exact', head: true }).ilike('part_type', '%suspension%').eq('status', 'available'),
        supabase.from('car_parts').select('*', { count: 'exact', head: true }).ilike('part_type', '%body%').eq('status', 'available'),
        supabase.from('car_parts').select('*', { count: 'exact', head: true }).eq('part_type', 'Car Accessories').eq('status', 'available')
      ]);

      // Get buyer rating stats
      const { data: ratingsData } = await supabase
        .from('reviews')
        .select('rating');

      const averageRating = ratingsData && ratingsData.length > 0 
        ? ratingsData.reduce((sum, review) => sum + review.rating, 0) / ratingsData.length 
        : 4.8;

      setStats({
        activeParts: partsCount || 0,
        activeRequests: activeRequestsCount || 0,
        partsMatched: partsMatchedCount || 0,
        sellers: sellersCount || 0,
        totalUsers: usersCount || 0,
        countries: countriesCount || 0,
        categories: {
          engineParts: engineResult.count || 0,
          brakeParts: brakeResult.count || 0,
          suspensionParts: suspensionResult.count || 0,
          bodyParts: bodyResult.count || 0,
          accessories: accessoriesResult.count || 0
        },
        buyers: {
          averageRating: Number(averageRating.toFixed(1)),
          totalRatings: ratingsData?.length || 0
        },
        loading: false
      });
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscriptions
    const partsChannel = supabase
      .channel('parts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'car_parts'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const requestsChannel = supabase
      .channel('requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'part_requests'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const offersChannel = supabase
      .channel('offers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const reviewsChannel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(partsChannel);
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(offersChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, []);

  return stats;
};
