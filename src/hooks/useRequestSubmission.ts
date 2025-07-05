
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { checkAntiSpam, triggerNotification, triggerAiReview } from "@/utils/antiSpam";
import { RequestFormData } from "@/components/RequestForm/RequestFormData";
import type { Database } from "@/integrations/supabase/types";

type RequestStatus = Database['public']['Enums']['request_status'];

export const useRequestSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [aiReviewing, setAiReviewing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const createRequest = async (
    formData: RequestFormData,
    photo: File | null,
    status: RequestStatus = 'pending'
  ) => {
    if (!user) throw new Error("User not authenticated");

    // Upload photo if provided
    let photoUrl = null;
    if (photo) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('part-photos')
        .upload(fileName, photo);

      if (uploadError) {
        console.error('Photo upload error:', uploadError);
        toast({
          title: "Photo Upload Failed",
          description: "We couldn't upload your photo, but we'll still process your request.",
          variant: "destructive"
        });
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('part-photos')
          .getPublicUrl(fileName);
        photoUrl = publicUrl;
      }
    }

    const { data: request, error } = await supabase
      .from('part_requests')
      .insert([
        {
          owner_id: user.id,
          car_make: formData.make,
          car_model: formData.model,
          car_year: parseInt(formData.year),
          part_needed: formData.part,
          description: formData.description,
          location: formData.location,
          phone: formData.phone,
          photo_url: photoUrl,
          status: status
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return request;
  };

  const submitRequest = async (formData: RequestFormData, photo: File | null) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a part request.",
        variant: "destructive"
      });
      navigate('/auth');
      return { success: false };
    }

    setLoading(true);
    
    try {
      // Anti-spam check
      const spamCheck = await checkAntiSpam(
        formData.phone,
        user.id,
        {
          car_make: formData.make,
          car_model: formData.model,
          part_needed: formData.part,
          description: formData.description
        }
      );

      if (!spamCheck.allowed) {
        // If it requires review, show AI review UI and process
        if (spamCheck.requiresReview) {
          setAiReviewing(true);
          toast({
            title: "Request Under Review",
            description: "Our AI is reviewing your request for approval...",
          });

          // Create request with pending status
          const requestData = await createRequest(formData, photo, 'pending');
          if (requestData) {
            // Trigger AI review
            const aiApproved = await triggerAiReview(requestData.id);
            setAiReviewing(false);
            
            if (aiApproved) {
              toast({
                title: "Request Approved!",
                description: "Your request has been approved and sellers are being notified.",
              });
              await triggerNotification('new_request', { requestId: requestData.id });
              return { success: true };
            } else {
              toast({
                title: "Request Needs Review",
                description: "Your request is being reviewed by our team. You'll be notified once approved.",
                variant: "destructive"
              });
              return { success: true };
            }
          }
        } else {
          toast({
            title: "Request Blocked",
            description: spamCheck.message || "Your request was blocked by our spam filter.",
            variant: "destructive"
          });
        }
        return { success: false };
      }

      // Normal flow for approved requests
      const requestData = await createRequest(formData, photo, 'pending');
      if (requestData) {
        await triggerNotification('new_request', { requestId: requestData.id });
        toast({
          title: "Request Submitted!",
          description: "We're notifying sellers in your area. You'll hear from them soon.",
        });
        return { success: true };
      }
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
      setAiReviewing(false);
    }

    return { success: false };
  };

  return {
    loading,
    aiReviewing,
    submitRequest
  };
};
