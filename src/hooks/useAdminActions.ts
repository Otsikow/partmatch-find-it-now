import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAdminActions = (refetchData: () => void) => {
  const handleMatchSupplier = async (requestId: string) => {
    try {
      console.log('🔧 ADMIN DEBUG: Starting handleMatchSupplier for request:', requestId);
      
      // Check current user authentication and admin privileges
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('🔧 ADMIN DEBUG: Current user for handleMatchSupplier:', user?.email, 'ID:', user?.id);
      
      if (userError || !user) {
        console.error('🔧 ADMIN DEBUG: Auth error in handleMatchSupplier:', userError);
        throw new Error('Not authenticated');
      }
      
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
      
      // Update request status
      const { error: requestError } = await supabase
        .from('part_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (requestError) {
        console.error('Error completing request:', requestError);
        throw requestError;
      }

      // Mark related offers as transaction completed for rating eligibility
      const { error: offerError } = await supabase
        .from('offers')
        .update({ 
          transaction_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('request_id', requestId)
        .eq('status', 'accepted');

      if (offerError) {
        console.error('Error updating offer completion status:', offerError);
        throw offerError;
      }

      console.log('Successfully completed request and marked offers for rating');

      // Refresh data
      await refetchData();
      
      toast({
        title: "Transaction Completed!",
        description: "The transaction has been marked as complete. Buyers can now rate the seller.",
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

      // 1. First, get the verification details to get the user_id
      const { data: verification, error: fetchVerificationError } = await supabase
        .from('seller_verifications')
        .select('user_id, full_name, seller_type')
        .eq('id', verificationId)
        .single();

      if (fetchVerificationError) {
        console.error('Error fetching verification:', fetchVerificationError);
        throw fetchVerificationError;
      }

      if (!verification) {
        throw new Error('Verification not found.');
      }

      console.log('Processing verification for user:', verification.user_id);

      // 2. Update the verification status
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

      console.log('Successfully updated verification status to:', status);

      // 3. If approved, update the user's profile
      if (action === 'approve') {
        console.log('Updating user profile to verified for user:', verification.user_id);

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_verified: true,
            user_type: verification.seller_type === 'Individual' ? 'owner' : 'supplier',
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', verification.user_id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw profileError;
        }

        console.log('Successfully updated user profile to verified');
      }

      toast({
        title: `Verification ${action === 'approve' ? 'Approved' : 'Rejected'}!`,
        description: `The seller verification has been ${status}.`,
      });

      // Comprehensive data refresh
      await refetchData();
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
        .createSignedUrl(documentUrl, 3600);
        
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
      console.log('Approving user:', userId);

      const { data: user, error: fetchError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "User Approved!",
        description: `The ${user?.user_type ?? 'user'} has been successfully verified.`,
      });

      await refetchData();
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSuspendUser = async (userId: string, reason: string) => {
    try {
      console.log('🔧 ADMIN DEBUG: Suspending user:', userId, 'Reason:', reason);
      
      // Check current user authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('🔧 ADMIN DEBUG: Auth error in handleSuspendUser:', userError);
        throw new Error('Not authenticated');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_blocked: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('🔧 ADMIN DEBUG: Error suspending user:', error);
        throw error;
      }

      console.log('🔧 ADMIN DEBUG: Successfully suspended user');

      toast({
        title: "User Suspended!",
        description: "The user has been suspended.",
      });

      await refetchData();
      
    } catch (error: any) {
      console.error('🔧 ADMIN DEBUG: Error suspending user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to suspend user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string, reason: string) => {
    try {
      console.log('🔧 ADMIN DEBUG: Deleting user:', userId, 'Reason:', reason);
      
      // Get current user auth token for the edge function
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error('🔧 ADMIN DEBUG: Auth session error:', sessionError);
        throw new Error('Authentication required');
      }

      console.log('🔧 ADMIN DEBUG: Calling delete-user edge function with token');
      
      // Call the delete user edge function with proper authentication
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('🔧 ADMIN DEBUG: Edge function error:', error);
        throw error;
      }

      console.log('🔧 ADMIN DEBUG: Successfully deleted user, response:', data);

      toast({
        title: "User Deleted!",
        description: "The user account has been permanently deleted.",
      });

      await refetchData();
      
    } catch (error: any) {
      console.error('🔧 ADMIN DEBUG: Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      console.log('🔧 ADMIN DEBUG: Unblocking user:', userId);
      
      // Check current user authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('🔧 ADMIN DEBUG: Auth error in handleUnblockUser:', userError);
        throw new Error('Not authenticated');
      }
      
      console.log('🔧 ADMIN DEBUG: Current admin user ID:', user.id);
      
      // Check if current user is admin
      const { data: adminProfile, error: adminError } = await supabase
        .from('profiles')
        .select('user_type, id')
        .eq('id', user.id)
        .single();
      
      console.log('🔧 ADMIN DEBUG: Admin profile:', adminProfile);
      
      if (adminError || !adminProfile || adminProfile.user_type !== 'admin') {
        console.error('🔧 ADMIN DEBUG: Admin check failed:', adminError);
        throw new Error('Unauthorized: Not an admin');
      }
      
      console.log('🔧 ADMIN DEBUG: Attempting to unblock user:', userId);
      
      // Check if this is an orphaned profile first
      const { data: isOrphaned } = await supabase.rpc('is_orphaned_profile', {
        profile_id: userId
      });
      
      if (isOrphaned) {
        console.log('🔧 ADMIN DEBUG: Detected orphaned profile, cleaning up:', userId);
        
        // Clean up the orphaned profile
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (deleteError) {
          console.error('🔧 ADMIN DEBUG: Error cleaning up orphaned profile:', deleteError);
          throw new Error('Failed to clean up orphaned profile: ' + deleteError.message);
        }
        
        toast({
          title: "Orphaned Profile Cleaned Up",
          description: "The user profile was orphaned (auth account already deleted) and has been removed.",
        });
        
        await refetchData();
        return;
      }
      
      // First check if user profile exists
      const { data: targetUser, error: targetUserError } = await supabase
        .from('profiles')
        .select('id, is_blocked')
        .eq('id', userId)
        .maybeSingle();
      
      if (targetUserError) {
        console.error('🔧 ADMIN DEBUG: Error checking target user:', targetUserError);
        throw new Error('Failed to check user profile: ' + targetUserError.message);
      }
      
      if (!targetUser) {
        throw new Error('User profile not found');
      }
      
      if (!targetUser.is_blocked) {
        toast({
          title: "User Not Blocked",
          description: "This user is not currently blocked.",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_blocked: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('🔧 ADMIN DEBUG: Error unblocking user:', error);
        throw error;
      }

      console.log('🔧 ADMIN DEBUG: Successfully unblocked user');

      toast({
        title: "User Unblocked!",
        description: "The user has been unblocked successfully.",
      });

      await refetchData();
      
    } catch (error: any) {
      console.error('🔧 ADMIN DEBUG: Error unblocking user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to unblock user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCleanupOrphanedProfiles = async () => {
    try {
      console.log('🔧 ADMIN DEBUG: Cleaning up orphaned profiles');
      
      const { data: deletedProfiles, error } = await supabase.rpc('cleanup_orphaned_profiles');
      
      if (error) {
        console.error('🔧 ADMIN DEBUG: Error cleaning up orphaned profiles:', error);
        throw error;
      }
      
      const count = deletedProfiles?.length || 0;
      
      toast({
        title: "Cleanup Complete",
        description: `Removed ${count} orphaned profile(s) that had no corresponding auth accounts.`,
      });
      
      if (count > 0) {
        await refetchData();
      }
      
    } catch (error: any) {
      console.error('🔧 ADMIN DEBUG: Error cleaning up orphaned profiles:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to clean up orphaned profiles.",
        variant: "destructive"
      });
    }
  };

  const handleViewUserDetails = (user: any) => {
    // This function will be handled by the AdminDashboard component
    console.log("🔧 ADMIN DEBUG: Viewing user details:", user);
  };

  return {
    handleMatchSupplier,
    handleCompleteRequest,
    handleVerificationAction,
    viewDocument,
    handleApproveUser,
    handleSuspendUser,
    handleDeleteUser,
    handleUnblockUser,
    handleViewUserDetails,
    handleCleanupOrphanedProfiles
  };
};
