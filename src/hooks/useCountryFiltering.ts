// **Step 8: Country-based Data Filtering Hook**

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCountryDetection } from './useCountryDetection';

interface UseCountryFilteringOptions {
  defaultToUserCountry?: boolean;
  allowAllCountries?: boolean;
}

export const useCountryFiltering = (options: UseCountryFilteringOptions = {}) => {
  const { defaultToUserCountry = true, allowAllCountries = true } = options;
  const { country: userCountry } = useCountryDetection();
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Set default country filter based on user's country
  useEffect(() => {
    if (defaultToUserCountry && userCountry && selectedCountry === 'all') {
      setSelectedCountry(userCountry.code);
    }
  }, [userCountry, defaultToUserCountry, selectedCountry]);

  return {
    selectedCountry,
    setSelectedCountry,
    userCountry,
  };
};