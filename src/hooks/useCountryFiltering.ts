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

  // Build Supabase query with country filter
  const buildCountryQuery = (baseQuery: any) => {
    if (selectedCountry === 'all' && allowAllCountries) {
      return baseQuery;
    }
    return baseQuery.eq('country', selectedCountry);
  };

  // Filter car parts by country
  const getFilteredCarParts = async (additionalFilters?: any) => {
    let query = supabase
      .from('car_parts')
      .select(`
        *,
        profiles!car_parts_supplier_id_fkey (
          first_name,
          last_name,
          is_verified,
          rating,
          total_ratings,
          profile_photo_url
        )
      `)
      .eq('status', 'available');

    // Apply country filter
    if (selectedCountry !== 'all') {
      query = query.eq('country', selectedCountry);
    }

    // Apply additional filters if provided
    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        if (value && value !== '') {
          query = query.eq(key, value as any);
        }
      });
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  };

  // Filter part requests by country
  const getFilteredPartRequests = async (additionalFilters?: any) => {
    let query = supabase
      .from('part_requests')
      .select(`
        *,
        profiles!part_requests_owner_id_fkey (
          first_name,
          last_name,
          phone
        )
      `);

    // Apply country filter
    if (selectedCountry !== 'all') {
      query = query.eq('country', selectedCountry);
    }

    // Apply additional filters if provided
    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        if (value && value !== '') {
          query = query.eq(key, value as any);
        }
      });
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  };

  // Filter users by country (admin use)
  const getFilteredUsers = async (userType?: 'owner' | 'supplier' | 'admin' | 'all') => {
    let query = supabase
      .from('profiles')
      .select('*');

    // Apply country filter
    if (selectedCountry !== 'all') {
      query = query.eq('country', selectedCountry);
    }

    // Apply user type filter if provided
    if (userType && userType !== 'all') {
      query = query.eq('user_type', userType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  };

  return {
    selectedCountry,
    setSelectedCountry,
    userCountry,
    buildCountryQuery,
    getFilteredCarParts,
    getFilteredPartRequests,
    getFilteredUsers,
  };
};