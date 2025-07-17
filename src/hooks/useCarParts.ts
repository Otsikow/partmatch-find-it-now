import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";
import { getCountryConfig, getCurrencyByCountry } from "@/lib/countryConfig";
import { convertFromGHS, convertFromNGN } from "@/utils/exchangeRates";

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
        if (params.filters.make && params.filters.make !== 'all') {
          query = query.ilike('make', `%${params.filters.make}%`);
          console.log('Applied make filter:', params.filters.make);
        }
        if (params.filters.model) {
          query = query.ilike('model', `%${params.filters.model}%`);
          console.log('Applied model filter:', params.filters.model);
        }
        if (params.filters.year && params.filters.year !== 'all') {
          query = query.eq('year', parseInt(params.filters.year));
          console.log('Applied year filter:', params.filters.year);
        }
        if (params.filters.category && params.filters.category !== 'all') {
          query = query.ilike('part_type', `%${params.filters.category}%`);
          console.log('Applied category filter:', params.filters.category);
        }
        
        if (params.filters.location) {
          query = query.ilike('address', `%${params.filters.location}%`);
          console.log('Applied location filter:', params.filters.location);
        }
        
        if (params.filters.priceRange && (params.filters.priceRange[0] > 0 || params.filters.priceRange[1] < 10000)) {
          query = query.gte('price', params.filters.priceRange[0]).lte('price', params.filters.priceRange[1]);
          console.log('Applied price range filter:', params.filters.priceRange);
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

      // Get target currency based on selected country
      const targetCountry = params?.filters?.country && params.filters.country !== 'all' ? params.filters.country : 'GH';
      const targetCurrency = getCurrencyByCountry(targetCountry);
      console.log('Target country:', targetCountry, 'Target currency:', targetCurrency);

      // Transform the data and apply country filtering after fetching
      const transformedParts: CarPart[] = (data || []).map(part => {
        console.log('Processing part:', part.title, 'Country:', part.country, 'Original price:', part.price, part.currency);
        
        // Keep original country value or set to null if not specified
        const partCountry = part.country || null;
        
        // Convert price to target currency
        let convertedPrice = part.price;
        let displayCurrency = targetCurrency;
        
        if (part.currency !== targetCurrency) {
          console.log(`Converting ${part.price} ${part.currency} to ${targetCurrency}`);
          
          // Convert based on original currency
          if (part.currency === 'GHS') {
            convertedPrice = convertFromGHS(part.price, targetCurrency);
          } else if (part.currency === 'NGN') {
            convertedPrice = convertFromNGN(part.price, targetCurrency);
          } else {
            // For other currencies, keep original for now
            convertedPrice = part.price;
            displayCurrency = part.currency;
          }
          
          console.log(`Converted price: ${convertedPrice} ${displayCurrency}`);
        }
        
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
          price: Math.round(convertedPrice), // Round to nearest whole number
          currency: displayCurrency,
          condition: part.condition as 'New' | 'Used' | 'Refurbished',
          status: part.status as 'available' | 'sold' | 'hidden' | 'pending',
          profiles: part.profiles,
          images: processedImages.length > 0 ? processedImages : undefined
        };
      });

      // Apply country filtering after transformation
      let filteredParts = transformedParts;
      if (params?.filters?.country && params.filters.country !== 'all') {
        console.log('Applying country filter post-fetch:', params.filters.country);
        filteredParts = transformedParts.filter(part => {
          // For Ghana (GH), include parts with null country (legacy data) or explicit GH
          if (params.filters.country === 'GH') {
            return part.country === 'GH' || part.country === null;
          }
          // For other countries, only include exact matches
          return part.country === params.filters.country;
        });
        console.log('Filtered parts count after country filter:', filteredParts.length);
      }

      console.log('Final filtered parts count:', filteredParts.length);
      console.log('Sample countries in results:', filteredParts.slice(0, 5).map(p => ({ title: p.title, country: p.country, price: p.price, currency: p.currency })));
      setParts(filteredParts);
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
