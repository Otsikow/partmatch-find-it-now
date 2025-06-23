
import { supabase } from '@/integrations/supabase/client';

interface SpamCheckResult {
  allowed: boolean;
  message?: string;
  requiresReview?: boolean;
}

interface RequestContent {
  car_make: string;
  car_model: string;
  part_needed: string;
  description?: string;
}

export const checkAntiSpam = async (
  phone: string,
  userId: string,
  content: RequestContent
): Promise<SpamCheckResult> => {
  try {
    // Call the anti-spam edge function
    const { data, error } = await supabase.functions.invoke('anti-spam', {
      body: {
        phone,
        userId,
        content
      }
    });

    if (error) {
      console.error('Anti-spam check error:', error);
      return {
        allowed: false,
        message: 'Security check failed. Please try again.'
      };
    }

    // If the request is flagged for review, trigger AI review
    if (!data.allowed && data.requiresReview) {
      console.log('Request flagged for review, triggering AI review...');
      return {
        allowed: false,
        message: 'Your request is being reviewed by our AI system. This may take a moment...',
        requiresReview: true
      };
    }

    return {
      allowed: data.allowed,
      message: data.message
    };

  } catch (error) {
    console.error('Anti-spam error:', error);
    return {
      allowed: false,
      message: 'Security check failed. Please try again.'
    };
  }
};

export const triggerAiReview = async (requestId: string): Promise<boolean> => {
  try {
    console.log('Triggering AI review for request:', requestId);
    
    const { data, error } = await supabase.functions.invoke('ai-review', {
      body: { requestId }
    });

    if (error) {
      console.error('AI review error:', error);
      return false;
    }

    console.log('AI review result:', data);
    return data.approved;

  } catch (error) {
    console.error('AI review trigger error:', error);
    return false;
  }
};

export const triggerNotification = async (type: string, data: any) => {
  try {
    const { error } = await supabase.functions.invoke('send-notifications', {
      body: { type, data }
    });

    if (error) {
      console.error('Notification error:', error);
    }
  } catch (error) {
    console.error('Notification trigger error:', error);
  }
};
