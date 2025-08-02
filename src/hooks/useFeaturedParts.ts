import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CarPart } from '@/types/CarPart';

export const useFeaturedParts = (countryCode?: string) => {
  const [featuredParts, setFeaturedParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedParts();
  }, [countryCode]);

  const fetchFeaturedParts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('useFeaturedParts: Starting fetch...');
      console.log('useFeaturedParts: Current time:', new Date().toISOString());

      let query = supabase
        .from('car_parts')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            is_verified,
            rating,
            total_ratings,
            profile_photo_url
          )
        `)
        .eq('is_featured', true)
        .eq('status', 'available');

      // Add country filter if provided - include parts for this country OR parts without country restriction
      if (countryCode) {
        query = query.or(`featured_country.eq.${countryCode},featured_country.is.null`);
      }

      // Add time filter - either no expiry or not yet expired
      query = query.or('featured_until.is.null,featured_until.gt.' + new Date().toISOString());
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(8);

      console.log('useFeaturedParts: Query result:', { data, error });
      console.log('useFeaturedParts: Found parts count:', data?.length || 0);

      if (error) {
        console.error('Error fetching featured parts:', error);
        setError(error.message);
        return;
      }

      const transformedParts: CarPart[] = data?.map(part => ({
        id: part.id,
        supplier_id: part.supplier_id,
        title: part.title,
        description: part.description,
        make: part.make,
        model: part.model,
        year: part.year,
        part_type: part.part_type,
        condition: part.condition as 'New' | 'Used' | 'Refurbished',
        price: part.price,
        currency: part.currency,
        address: part.address,
        latitude: part.latitude,
        longitude: part.longitude,
        images: part.images,
        status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
        created_at: part.created_at,
        updated_at: part.updated_at,
        is_featured: part.is_featured,
        featured_until: part.featured_until,
        featured_country: part.featured_country,
        boosted_until: part.boosted_until,
        profiles: part.profiles
      })) || [];

      setFeaturedParts(transformedParts);
    } catch (err) {
      console.error('Error in fetchFeaturedParts:', err);
      setError('Failed to fetch featured parts');
    } finally {
      setLoading(false);
    }
  };

  return { featuredParts, loading, error, refetch: fetchFeaturedParts };
};