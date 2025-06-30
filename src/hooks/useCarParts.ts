
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

      // Transform the data to match our CarPart interface
      const transformedParts: CarPart[] = (data || []).map(part => ({
        ...part,
        condition: part.condition as 'New' | 'Used' | 'Refurbished',
        status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
        profiles: part.profiles
      }));

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
