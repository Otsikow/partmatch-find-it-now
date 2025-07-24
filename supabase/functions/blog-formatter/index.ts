import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Title and content are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are the BlogFormatter AI for PartMatch, a car parts marketplace in Ghana. Format the following blog post content to be professional, visually organized, and easy to read.

FORMATTING REQUIREMENTS:

1. HEADING STRUCTURE:
   - Keep the main title as is (will be H1 in the system)
   - Convert section headings to H2 using ## syntax
   - Convert subtopics to H3 using ### syntax
   - Make headings descriptive and engaging

2. PARAGRAPH FORMATTING:
   - Split long paragraphs into shorter, readable blocks (max 3-4 sentences)
   - Remove extra blank lines
   - Ensure consistent spacing between paragraphs

3. LISTS & BULLET POINTS:
   - Convert steps, instructions, or itemized content to proper markdown lists
   - Use numbered lists (1. 2. 3.) for sequential steps
   - Use bullet points (- or *) for non-sequential items

4. CALLOUTS & CTAs:
   - Highlight "Find this part now on PartMatch" or similar CTAs using bold markdown
   - Add relevant PartMatch CTAs where appropriate
   - Make CTAs stand out but natural

5. QUOTES & TIPS:
   - Format tips, quotes, or notable facts using > blockquote syntax
   - Use **bold** for emphasis on important points

6. SEO ELEMENTS:
   - Generate a compelling meta excerpt (max 160 characters) that summarizes the post
   - Ensure content is keyword-rich for car parts, maintenance, and Ghana/African context

7. LINKS:
   - Format any URLs properly
   - Add PartMatch references where relevant

8. ACCESSIBILITY & READABILITY:
   - Use clear, simple language
   - Break up text with subheadings
   - Ensure content flows logically

CONTEXT: This is for a car parts marketplace in Ghana serving African drivers. Include local context and practical advice.

TITLE: ${title}

CONTENT TO FORMAT:
${content}

Return ONLY a JSON response with:
{
  "formattedContent": "the formatted markdown content",
  "excerpt": "compelling 160-char excerpt",
  "suggestions": ["improvement suggestion 1", "improvement suggestion 2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional blog formatter for PartMatch, a car parts marketplace. Return only valid JSON responses.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the AI response as JSON
    let formattedResult;
    try {
      formattedResult = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      formattedResult = {
        formattedContent: aiResponse,
        excerpt: content.substring(0, 160) + "...",
        suggestions: ["Review the formatted content and make any necessary adjustments"]
      };
    }

    return new Response(JSON.stringify(formattedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in blog-formatter function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to format blog post',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});