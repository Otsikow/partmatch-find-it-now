import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
// Using fetch API instead of Resend SDK for Deno compatibility

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resendApiKey = Deno.env.get('RESEND_API_KEY');

interface WeeklyInsights {
  topViewedListings: any[];
  mostRequestedParts: any[];
  topSellers: any[];
  regionalActivity: any[];
  revenueEstimate: number;
  growthSummary: {
    newUsers: number;
    newListings: number;
    conversionRate: number;
  };
  warnings: string[];
  weeklyTrends: any[];
}

async function generateWeeklyInsights(): Promise<WeeklyInsights> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekAgoISO = oneWeekAgo.toISOString();

  console.log('Generating weekly insights for period:', weekAgoISO, 'to', new Date().toISOString());

  // 1. Top 10 most viewed listings this week
  const { data: topViewedListings } = await supabase
    .from('car_parts')
    .select(`
      id, title, make, model, view_count, click_count, price, currency,
      profiles!supplier_id(first_name, last_name)
    `)
    .gte('updated_at', weekAgoISO)
    .order('view_count', { ascending: false })
    .limit(10);

  // 2. Most requested part types
  const { data: requestData } = await supabase
    .from('part_requests')
    .select('part_needed, car_make, car_model')
    .gte('created_at', weekAgoISO);

  const partTypeCounts = requestData?.reduce((acc: any, req: any) => {
    const key = req.part_needed.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}) || {};

  const mostRequestedParts = Object.entries(partTypeCounts)
    .map(([part, count]) => ({ part_type: part, request_count: count }))
    .sort((a: any, b: any) => b.request_count - a.request_count)
    .slice(0, 10);

  // 3. Top sellers by listings and revenue
  const { data: sellerData } = await supabase
    .from('car_parts')
    .select(`
      supplier_id,
      is_featured, boosted_until,
      profiles!supplier_id(first_name, last_name, rating, total_ratings)
    `)
    .gte('created_at', weekAgoISO);

  const sellerStats = sellerData?.reduce((acc: any, part: any) => {
    const sellerId = part.supplier_id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        seller_id: sellerId,
        seller_name: `${part.profiles?.first_name || ''} ${part.profiles?.last_name || ''}`.trim(),
        listing_count: 0,
        featured_count: 0,
        boosted_count: 0,
        rating: part.profiles?.rating || 0
      };
    }
    acc[sellerId].listing_count++;
    if (part.is_featured) acc[sellerId].featured_count++;
    if (part.boosted_until && new Date(part.boosted_until) > new Date()) acc[sellerId].boosted_count++;
    return acc;
  }, {}) || {};

  const topSellers = Object.values(sellerStats)
    .sort((a: any, b: any) => b.listing_count - a.listing_count)
    .slice(0, 10);

  // 4. Regional activity
  const { data: regionalData } = await supabase
    .from('profiles')
    .select('country, city')
    .gte('created_at', weekAgoISO);

  const regionalCounts = regionalData?.reduce((acc: any, profile: any) => {
    const country = profile.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {}) || {};

  const regionalActivity = Object.entries(regionalCounts)
    .map(([country, count]) => ({ country, user_count: count }))
    .sort((a: any, b: any) => b.user_count - a.user_count);

  // 5. Revenue estimate from monetization
  const { data: monetizationData } = await supabase
    .from('monetization_purchases')
    .select('amount, currency, purchase_type')
    .gte('created_at', weekAgoISO)
    .eq('payment_status', 'completed');

  const revenueEstimate = monetizationData?.reduce((total: number, purchase: any) => {
    return total + (parseFloat(purchase.amount) || 0);
  }, 0) || 0;

  // 6. Growth summary
  const { data: newUsers } = await supabase
    .from('profiles')
    .select('id')
    .gte('created_at', weekAgoISO);

  const { data: newListings } = await supabase
    .from('car_parts')
    .select('id')
    .gte('created_at', weekAgoISO);

  const { data: allOffers } = await supabase
    .from('offers')
    .select('id, status')
    .gte('created_at', weekAgoISO);

  const acceptedOffers = allOffers?.filter(offer => offer.status === 'accepted').length || 0;
  const conversionRate = allOffers?.length ? (acceptedOffers / allOffers.length) * 100 : 0;

  // 7. Generate warnings
  const warnings: string[] = [];
  
  if ((newListings?.length || 0) < 10) {
    warnings.push('⚠️ Low new listings this week (less than 10)');
  }
  
  if (conversionRate < 15) {
    warnings.push('⚠️ Low conversion rate (offer acceptance below 15%)');
  }
  
  if (revenueEstimate < 100) {
    warnings.push('⚠️ Low monetization revenue this week');
  }

  const lowEngagementParts = topViewedListings?.filter(part => part.view_count < 5).length || 0;
  if (lowEngagementParts > 5) {
    warnings.push('⚠️ Multiple listings with low engagement');
  }

  // 8. Weekly trends (simplified)
  const weeklyTrends = [
    { metric: 'New Users', value: newUsers?.length || 0, change: '+0%' },
    { metric: 'New Listings', value: newListings?.length || 0, change: '+0%' },
    { metric: 'Revenue', value: revenueEstimate, change: '+0%' },
    { metric: 'Conversion Rate', value: Math.round(conversionRate), change: '+0%' }
  ];

  return {
    topViewedListings: topViewedListings || [],
    mostRequestedParts,
    topSellers,
    regionalActivity,
    revenueEstimate,
    growthSummary: {
      newUsers: newUsers?.length || 0,
      newListings: newListings?.length || 0,
      conversionRate: Math.round(conversionRate)
    },
    warnings,
    weeklyTrends
  };
}

async function generateAIInsights(data: WeeklyInsights): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    return generateBasicSummary(data);
  }

  try {
    const prompt = `Analyze this PartMatch marketplace data and provide strategic insights:

Top Listings: ${JSON.stringify(data.topViewedListings.slice(0, 3))}
Most Requested Parts: ${JSON.stringify(data.mostRequestedParts.slice(0, 5))}
Growth: ${data.growthSummary.newUsers} new users, ${data.growthSummary.newListings} new listings
Revenue: $${data.revenueEstimate}
Conversion Rate: ${data.growthSummary.conversionRate}%
Warnings: ${data.warnings.join(', ')}

Provide:
1. Key trends and patterns
2. Strategic recommendations
3. Areas of concern
4. Growth opportunities

Keep it concise and actionable for marketplace management.`;

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
            content: 'You are a marketplace analytics expert providing strategic insights for PartMatch, a car parts marketplace.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const aiData = await response.json();
    return aiData.choices?.[0]?.message?.content || generateBasicSummary(data);
  } catch (error) {
    console.error('AI insight generation failed:', error);
    return generateBasicSummary(data);
  }
}

function generateBasicSummary(data: WeeklyInsights): string {
  return `
📊 PartMatch Weekly Insights Summary

🔥 TOP PERFORMANCE:
• ${data.topViewedListings[0]?.title || 'No top listing'} led with ${data.topViewedListings[0]?.view_count || 0} views
• Most requested: ${data.mostRequestedParts[0]?.part_type || 'No requests'}

📈 GROWTH METRICS:
• ${data.growthSummary.newUsers} new users joined
• ${data.growthSummary.newListings} new parts listed
• ${data.growthSummary.conversionRate}% conversion rate

💰 REVENUE: $${data.revenueEstimate}

${data.warnings.length > 0 ? '⚠️ ALERTS:\n' + data.warnings.join('\n') : '✅ All metrics healthy'}

Focus on improving conversion rates and encouraging more listings for continued growth.
  `;
}

async function sendWeeklyEmail(insights: WeeklyInsights, aiSummary: string) {
  try {
    const emailContent = `
      <h1>🚗 PartMatch Weekly Insights Report</h1>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>📊 AI Analysis</h2>
        <pre style="white-space: pre-wrap; font-family: -apple-system, sans-serif;">${aiSummary}</pre>
      </div>

      <h2>🔥 Top 10 Most Viewed Listings</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #e9ecef;">
          <th style="padding: 10px; border: 1px solid #dee2e6;">Title</th>
          <th style="padding: 10px; border: 1px solid #dee2e6;">Views</th>
          <th style="padding: 10px; border: 1px solid #dee2e6;">Price</th>
        </tr>
        ${insights.topViewedListings.map(listing => `
          <tr>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${listing.title}</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${listing.view_count}</td>
            <td style="padding: 8px; border: 1px solid #dee2e6;">${listing.currency} ${listing.price}</td>
          </tr>
        `).join('')}
      </table>

      <h2>📦 Most Requested Parts</h2>
      <ul>
        ${insights.mostRequestedParts.map(part => `
          <li>${part.part_type}: ${part.request_count} requests</li>
        `).join('')}
      </ul>

      <h2>📈 Growth Summary</h2>
      <ul>
        <li>New Users: ${insights.growthSummary.newUsers}</li>
        <li>New Listings: ${insights.growthSummary.newListings}</li>
        <li>Conversion Rate: ${insights.growthSummary.conversionRate}%</li>
        <li>Revenue Estimate: $${insights.revenueEstimate}</li>
      </ul>

      ${insights.warnings.length > 0 ? `
        <h2>⚠️ Warnings & Alerts</h2>
        <ul style="color: #dc3545;">
          ${insights.warnings.map(warning => `<li>${warning}</li>`).join('')}
        </ul>
      ` : '<p style="color: #28a745;">✅ All metrics are healthy this week!</p>'}

      <hr style="margin: 30px 0;">
      <p style="color: #6c757d; font-size: 14px;">Generated by PartMatch Insight Agent on ${new Date().toLocaleDateString()}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PartMatch Insights <insights@partmatch.app>',
        to: ['admin@partmatch.com', 'j777wmb@gmail.com'],
        subject: `PartMatch Weekly Insights - ${new Date().toLocaleDateString()}`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Email sending failed:', errorData);
      return false;
    }

    console.log('Weekly insights email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending weekly email:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting weekly insight generation...');
    
    // Generate insights
    const insights = await generateWeeklyInsights();
    
    // Generate AI summary
    const aiSummary = await generateAIInsights(insights);
    
    // Store insights in database for dashboard display
    const { error: insertError } = await supabase
      .from('admin_notifications')
      .insert({
        type: 'weekly_insights',
        title: 'Weekly Marketplace Insights',
        message: aiSummary,
        metadata: {
          insights,
          generated_at: new Date().toISOString(),
          week_ending: new Date().toISOString()
        }
      });

    if (insertError) {
      console.error('Failed to store insights:', insertError);
    }

    // Send email report
    const emailSent = await sendWeeklyEmail(insights, aiSummary);
    
    // Log analytics event
    await supabase
      .from('listing_analytics')
      .insert({
        listing_id: null,
        user_id: null,
        event_type: 'weekly_insights_generated',
        event_data: {
          insights_summary: {
            new_users: insights.growthSummary.newUsers,
            new_listings: insights.growthSummary.newListings,
            revenue: insights.revenueEstimate,
            warnings_count: insights.warnings.length
          },
          email_sent: emailSent,
          generated_at: new Date().toISOString()
        }
      });

    return new Response(JSON.stringify({
      success: true,
      insights,
      ai_summary: aiSummary,
      email_sent: emailSent,
      message: 'Weekly insights generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error generating weekly insights:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error?.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});