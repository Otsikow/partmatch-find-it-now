import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MonetizationPricing {
  id: string;
  feature_type: string;
  amount: number;
  currency: string;
  duration_days: number | null;
  description: string;
  active: boolean;
}

export const useMonetizationPricing = () => {
  const [pricing, setPricing] = useState<MonetizationPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('monetization_pricing')
        .select('*')
        .eq('active', true)
        .order('feature_type');

      if (error) throw error;
      setPricing(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPricingByType = (featureType: string) => {
    return pricing.find(p => p.feature_type === featureType);
  };

  return {
    pricing,
    loading,
    error,
    getPricingByType,
    refetch: fetchPricing
  };
};