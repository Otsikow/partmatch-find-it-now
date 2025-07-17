
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";

interface UseCarPartsParams {
  searchTerm?: string;
  filters?: {
    make: string;
    model: string;
    year: string;
    category: string;
    location: string;
    country: string;
    priceRange: [number, number];
  };
}

export const useCarParts = (params?: UseCarPartsParams) => {
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching car parts with params:', params);
      
      let query = supabase
        .from('car_parts')
        .select(`
          id,
          supplier_id,
          title,
          description,
          make,
          model,
          year,
          part_type,
          condition,
          price,
          currency,
          images,
          latitude,
          longitude,
          address,
          country,
          created_at,
          updated_at,
          status,
          profiles!inner(
            first_name,
            last_name,
            phone,
            location,
            profile_photo_url,
            is_verified,
            rating,
            total_ratings
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      console.log('Base query built, applying filters...');

      // Apply filters if provided
      if (params?.filters) {
        if (params.filters.make) {
          query = query.ilike('make', `%${params.filters.make}%`);
          console.log('Applied make filter:', params.filters.make);
        }
        if (params.filters.model) {
          query = query.ilike('model', `%${params.filters.model}%`);
          console.log('Applied model filter:', params.filters.model);
        }
        if (params.filters.year) {
          query = query.eq('year', parseInt(params.filters.year));
          console.log('Applied year filter:', params.filters.year);
        }
        
        // Apply country filter - handle null values for existing parts
        if (params.filters.country && params.filters.country !== 'all') {
          console.log('Applying country filter:', params.filters.country);
          // For now, treat null country as Ghana (GH) for existing parts
          query = query.or(`country.eq.${params.filters.country},country.is.null`);
        } else {
          console.log('No country filter applied - showing all countries');
        }
      }

      // Apply search term if provided
      if (params?.searchTerm) {
        query = query.or(
          `title.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%,part_type.ilike.%${params.searchTerm}%`
        );
        console.log('Applied search term:', params.searchTerm);
      }

      console.log('Executing query...');
      const { data, error } = await query;

      console.log('Query result - Data count:', data?.length || 0);
      console.log('Query result - Error:', error);

      if (error) {
        console.error('Error fetching parts:', error);
        setError(error.message);
        return;
      }

      // Transform the data to match our CarPart interface and ensure images are properly formatted
      const transformedParts: CarPart[] = (data || []).map(part => {
        console.log('Processing part:', part.title, 'Country:', part.country);
        
        // For existing parts without country, default to Ghana (GH)
        const partCountry = part.country || 'GH';
        
        // Ensure images are properly formatted as URLs
        let processedImages: string[] = [];
        if (part.images && Array.isArray(part.images)) {
          processedImages = part.images
            .filter(img => typeof img === 'string' && img.trim() !== '')
            .map(img => {
              // If it's already a full URL, return as is
              if (img.startsWith('http')) {
                return img;
              }
              // If it's a storage path, convert to public URL
              if (img.includes('/')) {
                const { data: { publicUrl } } = supabase.storage
                  .from('car-part-images')
                  .getPublicUrl(img);
                return publicUrl;
              }
              return img;
            });
        }
        
        return {
          ...part,
          country: partCountry,
          condition: part.condition as 'New' | 'Used' | 'Refurbished',
          status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
          profiles: part.profiles,
          images: processedImages.length > 0 ? processedImages : undefined
        };
      });

      console.log('Final transformed parts count:', transformedParts.length);
      console.log('Sample countries in results:', transformedParts.slice(0, 5).map(p => ({ title: p.title, country: p.country })));
      setParts(transformedParts);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [params?.searchTerm, params?.filters]);

  return { parts, loading, error, refetch: fetchParts };
};
