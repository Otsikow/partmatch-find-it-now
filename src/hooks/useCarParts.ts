import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";
import { calculateDistance } from "@/utils/distanceUtils";

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
  userLocation?: {
    latitude: number;
    longitude: number;
    maxDistance?: number; // in kilometers
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
      console.log('User location:', params?.userLocation);
      
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
      console.log('Raw query data:', data);

      if (error) {
        console.error('Error fetching parts:', error);
        setError(error.message);
        return;
      }

      // Transform the data to match our CarPart interface and ensure images are properly formatted
      let transformedParts: CarPart[] = (data || []).map(part => {
        console.log('Processing part:', part.title, 'Status:', part.status);
        console.log('Part supplier_id:', part.supplier_id);
        console.log('Part profiles data:', part.profiles);
        
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
        
        console.log('Processed images for', part.title, ':', processedImages);
        
        return {
          ...part,
          condition: part.condition as 'New' | 'Used' | 'Refurbished',
          status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
          profiles: part.profiles,
          images: processedImages.length > 0 ? processedImages : undefined
        };
      });

      // Apply location-based filtering and sorting if user location is provided
      if (params?.userLocation && params.userLocation.latitude && params.userLocation.longitude) {
        const { latitude: userLat, longitude: userLng, maxDistance } = params.userLocation;
        
        // Calculate distance for each part and add it to the part object
        transformedParts = transformedParts.map(part => {
          if (part.latitude && part.longitude) {
            const distance = calculateDistance(
              userLat,
              userLng,
              part.latitude,
              part.longitude
            );
            return { ...part, distance };
          }
          return { ...part, distance: undefined };
        });

        // Filter by max distance if specified
        if (maxDistance) {
          transformedParts = transformedParts.filter(part => {
            // Keep parts without coordinates or within maxDistance
            return !part.distance || part.distance <= maxDistance;
          });
        }

        // Sort by distance (parts without distance will be at the end)
        transformedParts.sort((a, b) => {
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
      }

      console.log('Final transformed parts count:', transformedParts.length);
      console.log('Final transformed parts:', transformedParts);
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
  }, [params?.searchTerm, params?.filters, params?.userLocation]);

  return { parts, loading, error, refetch: fetchParts };
};
