
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";

export const useCarParts = () => {
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
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
        .eq('status', 'available')
        .order('created_at', { ascending: false });

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
  }, []);

  return { parts, loading, error, refetch: fetchParts };
};
