import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useMyPartsCount = () => {
  const { user } = useAuth();
  const [partsCount, setPartsCount] = useState(0);

  const fetchPartsCount = async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('car_parts')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', user.id)
        .in('status', ['available', 'pending']);

      if (error) throw error;
      setPartsCount(count || 0);
    } catch (error) {
      console.error('Error fetching parts count:', error);
    }
  };

  useEffect(() => {
    fetchPartsCount();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('parts-count-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'car_parts',
          filter: `supplier_id=eq.${user.id}`
        },
        () => {
          fetchPartsCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return partsCount;
};
