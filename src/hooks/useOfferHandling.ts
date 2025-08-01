
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Request {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  location: string;
  phone: string;
  description?: string;
  status: string;
  created_at: string;
}

interface OfferRequest {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  phone: string;
  location: string;
}

export const useOfferHandling = (onOfferSubmitted?: () => void) => {
  const { user, userType } = useAuth();
  const [submittingOffer, setSubmittingOffer] = useState<string | null>(null);

  const retryWithBackoff = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        const isLastAttempt = i === retries - 1;
        const isRetryableError = 
          error.message?.includes('503') || 
          error.message?.includes('timeout') || 
          error.message?.includes('upstream connect error') ||
          error.code === 'PGRST301';

        console.log(`useOfferHandling: Attempt ${i + 1}/${retries} failed:`, error.message);

        if (isLastAttempt || !isRetryableError) {
          throw error;
        }

        // Exponential backoff: wait 1s, 2s, 4s
        const waitTime = Math.min(1000 * Math.pow(2, i), 8000);
        console.log(`useOfferHandling: Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  };

  const handleMakeOffer = async (requestId: string, price: number, message: string, location: string) => {
    setSubmittingOffer(requestId);

    try {
      console.log('useOfferHandling: Submitting offer for request:', requestId, {
        supplier_id: user?.id,
        price,
        message,
        location
      });

      await retryWithBackoff(async () => {
        const { error } = await supabase
          .from('offers')
          .insert({
            request_id: requestId,
            supplier_id: user?.id,
            price: price,
            message: message || null,
            contact_unlock_fee: 5.00
          });

        if (error) {
          console.error('useOfferHandling: Database error:', error);
          throw error;
        }
      });

      console.log('useOfferHandling: Offer submitted successfully');
      toast({
        title: "Offer Submitted!",
        description: "Your offer has been sent to the customer.",
      });

      // Refresh offers
      if (onOfferSubmitted) {
        onOfferSubmitted();
      }
    } catch (error: any) {
      console.error('useOfferHandling: Error making offer:', error);
      
      const isServiceUnavailable = 
        error.message?.includes('503') || 
        error.message?.includes('timeout') || 
        error.message?.includes('upstream connect error');
      
      toast({
        title: "Submission Failed",
        description: isServiceUnavailable 
          ? "Service temporarily unavailable. Please check your connection and try again."
          : error.message || "Failed to submit offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingOffer(null);
    }
  };

  const handleWhatsAppContact = (phone: string, request: Request | OfferRequest) => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to whatsapp the buyer.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has proper role (supplier or admin)
    if (!userType || (userType !== 'supplier' && userType !== 'admin')) {
      toast({
        title: "Access restricted",
        description: "Only sellers and admins can whatsapp buyers.",
        variant: "destructive",
      });
      return;
    }

    const message = `Hi! I have the ${request.part_needed} for your ${request.car_make} ${request.car_model} ${request.car_year}. Let's discuss!`;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    submittingOffer,
    handleMakeOffer,
    handleWhatsAppContact,
    isSubmittingOffer: submittingOffer !== null
  };
};
