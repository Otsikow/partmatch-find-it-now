
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
          created_at,
          updated_at,
          status,
          profiles!inner(
            first_name,
            last_name,
            phone,
            location
          )
        `)
        .in('status', ['available', 'accepted'])
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (params?.filters) {
        if (params.filters.make) {
          query = query.ilike('make', `%${params.filters.make}%`);
        }
        if (params.filters.model) {
          query = query.ilike('model', `%${params.filters.model}%`);
        }
        if (params.filters.year) {
          query = query.eq('year', parseInt(params.filters.year));
        }
      }

      // Apply search term if provided
      if (params?.searchTerm) {
        query = query.or(
          `title.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%,part_type.ilike.%${params.searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching parts:', error);
        setError(error.message);
        return;
      }

      // Transform the data to match our CarPart interface and ensure images are properly formatted
      const transformedParts: CarPart[] = (data || []).map(part => {
        console.log('Processing part images:', part.images);
        
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
        
        console.log('Processed images:', processedImages);
        
        return {
          ...part,
          condition: part.condition as 'New' | 'Used' | 'Refurbished',
          status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
          profiles: part.profiles,
          images: processedImages.length > 0 ? processedImages : undefined
        };
      });

      console.log('Transformed parts with images:', transformedParts);
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
