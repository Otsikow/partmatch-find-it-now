import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BusinessSubscription {
  id: string;
  user_id: string;
  active: boolean;
  start_date: string;
  end_date: string | null;
  auto_renew: boolean;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
}

export const useBusinessSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<BusinessSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchSubscription = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isBusinessUser = subscription && subscription.active && 
    (!subscription.end_date || new Date(subscription.end_date) > new Date());

  return {
    subscription,
    loading,
    error,
    isBusinessUser: !!isBusinessUser,
    refetch: fetchSubscription
  };
};