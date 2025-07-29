import { useEffect, useState } from 'react';
import { useFeaturedParts } from './useFeaturedParts';
import { useCountryDetection } from './useCountryDetection';
import { useUserCountryCurrency } from './useUserCountryCurrency';
import { CarPart } from '@/types/CarPart';

export const useLocationFeaturedParts = () => {
  const { country: detectedCountry, loading: countryLoading } = useCountryDetection();
  const { countryCode: userCountryCode, loading: userLoading } = useUserCountryCurrency();
  const [currentCountryCode, setCurrentCountryCode] = useState<string | undefined>(undefined);

  // Determine the country code to use (user profile first, then detected)
  useEffect(() => {
    if (!userLoading && userCountryCode) {
      setCurrentCountryCode(userCountryCode);
    } else if (!countryLoading && detectedCountry) {
      setCurrentCountryCode(detectedCountry.code);
    } else if (!countryLoading && !detectedCountry) {
      // Fallback to a default country or show all
      setCurrentCountryCode(undefined);
    }
  }, [userCountryCode, userLoading, detectedCountry, countryLoading]);

  const { featuredParts, loading: partsLoading, error, refetch } = useFeaturedParts(currentCountryCode);

  return {
    featuredParts,
    loading: countryLoading || userLoading || partsLoading,
    error,
    refetch,
    currentCountryCode,
    detectedCountry,
    userCountryCode
  };
};