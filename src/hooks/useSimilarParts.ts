import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";

interface UseSimilarPartsParams {
  currentPart: CarPart;
  enabled?: boolean;
}

export const useSimilarParts = ({ currentPart, enabled = true }: UseSimilarPartsParams) => {
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilarParts = async () => {
    if (!enabled || !currentPart) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching similar parts for:', currentPart.title, 'part_type:', currentPart.part_type);
      
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
            location,
            profile_photo_url,
            is_verified,
            rating,
            total_ratings
          )
        `)
        .eq('status', 'available')
        .neq('id', currentPart.id)
        .order('price', { ascending: true });

      query = query.or(
        `part_type.ilike.%${currentPart.part_type}%,title.ilike.%${currentPart.title.split(' ')[0]}%`
      );

      console.log('Executing similar parts query...');
      const { data, error } = await query.limit(10);

      console.log('Similar parts query result - Data count:', data?.length || 0);
      console.log('Similar parts query result - Error:', error);

      if (error) {
        console.error('Error fetching similar parts:', error);
        setError(error.message);
        return;
      }

      const transformedParts: CarPart[] = (data || []).map(part => {
        let processedImages: string[] = [];
        if (part.images && Array.isArray(part.images)) {
          processedImages = part.images
            .filter(img => typeof img === 'string' && img.trim() !== '')
            .map(img => {
              if (img.startsWith('http')) {
                return img;
              }
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
          condition: part.condition as 'New' | 'Used' | 'Refurbished',
          status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
          profiles: part.profiles,
          images: processedImages.length > 0 ? processedImages : undefined
        };
      });

      console.log('Final similar parts count:', transformedParts.length);
      setParts(transformedParts);
    } catch (err) {
      console.error('Unexpected error fetching similar parts:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilarParts();
  }, [currentPart.id, enabled]);

  return { parts, loading, error, refetch: fetchSimilarParts };
};
