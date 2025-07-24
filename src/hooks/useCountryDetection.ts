import { useState, useEffect } from 'react';
import { getSupportedCountries, getCountryByName } from '@/lib/countryConfig';

export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

export const SUPPORTED_COUNTRIES = getSupportedCountries().map(config => ({
  code: config.code,
  name: config.name,
  currency: config.currency,
  flag: config.flag
}));

interface CountryDetectionState {
  country: Country | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

export const useCountryDetection = () => {
  const [state, setState] = useState<CountryDetectionState>({
    country: null,
    loading: false,
    error: null,
    hasPermission: null
  });

  const getCountryFromCoordinates = async (lat: number, lon: number): Promise<Country | null> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      
      const countryCode = data.countryCode;
      const foundCountry = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
      
      return foundCountry || null;
    } catch (error) {
      console.error('Error getting country from coordinates:', error);
      return null;
    }
  };

  const detectCountry = async (): Promise<Country | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // First check if we have a stored country
    const storedCountryCode = localStorage.getItem('selectedCountry');
    if (storedCountryCode) {
      const storedCountry = SUPPORTED_COUNTRIES.find(c => c.code === storedCountryCode);
      if (storedCountry) {
        setState(prev => ({
          ...prev,
          country: storedCountry,
          loading: false,
          hasPermission: true
        }));
        return storedCountry;
      }
    }

    // Try to detect using geolocation
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser',
        hasPermission: false
      }));
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const detectedCountry = await getCountryFromCoordinates(latitude, longitude);
          
          setState(prev => ({
            ...prev,
            country: detectedCountry,
            loading: false,
            hasPermission: true
          }));
          
          if (detectedCountry) {
            localStorage.setItem('selectedCountry', detectedCountry.code);
          }
          
          resolve(detectedCountry);
        },
        (error) => {
          let errorMessage = 'Unable to detect location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              setState(prev => ({ ...prev, hasPermission: false }));
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
            hasPermission: error.code === error.PERMISSION_DENIED ? false : null
          }));
          
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const setCountry = (country: Country) => {
    setState(prev => ({ ...prev, country }));
    localStorage.setItem('selectedCountry', country.code);
  };

  const clearCountry = () => {
    setState(prev => ({ ...prev, country: null }));
    localStorage.removeItem('selectedCountry');
  };

  // Auto-detect on mount if no country is stored
  useEffect(() => {
    const storedCountryCode = localStorage.getItem('selectedCountry');
    if (!storedCountryCode) {
      detectCountry();
    } else {
      const storedCountry = SUPPORTED_COUNTRIES.find(c => c.code === storedCountryCode);
      if (storedCountry) {
        setState(prev => ({ ...prev, country: storedCountry }));
      }
    }
  }, []);

  return {
    ...state,
    detectCountry,
    setCountry,
    clearCountry,
    supportedCountries: SUPPORTED_COUNTRIES
  };
};