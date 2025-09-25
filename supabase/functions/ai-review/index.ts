
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { requestId } = await req.json();

    console.log('Starting AI review for request:', requestId);

    // Get the request details
    const { data: request, error: requestError } = await supabase
      .from('part_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      console.error('Error fetching request:', requestError);
      return new Response(JSON.stringify({ error: 'Request not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare the AI prompt
    const prompt = `You are an AI moderator for a car parts marketplace. Please review this part request and determine if it should be approved or rejected.

REQUEST DETAILS:
- Car: ${request.car_make} ${request.car_model} ${request.car_year}
- Part Needed: ${request.part_needed}
- Description: ${request.description || 'No description provided'}
- Location: ${request.location}
- Phone: ${request.phone}

REVIEW CRITERIA:
1. Is this a legitimate car part request?
2. Does the request contain appropriate language (no spam, offensive content)?
3. Are the car details realistic and properly formatted?
4. Is the part name reasonable and not suspicious?
5. Is the phone number in a valid format?

RESPONSE FORMAT:
Return a JSON object with:
{
  "decision": "approved" | "rejected" | "needs_human_review",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of the decision"
}

Be conservative - if anything seems suspicious or unclear, choose "needs_human_review".`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful AI moderator that reviews car part requests for legitimacy and appropriateness.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text());
      return new Response(JSON.stringify({ error: 'AI review failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await openaiResponse.json();
    let reviewResult;

    try {
      reviewResult = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      reviewResult = {
        decision: 'needs_human_review',
        confidence: 0.5,
        reasoning: 'AI response could not be parsed'
      };
    }

    console.log('AI review result:', reviewResult);

    // Store the AI review result
    const { error: reviewError } = await supabase
      .from('ai_reviews')
      .insert({
        request_id: requestId,
        review_status: reviewResult.decision,
        confidence_score: reviewResult.confidence,
        ai_reasoning: reviewResult.reasoning,
      });

    if (reviewError) {
      console.error('Error storing AI review:', reviewError);
    }

    // Update the request status based on AI decision
    if (reviewResult.decision === 'approved' && reviewResult.confidence > 0.7) {
      await supabase
        .from('part_requests')
        .update({ status: 'pending' })
        .eq('id', requestId);

      console.log('Request approved by AI and status updated to pending');
    }

    return new Response(JSON.stringify({
      decision: reviewResult.decision,
      confidence: reviewResult.confidence,
      reasoning: reviewResult.reasoning,
      approved: reviewResult.decision === 'approved' && reviewResult.confidence > 0.7
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in AI review function:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
