import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface BoostSuggestionRequest {
  listingId: string;
  action?: 'evaluate' | 'track_conversion';
  suggestionId?: string;
}

const HIGH_DEMAND_KEYWORDS = [
  'engine', 'brake', 'gearbox', 'transmission', 'headlight', 'bumper',
  'windscreen', 'alternator', 'radiator', 'suspension', 'battery',
  'steering', 'clutch', 'exhaust', 'fuel pump', 'starter'
];

const COMPETITIVE_CATEGORIES = [
  'Engine Parts', 'Brake System', 'Body Parts', 'Electrical',
  'Suspension', 'Transmission', 'Cooling System'
];

const PROMOTION_PRICING = {
  GHS: {
    feature: 50,
    boost: 30,
    extra_images: 20
  },
  USD: {
    feature: 5,
    boost: 3,
    extra_images: 2
  },
  NGN: {
    feature: 2000,
    boost: 1200,
    extra_images: 800
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId, action = 'evaluate', suggestionId }: BoostSuggestionRequest = await req.json();
    
    console.log(`Processing boost suggestion: ${action} for listing: ${listingId}`);

    if (action === 'track_conversion') {
      return await handleConversionTracking(suggestionId!);
    }

    // Main evaluation flow
    const listing = await getListingWithAnalytics(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    console.log(`Listing found: ${listing.title} - Views: ${listing.view_count}, Clicks: ${listing.click_count}`);

    const suggestions = await evaluatePromotionSuggestions(listing);
    
    if (suggestions.length > 0) {
      // Store suggestions in database
      await storeSuggestions(listing.id, listing.supplier_id, suggestions);
      
      // Update listing with suggestion timestamp
      await supabase
        .from('car_parts')
        .update({
          last_suggested_promotion: new Date().toISOString(),
          promotion_suggestions_count: (listing.promotion_suggestions_count || 0) + 1
        })
        .eq('id', listingId);

      console.log(`Generated ${suggestions.length} suggestions for listing ${listingId}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        suggestions,
        listingAnalytics: {
          views: listing.view_count,
          clicks: listing.click_count,
          age_days: Math.floor((new Date().getTime() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24))
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Boost suggestion error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

async function getListingWithAnalytics(listingId: string) {
  const { data: listing, error } = await supabase
    .from('car_parts')
    .select('*')
    .eq('id', listingId)
    .single();

  if (error || !listing) {
    console.error('Error fetching listing:', error);
    return null;
  }

  return listing;
}

async function evaluatePromotionSuggestions(listing: any) {
  const suggestions: any[] = [];
  const listingAge = Math.floor((new Date().getTime() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const currency = listing.currency || 'GHS';
  const pricing = PROMOTION_PRICING[currency as keyof typeof PROMOTION_PRICING] || PROMOTION_PRICING.GHS;

  // Check if already recently suggested (within 7 days)
  if (listing.last_suggested_promotion) {
    const daysSinceLastSuggestion = Math.floor((new Date().getTime() - new Date(listing.last_suggested_promotion).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastSuggestion < 7) {
      console.log('Recently suggested promotions, skipping');
      return suggestions;
    }
  }

  // Evaluate conditions for suggestions
  const isHighDemandPart = HIGH_DEMAND_KEYWORDS.some(keyword => 
    listing.title.toLowerCase().includes(keyword) || 
    listing.part_type?.toLowerCase().includes(keyword)
  );

  const isCompetitiveCategory = COMPETITIVE_CATEGORIES.some(category =>
    listing.part_type?.toLowerCase().includes(category.toLowerCase())
  );

  const hasLowEngagement = (listing.view_count || 0) < 10 && listingAge >= 3;
  const hasVeryLowEngagement = (listing.view_count || 0) < 5 && (listing.click_count || 0) < 2;
  const isNewListing = listingAge <= 1;
  const alreadyFeatured = listing.is_featured;
  const alreadyBoosted = listing.boosted_until && new Date(listing.boosted_until) > new Date();
  const hasLimitedImages = (listing.images?.length || 0) < 3;

  console.log('Evaluation criteria:', {
    isHighDemandPart,
    isCompetitiveCategory,
    hasLowEngagement,
    hasVeryLowEngagement,
    isNewListing,
    alreadyFeatured,
    alreadyBoosted,
    hasLimitedImages,
    listingAge,
    viewCount: listing.view_count,
    clickCount: listing.click_count
  });

  // Feature suggestion
  if (!alreadyFeatured && (isHighDemandPart || isCompetitiveCategory || hasLowEngagement)) {
    suggestions.push({
      type: 'feature',
      title: 'Feature this listing',
      description: 'Get your part featured on the homepage and top of category for maximum visibility',
      price: pricing.feature,
      currency,
      icon: '✅',
      benefits: ['Homepage visibility', 'Top of category placement', 'Increased views by 300%'],
      criteria: {
        isHighDemandPart,
        isCompetitiveCategory,
        hasLowEngagement,
        listingAge
      }
    });
  }

  // Boost suggestion
  if (!alreadyBoosted && (hasVeryLowEngagement || (isNewListing && isCompetitiveCategory))) {
    suggestions.push({
      type: 'boost',
      title: 'Boost for 7 days',
      description: 'Push your listing to the top of search results for 7 days',
      price: pricing.boost,
      currency,
      icon: '🚀',
      benefits: ['Top of search results', '7 days duration', 'Priority placement'],
      criteria: {
        hasVeryLowEngagement,
        isNewListing,
        isCompetitiveCategory,
        listingAge
      }
    });
  }

  // Extra images suggestion
  if (hasLimitedImages && (hasLowEngagement || isHighDemandPart)) {
    suggestions.push({
      type: 'extra_images',
      title: 'Add 3 more images',
      description: 'Stand out with more photos - listings with 5+ images get 150% more clicks',
      price: pricing.extra_images,
      currency,
      icon: '📸',
      benefits: ['Upload up to 6 total images', '150% more clicks', 'Better buyer confidence'],
      criteria: {
        hasLimitedImages,
        hasLowEngagement,
        isHighDemandPart,
        currentImageCount: listing.images?.length || 0
      }
    });
  }

  return suggestions;
}

async function storeSuggestions(listingId: string, sellerId: string, suggestions: any[]) {
  const suggestionRecords = suggestions.map(suggestion => ({
    listing_id: listingId,
    seller_id: sellerId,
    suggestion_type: suggestion.type,
    price_suggested: suggestion.price,
    currency: suggestion.currency,
    suggestion_criteria: suggestion.criteria
  }));

  const { error } = await supabase
    .from('promotion_suggestions')
    .insert(suggestionRecords);

  if (error) {
    console.error('Error storing suggestions:', error);
    throw error;
  }
}

async function handleConversionTracking(suggestionId: string) {
  const { error } = await supabase
    .from('promotion_suggestions')
    .update({
      converted: true,
      converted_at: new Date().toISOString()
    })
    .eq('id', suggestionId);

  if (error) {
    console.error('Error tracking conversion:', error);
    throw error;
  }

  console.log(`Tracked conversion for suggestion: ${suggestionId}`);

  return new Response(
    JSON.stringify({ success: true, message: 'Conversion tracked' }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

serve(handler);