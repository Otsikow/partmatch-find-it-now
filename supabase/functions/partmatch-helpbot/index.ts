import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

const PARTMATCH_KNOWLEDGE_BASE = `
# PartMatch Platform Knowledge Base

## Platform Overview
PartMatch is a car parts marketplace connecting car owners with trusted suppliers across Ghana and Nigeria. We make finding and selling car parts simple, fast, and secure.

## Core Features

### Posting a Part (For Suppliers)
1. Go to "Sell Car Parts" tab in your dashboard
2. Fill in part details: title, make, model, year, condition, price
3. Upload clear photos (minimum 1, maximum 5)
4. Add location and contact information
5. Submit for quality review
6. Once approved, your part goes live

### Requesting a Part (For Car Owners)
1. Click "Request a Part" 
2. Describe the part you need with car details (make, model, year)
3. Add your location and budget
4. Submit request
5. Suppliers will send you offers with photos and prices
6. Choose the best offer and contact the supplier

### Messaging System
- Direct chat between buyers and sellers
- Share photos and negotiate prices
- Contact details revealed after agreement
- Rate your experience after transaction

## Listing Types & Fees

### Regular Listings
- Free to post basic car parts
- Visible in search results and category pages
- Standard placement in listings

### Featured Listings
- Cost: ₦500-1000 / GH₵50-100 (varies by category)
- Displayed on homepage
- Top placement in category pages
- 30-day duration
- Higher visibility and more inquiries

### Boosted Listings
- Cost: ₦300-700 / GH₵30-70 (varies by category)
- Top placement in search results
- 7-day duration
- Priority in relevant searches

### Premium Image Package
- Cost: ₦200 / GH₵20
- Upload up to 8 total photos (vs 5 standard)
- Better showcase your parts
- Increases buyer confidence

### Verified Badge
- Cost: ₦150 / GH₵15
- Green checkmark on your listing
- Builds trust with buyers
- 30-day duration

## Quality Requirements
- Clear, well-lit photos required
- Accurate part descriptions
- Correct make/model/year information
- Fair pricing (market competitive)
- No duplicate listings
- Genuine parts only (no counterfeit)

## Listing Approval Process
1. AI quality check (immediate)
2. Admin review if needed (24-48 hours)
3. Approval notification
4. Listing goes live
5. Rejection includes feedback for improvement

## Supported Locations
- Nigeria: Lagos, Abuja, Port Harcourt, Kano, Ibadan
- Ghana: Accra, Kumasi, Tamale, Cape Coast

## Payment & Currencies
- Nigeria: Nigerian Naira (₦)
- Ghana: Ghana Cedis (GH₵)
- Mobile money supported
- Cash on delivery available

## Account Types
- Car Owner/Buyer: Request parts, save favorites, rate sellers
- Supplier/Seller: List parts, respond to requests, business tools
- Verified Suppliers: Enhanced trust badges, priority placement

## Common Issues & Solutions

### Listing Rejected?
- Check photo quality (clear, good lighting)
- Verify part information accuracy
- Ensure competitive pricing
- Remove duplicate listings
- Contact support for specific feedback

### Not Getting Responses?
- Add more photos
- Improve part description
- Check pricing competitiveness
- Consider boosting your listing
- Verify contact information

### Can't Find a Specific Part?
- Post a request with detailed information
- Include car VIN or part numbers if available
- Set a realistic budget
- Be patient for supplier responses

## Contact & Support
- In-app chat support
- Email: support@partmatch.com
- WhatsApp support available
- Response time: Within 24 hours

## Tips for Success
- Use clear, descriptive titles
- Take photos from multiple angles
- Respond quickly to inquiries
- Build your reputation with good ratings
- Keep listings updated and accurate
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, conversationHistory = [] } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Check for escalation keywords
    const escalationKeywords = ['talk to support', 'human support', 'not helpful', 'speak to person', 'real person'];
    const needsEscalation = escalationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (needsEscalation) {
      // Log escalation request
      if (userId) {
        await supabase.from('user_notifications').insert({
          user_id: userId,
          type: 'support_escalation',
          title: 'Support Escalation Requested',
          message: 'User requested to speak with human support',
          metadata: { original_query: message, timestamp: new Date().toISOString() }
        });
      }

      return new Response(JSON.stringify({
        response: "I understand you'd like to speak with a human. I'm connecting you to our support team. You can also reach us directly at support@partmatch.com or through WhatsApp. Our team will respond within 24 hours. Is there anything else I can help you with in the meantime?",
        escalated: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare conversation context
    const messages = [
      {
        role: 'system',
        content: `You are PartMatch HelpBot, a friendly and helpful AI assistant for the PartMatch car parts marketplace. 

Use this knowledge base to answer questions accurately:
${PARTMATCH_KNOWLEDGE_BASE}

Guidelines:
- Be friendly, helpful, and professional
- Answer questions clearly and concisely
- Use specific information from the knowledge base
- Include relevant fees, processes, or steps
- If you don't know something specific, admit it and suggest contacting support
- Always try to be helpful and guide users to success on the platform
- Use examples when helpful
- Keep responses conversational but informative

If users ask about:
- Posting parts: Guide them through the step-by-step process
- Fees: Provide specific pricing in both currencies
- Technical issues: Offer troubleshooting steps
- Account problems: Suggest appropriate solutions
- General questions: Use the knowledge base information

Remember: You're representing PartMatch, so maintain a positive, helpful tone that builds confidence in the platform.`
      },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    // Log the interaction for improvement
    try {
      await supabase.from('listing_analytics').insert({
        listing_id: null, // This is for general chat, not specific to a listing
        user_id: userId,
        event_type: 'helpbot_query',
        event_data: {
          user_query: message,
          bot_response: botResponse,
          timestamp: new Date().toISOString(),
          model_used: 'gpt-4o-mini'
        }
      });
    } catch (logError) {
      console.error('Failed to log chat interaction:', logError);
      // Continue despite logging error
    }

    return new Response(JSON.stringify({
      response: botResponse,
      escalated: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in PartMatch HelpBot:', error);
    return new Response(JSON.stringify({
      response: "I'm experiencing some technical difficulties right now. Please try again in a moment, or contact our support team at support@partmatch.com for immediate assistance.",
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});