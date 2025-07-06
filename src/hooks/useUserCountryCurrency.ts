import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getCountryByName, getCurrencyByCountry } from '@/lib/countryConfig';

interface UserCountryCurrency {
  country: string | null;
  currency: string | null;
  countryCode: string | null;
  loading: boolean;
  updateCountryCurrency: (countryCode: string, currency: string) => Promise<void>;
}

export const useUserCountryCurrency = (): UserCountryCurrency => {
  const { user } = useAuth();
  const [country, setCountry] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('country, currency')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (profile) {
          setCountry(profile.country);
          setCurrency(profile.currency || 'GHS'); // Default to GHS if no currency set
          
          // Try to get country code from country name
          if (profile.country) {
            const countryConfig = getCountryByName(profile.country);
            if (countryConfig) {
              setCountryCode(countryConfig.code);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateCountryCurrency = async (newCountryCode: string, newCurrency: string) => {
    if (!user) return;

    try {
      const countryConfig = getCountryByName(newCountryCode) || 
                          Object.values(await import('@/lib/countryConfig').then(m => m.COUNTRY_CONFIGS))
                          .find(c => c.code === newCountryCode);

      if (!countryConfig) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          country: countryConfig.name,
          currency: newCurrency,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setCountry(countryConfig.name);
      setCurrency(newCurrency);
      setCountryCode(newCountryCode);
    } catch (error) {
      console.error('Error updating country/currency:', error);
      throw error;
    }
  };

  return {
    country,
    currency,
    countryCode,
    loading,
    updateCountryCurrency
  };
};