import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import showdown from 'showdown';

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    console.log('Formatting blog post:', { title, contentLength: content.length });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional blog formatter for PartMatch, a car parts marketplace. Format the given blog post content according to these requirements:

1. HEADING STRUCTURE:
   - Convert main title to H1 (# Title)
   - Style section headings as H2 (## Section) or H3 (### Subsection)
   - Ensure consistent hierarchy

2. PARAGRAPH FORMATTING:
   - Split long paragraphs into shorter, readable blocks
   - Remove extra blank lines and ensure consistent spacing
   - Keep paragraphs focused and concise

3. LISTS & BULLET POINTS:
   - Convert steps, instructions, or itemized content to proper markdown lists
   - Use numbered lists (1.) for sequential steps
   - Use bullet points (-) for non-sequential items

4. CALLOUTS & CTAs:
   - Highlight "Find this part now on PartMatch" or similar CTAs using blockquotes (> text) or bold formatting
   - Make CTAs stand out visually

5. QUOTES & TIPS:
   - Format tips, quotes, or notable facts using blockquotes (> text) or italic emphasis
   - Identify important information and highlight it

6. SEO ELEMENTS:
   - Generate a meta excerpt (max 160 characters) summarizing the post
   - Ensure the content is well-structured for SEO

7. LINKS:
   - Ensure all URLs are properly formatted as markdown links [text](url)
   - Keep external links as they are

8. ACCESSIBILITY:
   - Use clear, descriptive headings
   - Ensure content flows logically

Return a JSON object with:
- formattedContent: The fully formatted markdown content
- excerpt: A compelling 160-character meta description
- suggestedTags: Array of 3-5 relevant tags for the post

Make the content professional, engaging, and optimized for Nigerian car owners and mechanics.`
          },
          {
            role: 'user',
            content: `Please format this blog post:

Title: ${title}

Content: ${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log('AI formatting completed successfully');

    // Try to parse the JSON response from AI
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (parseError) {
      console.warn('AI response was not valid JSON, using as formatted content');
      // If AI didn't return JSON, treat the whole response as formatted content
      parsedResult = {
        formattedContent: result,
        excerpt: `${content.substring(0, 157)}...`,
        suggestedTags: ['car parts', 'automotive', 'maintenance']
      };
    }

    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(parsedResult.formattedContent || result);

    return new Response(JSON.stringify({
      success: true,
      formattedContent: htmlContent,
      excerpt: parsedResult.excerpt || `${content.substring(0, 157)}...`,
      suggestedTags: parsedResult.suggestedTags || ['car parts', 'automotive', 'maintenance']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in blog-formatter function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});