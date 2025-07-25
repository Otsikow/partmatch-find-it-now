import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QualityCheckRequest {
  listingId: string;
  title: string;
  description?: string;
  images?: string[];
  price: number;
  supplier_id: string;
}

interface QualityCheckResult {
  score: number;
  approved: boolean;
  issues: string[];
  feedback: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Rate limiting and duplicate checking functions (adapted from anti-spam)
async function checkRateLimit(userId: string) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const { data: recentListings, error } = await supabase
    .from('car_parts')
    .select('id')
    .eq('supplier_id', userId)
    .gte('created_at', oneHourAgo.toISOString());

  if (error) {
    console.error("Error checking rate limit:", error);
    return { exceeded: false, waitTime: 0 };
  }

  const limit = 10; // Max 10 listings per hour per user
  if ((recentListings?.length || 0) >= limit) {
    return { exceeded: true, waitTime: 60 };
  }

  return { exceeded: false, waitTime: 0 };
}

async function checkDuplicateListings(userId: string, title: string) {
  const { data: existingListings, error } = await supabase
    .from('car_parts')
    .select('id')
    .eq('supplier_id', userId)
    .eq('title', title)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    console.error("Error checking duplicate listings:", error);
    return { isDuplicate: false };
  }

  return { isDuplicate: (existingListings?.length || 0) > 0 };
}

function checkTitle(title: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const wordCount = title.trim().split(/\s+/).length;
  if (wordCount < 3) {
    issues.push('Title is too short (less than 3 words)');
  }
  
  const suspiciousKeywords = [
    'urgent payment', 'whatsapp only', 'no call', 'urgent sale',
    'contact only whatsapp', 'cash only urgent', 'quick sale only',
    'test', 'spam', 'fake', 'bot'
  ];
  
  const titleLower = title.toLowerCase();
  suspiciousKeywords.forEach(keyword => {
    if (titleLower.includes(keyword)) {
      issues.push(`Suspicious keyword detected: "${keyword}"`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function checkDescription(description?: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!description || description.trim().length === 0) {
    issues.push('Description is missing');
    return { valid: false, issues };
  }
  
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount < 15) {
    issues.push('Description is too short (less than 15 words)');
  }
  
  const suspiciousPatterns = [
    'urgent payment', 'whatsapp only', 'no call', 'contact whatsapp',
    'payment first', 'send money', 'western union', 'moneygram'
  ];
  
  const descLower = description.toLowerCase();
  suspiciousPatterns.forEach(pattern => {
    if (descLower.includes(pattern)) {
      issues.push(`Suspicious pattern detected: "${pattern}"`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function checkImages(images?: string[]): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!images || images.length === 0) {
    issues.push('No image uploaded');
    return { valid: false, issues };
  }
  
  if (images.length < 1) {
    issues.push('At least one clear image is required');
  }
  
  return { valid: issues.length === 0, issues };
}

function checkPrice(price: number): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (price <= 0) {
    issues.push('Price is set to 0 or invalid');
  }
  
  if (price < 1) {
    issues.push('Price seems unrealistically low');
  } else if (price > 150000) {
    issues.push('Price seems unrealistically high');
  }
  
  return { valid: issues.length === 0, issues };
}

function calculateQualityScore(
  titleValid: boolean,
  descValid: boolean,
  imagesValid: boolean,
  priceValid: boolean
): number {
  let score = 0;
  if (titleValid) score += 30;
  if (descValid) score += 35;
  if (imagesValid) score += 25;
  if (priceValid) score += 10;
  return score;
}

function generateFeedback(issues: string[]): string {
  if (issues.length === 0) {
    return "Your listing meets all quality standards and has been approved automatically.";
  }
  
  const baseFeedback = "Please improve your listing to meet our quality standards:\n\n";
  const issueList = issues.map(issue => `• ${issue}`).join('\n');
  const guidelines = "\n\nGuidelines:\n• Add clear images with good lighting\n• Write detailed descriptions (minimum 15 words)\n• Use realistic pricing\n• Avoid suspicious words like 'urgent payment' or 'WhatsApp only'";
  
  return baseFeedback + issueList + guidelines;
}

async function performQualityCheck(request: QualityCheckRequest): Promise<QualityCheckResult> {
  console.log(`Starting quality check for listing: ${request.listingId}`);
  
  const titleCheck = checkTitle(request.title);
  const descCheck = checkDescription(request.description);
  const imagesCheck = checkImages(request.images);
  const priceCheck = checkPrice(request.price);
  
  const allIssues = [
    ...titleCheck.issues,
    ...descCheck.issues,
    ...imagesCheck.issues,
    ...priceCheck.issues
  ];
  
  const score = calculateQualityScore(
    titleCheck.valid,
    descCheck.valid,
    imagesCheck.valid,
    priceCheck.valid
  );
  
  const approved = score >= 80 && allIssues.length === 0;
  const feedback = generateFeedback(allIssues);
  
  console.log(`Quality check completed - Score: ${score}, Approved: ${approved}, Issues: ${allIssues.length}`);
  
  return {
    score,
    approved,
    issues: allIssues,
    feedback
  };
}

async function createAdminNotification(listingId: string, qualityResult: QualityCheckResult) {
    const { error: adminNotificationError } = await supabase
        .from('admin_notifications')
        .insert({
            type: 'low_quality_listing',
            message: `Listing ${listingId} flagged with score ${qualityResult.score}. Issues: ${qualityResult.issues.join(', ')}`,
            metadata: {
                listing_id: listingId,
                quality_score: qualityResult.score,
                issues: qualityResult.issues
            }
        });

    if (adminNotificationError) {
        console.error('Failed to create admin notification:', adminNotificationError);
    }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId, title, description, images, price, supplier_id }: QualityCheckRequest = await req.json();
    
    console.log(`Processing quality check request for listing: ${listingId}`);

    // Anti-spam checks
    const rateLimit = await checkRateLimit(supplier_id);
    if (rateLimit.exceeded) {
      return new Response(JSON.stringify({ success: false, error: `Rate limit exceeded. Try again in ${rateLimit.waitTime} minutes.` }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const duplicateCheck = await checkDuplicateListings(supplier_id, title);
    if (duplicateCheck.isDuplicate) {
      return new Response(JSON.stringify({ success: false, error: 'A similar listing has been posted recently.' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Perform quality check
    const qualityResult = await performQualityCheck({
      listingId,
      title,
      description,
      images,
      price,
      supplier_id
    });
    
    // Update car_parts table
    const newStatus = qualityResult.approved ? 'available' : 'pending_fix';
    const { error: updateError } = await supabase
      .from('car_parts')
      .update({
        status: newStatus,
        quality_score: qualityResult.score,
        quality_feedback: qualityResult.feedback,
        quality_checked_at: new Date().toISOString()
      })
      .eq('id', listingId);
    
    if (updateError) {
      console.error('Failed to update car_parts:', updateError);
      throw updateError;
    }
    
    // Insert quality check record
    const { error: insertError } = await supabase
      .from('listing_quality_checks')
      .insert({
        listing_id: listingId,
        quality_score: qualityResult.score,
        feedback_message: qualityResult.feedback,
        flagged_issues: qualityResult.issues,
        auto_approved: qualityResult.approved
      });
    
    if (insertError) {
      console.error('Failed to insert quality check:', insertError);
      throw insertError;
    }
    
    // Trigger AI review if not auto-approved
    if (!qualityResult.approved) {
      await supabase.functions.invoke('ai-listing-review', {
        body: { listingId }
      });
    }

    // Send notification to seller and admin
    if (!qualityResult.approved) {
        await supabase
            .from('user_notifications')
            .insert({
                user_id: supplier_id,
                type: 'listing_quality_issue',
                title: 'Listing Needs Improvement',
                message: qualityResult.feedback,
                metadata: {
                    listing_id: listingId,
                    quality_score: qualityResult.score,
                    issues: qualityResult.issues
                }
            });

        // Create a notification for the admin dashboard
        await createAdminNotification(listingId, qualityResult);
    }
    
    console.log(`Quality check completed successfully for listing: ${listingId}`);
    
    return new Response(JSON.stringify({
      success: true,
      result: qualityResult,
      status: newStatus
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error: any) {
    console.error('Error in listing-quality-checker function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);