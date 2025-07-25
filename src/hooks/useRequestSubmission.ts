
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { checkAntiSpam, triggerNotification, triggerAiReview } from "@/utils/antiSpam";

// Function to trigger smart match notifications
const triggerSmartMatchNotification = async (requestId: string) => {
  try {
    const response = await supabase.functions.invoke('smart-match-notification', {
      body: { requestId }
    });
    
    if (response.error) {
      console.error('Smart match notification error:', response.error);
    } else {
      console.log('Smart match notifications sent:', response.data);
    }
  } catch (error) {
    console.error('Failed to trigger smart match notification:', error);
  }
};
import { RequestFormData } from "@/components/RequestForm/RequestFormData";
import type { Database } from "@/integrations/supabase/types";

type RequestStatus = Database['public']['Enums']['request_status'];

export const useRequestSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [aiReviewing, setAiReviewing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const createOrSignInUser = async (formData: RequestFormData) => {
    const { email, name, phone, location } = formData;
    
    // Check if user already exists by trying to get their profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingProfile) {
      // User already exists, send them a magic link to sign in
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (magicLinkError) {
        throw magicLinkError;
      }

      toast({
        title: "Welcome back!",
        description: "Check your email for a sign-in link. We'll process your request in the meantime.",
      });

      // Return the existing user ID for request creation
      return { id: existingProfile.id, email };
    }

    // User doesn't exist, create new account with a secure random password
    const securePassword = crypto.randomUUID();
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password: securePassword,
      options: {
        data: {
          first_name: name.split(' ')[0] || '',
          last_name: name.split(' ').slice(1).join(' ') || '',
          phone: phone,
          location: location,
          user_type: 'owner'
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    if (newUser?.user) {
      toast({
        title: "Welcome to PartMatch!",
        description: "Your account has been created. Check your email for setup instructions.",
      });
      
      return newUser.user;
    }

    throw new Error("Failed to create user account");
  };

  const createRequest = async (
    formData: RequestFormData,
    photo: File | null,
    userId: string,
    status: RequestStatus = 'pending'
  ) => {
    // Upload photo if provided
    let photoUrl = null;
    if (photo) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
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
          owner_id: userId,
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
    setLoading(true);
    
    try {
      // Create or sign in user first
      const currentUser = user || await createOrSignInUser(formData);
      
      if (!currentUser) {
        throw new Error("Failed to create or sign in user");
      }

      // Anti-spam check
      const spamCheck = await checkAntiSpam(
        formData.phone,
        currentUser.id,
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
          const requestData = await createRequest(formData, photo, currentUser.id, 'pending');
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
              await triggerSmartMatchNotification(requestData.id);
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
      const requestData = await createRequest(formData, photo, currentUser.id, 'pending');
      if (requestData) {
        await triggerNotification('new_request', { requestId: requestData.id });
        await triggerSmartMatchNotification(requestData.id);
        toast({
          title: "Request Submitted Successfully!",
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
