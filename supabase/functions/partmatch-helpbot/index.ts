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
PartMatch is an AI-powered online marketplace where car owners, mechanics, and auto parts dealers can buy, sell, or request car parts across multiple countries. It supports location-based filtering, trusted seller ratings, and real-time messaging. PartMatch is a global app, currently optimized for Ghana, Nigeria, Kenya, and other African and international markets.

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
- Email: support@partmatch.app
- WhatsApp support available
- Response time: Within 24 hours

## Tips for Success
- Use clear, descriptive titles
- Take photos from multiple angles
- Respond quickly to inquiries
- Build your reputation with good ratings
- Keep listings updated and accurate

## Frequently Asked Questions

### General Questions
Q: How does PartMatch work?
A: Buyers can search or request specific car parts. Sellers can list parts for sale and respond to buyer requests. The system matches buyers and sellers based on car make, model, year, location, and condition.

Q: Which countries does PartMatch support?
A: PartMatch is a global app, currently optimized for Ghana, Nigeria, Kenya, and other African and international markets. Language, currency, and listings adjust based on your location.

### Account & Profile
Q: Do I need an account to use PartMatch?
A: You can browse parts without registering, but to post, request, chat, or buy, you'll need to create an account.

Q: How do I register?
A: Register by entering your name, email, and phone number. You'll receive a confirmation link to activate your account.

Q: Can I register without email confirmation?
A: No. Email confirmation is required to activate your account and access all features.

### Buying & Requesting Parts
Q: How do I search for car parts?
A: Use the search bar, enter the car brand, model, year, or part name, and apply location or condition filters.

Q: What if I can't find the part I need?
A: Click 'Request a Part' from the home screen. Describe your part, car details, and location. Sellers will respond with offers.

Q: How will sellers contact me?
A: You will receive notifications in your dashboard and can chat directly using the built-in Chat with Seller feature.

### Selling & Promotions
Q: How do I list a car part for sale?
A: Tap 'Sell a Part', upload clear photos, add part details, car compatibility, location, and your asking price.

Q: Can I promote my listings?
A: Yes! You can Feature a Listing (shown at the top), Boost a Listing (highlighted with priority), or Add Extra Photos for visibility. These are available during or after posting.

Q: How long do promotions last?
A: You can choose between 7 days or 30 days. Prices vary based on country and package.

### Payments & Subscriptions
Q: Is PartMatch free to use?
A: Browsing and basic listing is free. Promotions and business subscriptions come with a fee.

Q: How do I pay for featured or boosted listings?
A: You can pay securely using Paystack, Stripe, or other local payment gateways depending on your country.

Q: Do you support local currencies?
A: Yes. PartMatch detects your location and automatically shows prices in your local currency.

### Orders & Transactions
Q: Can I buy directly through the app?
A: Currently, PartMatch connects you with the seller. You agree on the payment method and delivery. An in-app escrow system is coming soon.

Q: What if I get scammed?
A: Only deal with verified sellers and use chat history for evidence. PartMatch is building a review and report system to protect buyers.

### Reviews, Ratings & Trust
Q: Can I rate sellers and parts?
A: Yes. After a successful transaction, you can leave a review and rating for the seller.

Q: What do seller badges mean?
A: Seller badges show their trust level, responsiveness, and review scores, helping buyers choose reliable vendors.

### Mobile App Features
Q: Is there a mobile app?
A: Yes. PartMatch is available on Android and iOS. You can download it from your app store or visit www.partmatch.app.

### Security & Privacy
Q: Is my data safe on PartMatch?
A: Yes. We use industry-standard encryption, and your data is stored securely with GDPR-compliant practices.

Q: Will my contact information be public?
A: Only verified and necessary seller/buyer contact info is shared privately during transactions. You control your visibility.

### Support & Troubleshooting
Q: How do I contact support?
A: Use the Help & Support section in your app, or email support@partmatch.app.

Q: What if the app crashes or freezes?
A: Ensure your app is updated. If the issue continues, clear your cache or reinstall the app.

Q: I found a bug. How do I report it?
A: Go to Settings > Report a Bug or email a screenshot and description to bugs@partmatch.app.
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
        response: "I understand you'd like to speak with a human. I'm connecting you to our support team. You can also reach us directly at support@partmatch.app or through WhatsApp. Our team will respond within 24 hours. Is there anything else I can help you with in the meantime?",
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
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }
    
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
      response: "I'm experiencing some technical difficulties right now. Please try again in a moment, or contact our support team at support@partmatch.app for immediate assistance.",
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});