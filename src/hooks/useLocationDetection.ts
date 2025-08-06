import { useState, useEffect, useCallback } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

interface LocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

interface UseLocationDetectionOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  requestOnMount?: boolean;
  includeAddress?: boolean;
}

// Get Mapbox token from environment variables with fallback
const getMapboxToken = () => import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2x6dzZkdXZiMDEyMzJqcGEwMzQyM2xlMSJ9.UKvTlBGGqFXJ9kEF7Q6GnA';

export const useLocationDetection = (options: UseLocationDetectionOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    requestOnMount = false,
    includeAddress = true
  } = options;

  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
    permission: 'unknown'
  });

  // Reverse geocode coordinates to get address information
  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    const mapboxToken = getMapboxToken();
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=place,locality,district,region,country`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const context = feature.context || [];
        
        // Extract location components
        let city = '';
        let region = '';
        let country = '';
        
        // Try to get city from the main feature or context
        if (feature.place_type?.includes('place') || feature.place_type?.includes('locality')) {
          city = feature.text;
        }
        
        // Extract from context
        context.forEach((item: any) => {
          if (item.id?.startsWith('place.') && !city) {
            city = item.text;
          } else if (item.id?.startsWith('region.')) {
            region = item.text;
          } else if (item.id?.startsWith('country.')) {
            country = item.text;
          }
        });

        return {
          address: feature.place_name,
          city,
          region,
          country
        };
      }
      
      return {};
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {};
    }
  };

  // Check geolocation permission status
  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      return 'unknown';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      console.warn('Permission check failed:', error);
      return 'unknown';
    }
  }, []);

  // Request user's current location
  const requestLocation = useCallback(async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const permission = await checkPermission();
      setState(prev => ({ ...prev, permission }));

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            let locationData: LocationData = { latitude, longitude };

            // Optionally get address information
            if (includeAddress) {
              const addressData = await reverseGeocode(latitude, longitude);
              locationData = { ...locationData, ...addressData };
            }

            setState(prev => ({
              ...prev,
              location: locationData,
              loading: false,
              error: null
            }));

            resolve(locationData);
          },
          (error) => {
            let errorMessage = 'Failed to get location';
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user. You can enter your location manually.';
                setState(prev => ({ 
                  ...prev, 
                  permission: 'denied',
                  error: errorMessage,
                  loading: false
                }));
                console.warn('Location access denied', error);
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out';
                break;
              default:
                errorMessage = 'An unknown error occurred';
                break;
            }

            setState(prev => ({
              ...prev,
              loading: false,
              error: errorMessage
            }));

            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy,
            timeout,
            maximumAge
          }
        );
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [enableHighAccuracy, timeout, maximumAge, includeAddress, checkPermission]);

  // Clear location data
  const clearLocation = useCallback(() => {
    setState(prev => ({
      ...prev,
      location: null,
      error: null
    }));
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission().then(permission => {
      setState(prev => ({ ...prev, permission }));
    });
  }, [checkPermission]);

  // Automatically request location on mount if requested
  useEffect(() => {
    if (requestOnMount) {
      requestLocation().catch(() => {
        // Error already handled in requestLocation
      });
    }
  }, [requestOnMount, requestLocation]);

  return {
    ...state,
    requestLocation,
    clearLocation,
    isSupported: !!navigator.geolocation
  };
};