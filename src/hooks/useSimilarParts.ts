import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";

interface UseSimilarPartsParams {
  currentPart: CarPart;
}

export const useSimilarParts = ({ currentPart }: UseSimilarPartsParams) => {
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilarParts = async () => {
    if (!currentPart) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching similar parts for:', currentPart.title, 'part_type:', currentPart.part_type);
      
      // Build a more robust query with better error handling
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
            location,
            profile_photo_url,
            is_verified,
            rating,
            total_ratings
          )
        `)
        .eq('status', 'available')
        .neq('id', currentPart.id)
        .or(`part_type.ilike.%${currentPart.part_type}%,make.ilike.%${currentPart.make}%`)
        .order('price', { ascending: true })
        .limit(10);

      console.log('Similar parts query result - Data count:', data?.length || 0);
      console.log('Similar parts query result - Error:', error);

      if (error) {
        console.error('Error fetching similar parts:', error);
feat/dashboard-button

main
        // More specific error handling
        if (error.message?.includes('timeout') || error.message?.includes('connect')) {
          setError('Connection timeout - please try again later');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          setError('Network error - check your connection');
        } else {
          setError('Unable to load similar products at this time');
        }
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
feat/dashboard-button

 main
      // Handle different types of errors gracefully
      if (err instanceof Error) {
        if (err.message?.includes('timeout') || err.message?.includes('connect')) {
          setError('Connection timeout - please try again later');
        } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
          setError('Network error - check your connection');
        } else {
          setError('Unable to load similar products at this time');
        }
      } else {
        setError('An unexpected error occurred while loading similar products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to prevent rapid API calls
    const timeoutId = setTimeout(() => {
      fetchSimilarParts();
    }, 300);
feat/dashboard-button

main
    return () => clearTimeout(timeoutId);
  }, [currentPart.id]);

  return { parts, loading, error, refetch: fetchSimilarParts };
};
