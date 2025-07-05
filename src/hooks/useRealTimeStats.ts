import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeStats {
  activeParts: number;
  sellers: number;
  totalUsers: number;
  regions: number;
  loading: boolean;
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    activeParts: 0,
    sellers: 0,
    totalUsers: 0,
    regions: 16, // Static for now as regions don't change often
    loading: true
  });

  const fetchStats = async () => {
    try {
      // Get active parts count
      const { count: partsCount } = await supabase
        .from('car_parts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Get sellers count (users with type supplier)
      const { count: sellersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'supplier');

      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        activeParts: partsCount || 0,
        sellers: sellersCount || 0,
        totalUsers: usersCount || 0,
        regions: 16,
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

    return () => {
      supabase.removeChannel(partsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  return stats;
};