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

function checkTitle(title: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check title length (must be at least 4 words)
  const wordCount = title.trim().split(/\s+/).length;
  if (wordCount < 4) {
    issues.push('Title is too short (less than 4 words)');
  }
  
  // Check for suspicious keywords
  const suspiciousKeywords = [
    'urgent payment', 'whatsapp only', 'no call', 'urgent sale',
    'contact only whatsapp', 'cash only urgent', 'quick sale only'
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
  
  // Check word count (must be at least 20 words)
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount < 20) {
    issues.push('Description is too short (less than 20 words)');
  }
  
  // Check for suspicious patterns
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
  
  // Basic image validation (could be enhanced with actual image analysis)
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
  
  // Check for unrealistic prices (too low or suspiciously high)
  if (price < 1) {
    issues.push('Price seems unrealistically low');
  } else if (price > 100000) {
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
  
  // Title: 30 points
  if (titleValid) score += 30;
  
  // Description: 35 points
  if (descValid) score += 35;
  
  // Images: 25 points
  if (imagesValid) score += 25;
  
  // Price: 10 points
  if (priceValid) score += 10;
  
  return score;
}

function generateFeedback(issues: string[]): string {
  if (issues.length === 0) {
    return "Your listing meets all quality standards and has been approved automatically.";
  }
  
  const baseFeedback = "Please improve your listing to meet our quality standards:\n\n";
  const issueList = issues.map(issue => `• ${issue}`).join('\n');
  const guidelines = "\n\nGuidelines:\n• Add clear images with good lighting\n• Write detailed descriptions (minimum 20 words)\n• Use realistic pricing\n• Avoid suspicious words like 'urgent payment' or 'WhatsApp only'";
  
  return baseFeedback + issueList + guidelines;
}

async function performQualityCheck(request: QualityCheckRequest): Promise<QualityCheckResult> {
  console.log(`Starting quality check for listing: ${request.listingId}`);
  
  // Perform individual checks
  const titleCheck = checkTitle(request.title);
  const descCheck = checkDescription(request.description);
  const imagesCheck = checkImages(request.images);
  const priceCheck = checkPrice(request.price);
  
  // Combine all issues
  const allIssues = [
    ...titleCheck.issues,
    ...descCheck.issues,
    ...imagesCheck.issues,
    ...priceCheck.issues
  ];
  
  // Calculate quality score
  const score = calculateQualityScore(
    titleCheck.valid,
    descCheck.valid,
    imagesCheck.valid,
    priceCheck.valid
  );
  
  // Determine if listing should be auto-approved (score >= 85)
  const approved = score >= 85 && allIssues.length === 0;
  
  // Generate feedback
  const feedback = generateFeedback(allIssues);
  
  console.log(`Quality check completed - Score: ${score}, Approved: ${approved}, Issues: ${allIssues.length}`);
  
  return {
    score,
    approved,
    issues: allIssues,
    feedback
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId, title, description, images, price }: QualityCheckRequest = await req.json();
    
    console.log(`Processing quality check request for listing: ${listingId}`);
    
    // Perform quality check
    const qualityResult = await performQualityCheck({
      listingId,
      title,
      description,
      images,
      price
    });
    
    // Update the car_parts table with quality results
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
    
    // Send notification to the seller if listing needs fixes
    if (!qualityResult.approved) {
      // Get seller info
      const { data: listing } = await supabase
        .from('car_parts')
        .select('supplier_id')
        .eq('id', listingId)
        .single();
      
      if (listing) {
        await supabase
          .from('user_notifications')
          .insert({
            user_id: listing.supplier_id,
            type: 'listing_quality_issue',
            title: 'Listing Needs Improvement',
            message: qualityResult.feedback,
            metadata: {
              listing_id: listingId,
              quality_score: qualityResult.score,
              issues: qualityResult.issues
            }
          });
      }
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