import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";
import { calculateDistance, isWithinDistance } from "@/utils/distanceUtils";

interface UseCarPartsParams {
  searchTerm?: string;
  filters?: {
    make: string;
    model: string;
    year: string;
    category: string;
    location: string;
    maxDistance?: number;
    priceRange: [number, number];
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
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
          is_featured,
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

      // Apply search term if provided
      if (params?.searchTerm) {
        query = query.or(
          `title.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%,part_type.ilike.%${params.searchTerm}%`
        );
      }

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
        if (params.filters.category) {
          query = query.ilike('part_type', `%${params.filters.category}%`);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching parts:', error);
        
        const isServiceUnavailable = 
          error.message?.includes('503') || 
          error.message?.includes('timeout') || 
          error.message?.includes('upstream connect error');
          
        setError(isServiceUnavailable 
          ? "Service temporarily unavailable. Please check your connection and try again."
          : error.message
        );
        return;
      }

      // Filter by distance if user location is provided
      let filteredParts = data || [];
      console.log('Filtering parts by distance:', {
        hasUserLocation: !!params?.userLocation,
        maxDistance: params?.filters?.maxDistance,
        totalPartsBeforeFilter: filteredParts.length
      });
      
      if (params?.userLocation && params.filters?.maxDistance) {
        console.log('User location:', params.userLocation);
        console.log('Max distance filter:', params.filters.maxDistance);
        
        filteredParts = filteredParts.filter(part => {
          if (!part.latitude || !part.longitude) {
            console.log(`Part ${part.id} has no coordinates, skipping`);
            return false;
          }
          
          const withinDistance = isWithinDistance(
            params.userLocation!.latitude,
            params.userLocation!.longitude,
            part.latitude,
            part.longitude,
            params.filters.maxDistance!
          );
          
          if (!withinDistance) {
            console.log(`Part ${part.id} is outside the distance range of ${params.filters.maxDistance} miles`);
          }
          
          return withinDistance;
        });
        
        console.log(`Filtered to ${filteredParts.length} parts within ${params.filters.maxDistance} miles`);

        // Sort by distance
        filteredParts.sort((a, b) => {
          if (!a.latitude || !b.latitude) return 0;
          const distanceA = calculateDistance(
            params.userLocation!.latitude,
            params.userLocation!.longitude,
            a.latitude,
            a.longitude
          );
          const distanceB = calculateDistance(
            params.userLocation!.latitude,
            params.userLocation!.longitude,
            b.latitude,
            b.longitude
          );
          return distanceA - distanceB;
        });
      }

      // Transform the data to match our CarPart interface and ensure images are properly formatted
      const transformedParts: CarPart[] = (filteredParts || []).map(part => {
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
          condition: part.condition as 'New' | 'Used' | 'Refurbished',
          status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
          profiles: part.profiles,
          images: processedImages.length > 0 ? processedImages : undefined
        };
      });

      setParts(transformedParts);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useCarParts dependencies changed:', {
      searchTerm: params?.searchTerm,
      filters: params?.filters,
      userLocation: params?.userLocation,
      maxDistance: params?.filters?.maxDistance
    });
    fetchParts();
  }, [
    params?.searchTerm,
    JSON.stringify(params?.filters),
    params?.userLocation?.latitude,
    params?.userLocation?.longitude
  ]);

  return { parts, loading, error, refetch: fetchParts };
};
