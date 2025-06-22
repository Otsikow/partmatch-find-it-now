
import { supabase } from '@/integrations/supabase/client';

export interface SpamCheckResult {
  allowed: boolean;
  reason?: string;
  message?: string;
}

export const checkAntiSpam = async (
  phone: string,
  userId: string,
  requestData: any
): Promise<SpamCheckResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('anti-spam', {
      body: {
        phone,
        userId,
        requestData
      }
    });

    if (error) {
      console.error('Anti-spam check error:', error);
      return { allowed: true }; // Allow if check fails
    }

    return data;
  } catch (error) {
    console.error('Anti-spam check failed:', error);
    return { allowed: true }; // Allow if check fails
  }
};

export const triggerNotification = async (
  type: 'new_request' | 'new_offer' | 'payment_confirmed' | 'status_update',
  params: {
    requestId?: string;
    offerId?: string;
    userId?: string;
    customMessage?: string;
  }
) => {
  try {
    await supabase.functions.invoke('send-notifications', {
      body: {
        type,
        ...params
      }
    });
  } catch (error) {
    console.error('Failed to trigger notification:', error);
  }
};
