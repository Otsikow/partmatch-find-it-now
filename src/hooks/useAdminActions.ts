import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAdminActions = (refetchData: () => void) => {
  const handleMatchSupplier = async (requestId: string) => {
    try {
      console.log('Accepting offer for request:', requestId);
      
      // Find the related offer
      const { data: offers } = await supabase
        .from('offers')
        .select('*')
        .eq('request_id', requestId);

      const relatedOffer = offers?.[0];
      if (!relatedOffer) {
        toast({
          title: "Error",
          description: "No offer found for this request.",
          variant: "destructive"
        });
        return;
      }

      console.log('Found related offer:', relatedOffer.id);

      // Update offer status to accepted and unlock contact
      const { error: offerError } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          contact_unlocked: true
        })
        .eq('id', relatedOffer.id);

      if (offerError) {
        console.error('Error updating offer:', offerError);
        throw offerError;
      }

      // Update request status to matched (offer_received in database)
      const { error: requestError } = await supabase
        .from('part_requests')
        .update({ status: 'offer_received' })
        .eq('id', requestId);

      if (requestError) {
        console.error('Error updating request:', requestError);
        throw requestError;
      }

      console.log('Successfully updated offer and request status');

      // Refresh data to show updated status
      await refetchData();
      
      toast({
        title: "Offer Accepted!",
        description: "The offer has been accepted and both parties have been notified.",
      });
    } catch (error: any) {
      console.error('Error accepting offer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept offer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      console.log('Completing request:', requestId);
      
      const { error } = await supabase
        .from('part_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (error) {
        console.error('Error completing request:', error);
        throw error;
      }

      console.log('Successfully completed request');

      // Refresh data
      await refetchData();
      
      toast({
        title: "Request Completed!",
        description: "The transaction has been marked as complete.",
      });
    } catch (error: any) {
      console.error('Error completing request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVerificationAction = async (
    verificationId: string,
    action: 'approve' | 'reject',
    notes?: string
  ) => {
    try {
      console.log(`${action === 'approve' ? 'Approving' : 'Rejecting'} verification:`, verificationId);

      // 1. Update the verification status
      const status = action === 'approve' ? 'approved' : 'rejected';
      const { error: verificationError } = await supabase
        .from('seller_verifications')
        .update({
          verification_status: status,
          admin_notes: notes || null,
          verified_at: action === 'approve' ? new Date().toISOString() : null,
          verified_by: action === 'approve' ? (await supabase.auth.getUser()).data.user?.id : null
        })
        .eq('id', verificationId);

      if (verificationError) {
        console.error('Error updating verification:', verificationError);
        throw verificationError;
      }

      console.log('Successfully updated verification status');

      // 2. If approved, update the related profile as verified
      if (action === 'approve') {
        // Fetch the verification to get the user_id
        const { data: verification, error: fetchVerificationError } = await supabase
          .from('seller_verifications')
          .select('user_id')
          .eq('id', verificationId)
          .maybeSingle();

        if (fetchVerificationError) {
          console.error('Error fetching verification:', fetchVerificationError);
          throw fetchVerificationError;
        }
        if (!verification) {
          throw new Error('Verification not found.');
        }

        console.log('Updating user profile to verified:', verification.user_id);

        // Now update the user's profile as verified
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_verified: true,
            verified_at: new Date().toISOString()
          })
          .eq('id', verification.user_id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw profileError;
        }
        console.log('Seller profile marked as verified:', verification.user_id);
      }

      // 3. Refresh data/UI
      await refetchData();

      toast({
        title: `Verification ${action === 'approve' ? 'Approved' : 'Rejected'}!`,
        description: `The seller verification has been ${status}.`,
      });
    } catch (error: any) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update verification. Please try again.",
        variant: "destructive"
      });
    }
  };

  const viewDocument = async (documentUrl: string) => {
    if (!documentUrl) {
      toast({
        title: "Error",
        description: "Document URL not found.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('Creating signed URL for document:', documentUrl);
      
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .createSignedUrl(documentUrl, 3600); // 1 hour expiry
        
      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }
        
      if (data?.signedUrl) {
        console.log('Opening document:', data.signedUrl);
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error('Failed to generate signed URL');
      }
    } catch (error: any) {
      console.error('Error creating signed URL:', error);
      toast({
        title: "Error",
        description: "Failed to load document.",
        variant: "destructive"
      });
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      console.log('Starting user approval process for:', userId);
      
      // First, get current user data to log the change
      const { data: currentUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current user:', fetchError);
        throw fetchError;
      }
      
      console.log('Current user status before approval:', {
        is_verified: currentUser.is_verified,
        user_type: currentUser.user_type,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name
      });

      // Update the user profile to mark as verified
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        throw updateError;
      }

      console.log('Successfully updated user profile for userId:', userId);

      toast({
        title: "Success",
        description: "User has been approved successfully.",
      });

      // Force a complete data refresh
      console.log('Refreshing data after user approval...');
      await refetchData();
      
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSuspendUser = async (userId: string, reason: string) => {
    try {
      console.log('Suspending user:', userId, 'Reason:', reason);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_blocked: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error suspending user:', error);
        throw error;
      }

      console.log('Successfully suspended user');

      // Refresh data
      await refetchData();
      
      toast({
        title: "User Suspended!",
        description: "The user has been suspended.",
      });
    } catch (error: any) {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to suspend user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string, reason: string) => {
    try {
      console.log('Deleting user:', userId, 'Reason:', reason);
      
      // Call the delete user edge function
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      console.log('Successfully deleted user');

      // Refresh data
      await refetchData();
      
      toast({
        title: "User Deleted!",
        description: "The user account has been permanently deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      console.log('Unblocking user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_blocked: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error unblocking user:', error);
        throw error;
      }

      console.log('Successfully unblocked user');

      // Refresh data
      await refetchData();
      
      toast({
        title: "User Unblocked!",
        description: "The user has been unblocked.",
      });
    } catch (error: any) {
      console.error('Error unblocking user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to unblock user. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    handleMatchSupplier,
    handleCompleteRequest,
    handleVerificationAction,
    viewDocument,
    handleApproveUser,
    handleSuspendUser,
    handleDeleteUser,
    handleUnblockUser
  };
};
