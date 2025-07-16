import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date().toISOString();
    console.log(`Starting cleanup of expired featured parts at ${now}`);

    // Find all featured parts that have expired
    const { data: expiredParts, error: selectError } = await supabase
      .from('car_parts')
      .select('id, title, featured_until')
      .eq('is_featured', true)
      .lt('featured_until', now);

    if (selectError) {
      console.error('Error finding expired featured parts:', selectError);
      return new Response(JSON.stringify({ error: selectError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log(`Found ${expiredParts?.length || 0} expired featured parts`);

    if (expiredParts && expiredParts.length > 0) {
      // Update expired parts to remove featured status
      const { error: updateError } = await supabase
        .from('car_parts')
        .update({ 
          is_featured: false,
          featured_until: null 
        })
        .eq('is_featured', true)
        .lt('featured_until', now);

      if (updateError) {
        console.error('Error updating expired featured parts:', updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      console.log('Successfully cleaned up expired featured parts:', expiredParts.map(p => p.title));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      cleanedUp: expiredParts?.length || 0,
      message: `Cleaned up ${expiredParts?.length || 0} expired featured parts`
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Error in cleanup-featured-parts function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});