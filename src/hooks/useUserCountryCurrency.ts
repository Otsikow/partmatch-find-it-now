import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getCountryByName, getCurrencyByCountry, getCountryConfig } from '@/lib/countryConfig';
import { useCountryDetection } from './useCountryDetection';

interface UserCountryCurrency {
  country: string | null;
  currency: string | null;
  countryCode: string | null;
  loading: boolean;
  updateCountryCurrency: (countryCode: string, currency: string) => Promise<void>;
}

export const useUserCountryCurrency = (): UserCountryCurrency => {
  const { user } = useAuth();
  const { country: detectedCountry, loading: countryLoading } = useCountryDetection();
  const [country, setCountry] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        if (!countryLoading) {
          if (detectedCountry) {
            setCountry(detectedCountry.name);
            setCurrency(detectedCountry.currency);
            setCountryCode(detectedCountry.code);
          }
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('country, currency')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        }

        if (profile && profile.country && profile.currency) {
          setCountry(profile.country);
          setCurrency(profile.currency);
          const countryConfig = getCountryByName(profile.country);
          if (countryConfig) {
            setCountryCode(countryConfig.code);
          }
        } else if (detectedCountry) {
          setCountry(detectedCountry.name);
          setCurrency(detectedCountry.currency);
          setCountryCode(detectedCountry.code);
          // Also update the user's profile in the background
          if (user) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                country: detectedCountry.name,
                currency: detectedCountry.currency,
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id);
            if (updateError) {
              console.error('Error updating profile with detected country:', updateError);
            }
          }
        }
      } catch (error) {
        console.error('Error in user profile logic:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!countryLoading) {
      fetchUserProfile();
    }
  }, [user, detectedCountry, countryLoading]);

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