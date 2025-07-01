import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionStatus {
  hasBusinessSubscription: boolean;
  subscriptionType: string | null;
  subscriptionExpiry: string | null;
  loading: boolean;
}

export const useSubscriptionStatus = (): SubscriptionStatus => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    hasBusinessSubscription: false,
    subscriptionType: null,
    subscriptionExpiry: null,
    loading: true,
  });

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) {
        setSubscriptionStatus({
          hasBusinessSubscription: false,
          subscriptionType: null,
          subscriptionExpiry: null,
          loading: false,
        });
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('subscription_type, subscription_expiry')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription status:', error);
          setSubscriptionStatus(prev => ({ ...prev, loading: false }));
          return;
        }

        const hasBusinessSubscription = data?.subscription_type === 'business' && 
          data?.subscription_expiry && 
          new Date(data.subscription_expiry) > new Date();

        setSubscriptionStatus({
          hasBusinessSubscription: hasBusinessSubscription || false,
          subscriptionType: data?.subscription_type || null,
          subscriptionExpiry: data?.subscription_expiry || null,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setSubscriptionStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  return subscriptionStatus;
};
