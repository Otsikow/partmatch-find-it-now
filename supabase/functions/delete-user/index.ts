
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Delete user function called');
    
    // Get the authorization header to verify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the userId to delete from the request body
    const { userId } = await req.json();
    if (!userId) {
      console.error('No userId provided in request body');
      return new Response(
        JSON.stringify({ error: 'User ID to delete is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a client with the service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create a client with the anon key to verify the user's token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify the admin's identity
    const { data: { user: adminUser }, error: adminUserError } = await supabase.auth.getUser();
    
    if (adminUserError || !adminUser) {
      console.error('Admin user verification failed:', adminUserError);
      return new Response(
        JSON.stringify({ error: 'Invalid admin token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Ensure the authenticated user is an admin
    const { data: adminProfile, error: adminProfileError } = await supabaseAdmin
      .from('profiles')
      .select('user_type')
      .eq('id', adminUser.id)
      .single();

    if (adminProfileError || !adminProfile || adminProfile.user_type !== 'admin') {
      console.error('Admin role check failed:', adminProfileError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Not an admin' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Prevent admin from deleting themselves
    if (adminUser.id === userId) {
      console.error('Admin cannot delete themselves');
      return new Response(
        JSON.stringify({ error: 'Admin cannot delete themselves' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Admin ${adminUser.id} is deleting user: ${userId}`);

    // Clean up related records that would prevent user deletion
    console.log('Cleaning up related records...');
    
    try {
      // Delete all records that reference this user (in order of dependencies)
      
      // 1. Delete messages first (they reference chats)
      const { error: messagesError } = await supabaseAdmin
        .from('messages')
        .delete()
        .eq('sender_id', userId);
      
      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
      }

      // 2. Delete chats where user is buyer or seller
      const { error: chatsError } = await supabaseAdmin
        .from('chats')
        .delete()
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
      
      if (chatsError) {
        console.error('Error deleting chats:', chatsError);
      }

      // 3. Delete reviews where user is reviewer or seller
      const { error: reviewsError } = await supabaseAdmin
        .from('reviews')
        .delete()
        .or(`reviewer_id.eq.${userId},seller_id.eq.${userId}`);
      
      if (reviewsError) {
        console.error('Error deleting reviews:', reviewsError);
      }

      // 4. Delete offers where user is buyer or supplier
      const { error: offersError } = await supabaseAdmin
        .from('offers')
        .delete()
        .or(`buyer_id.eq.${userId},supplier_id.eq.${userId}`);
      
      if (offersError) {
        console.error('Error deleting offers:', offersError);
      }

      // 5. Delete part requests where user is owner
      const { error: requestsError } = await supabaseAdmin
        .from('part_requests')
        .delete()
        .eq('owner_id', userId);
      
      if (requestsError) {
        console.error('Error deleting part requests:', requestsError);
      }

      // 6. Delete car parts where user is supplier
      const { error: partsError } = await supabaseAdmin
        .from('car_parts')
        .delete()
        .eq('supplier_id', userId);
      
      if (partsError) {
        console.error('Error deleting car parts:', partsError);
      }

      // 7. Delete saved parts
      const { error: savedPartsError } = await supabaseAdmin
        .from('saved_parts')
        .delete()
        .eq('user_id', userId);
      
      if (savedPartsError) {
        console.error('Error deleting saved parts:', savedPartsError);
      }

      // 8. Delete seller follows
      const { error: followsError } = await supabaseAdmin
        .from('seller_follows')
        .delete()
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
      
      if (followsError) {
        console.error('Error deleting seller follows:', followsError);
      }

      // 9. Delete user notifications
      const { error: userNotificationsError } = await supabaseAdmin
        .from('user_notifications')
        .delete()
        .eq('user_id', userId);
      
      if (userNotificationsError) {
        console.error('Error deleting user notifications:', userNotificationsError);
      }

      // 10. Delete business subscriptions
      const { error: subscriptionsError } = await supabaseAdmin
        .from('business_subscriptions')
        .delete()
        .eq('user_id', userId);
      
      if (subscriptionsError) {
        console.error('Error deleting business subscriptions:', subscriptionsError);
      }

      // 11. Delete monetization purchases
      const { error: purchasesError } = await supabaseAdmin
        .from('monetization_purchases')
        .delete()
        .eq('user_id', userId);
      
      if (purchasesError) {
        console.error('Error deleting monetization purchases:', purchasesError);
      }

      // 12. Delete seller verifications
      const { error: verificationsError } = await supabaseAdmin
        .from('seller_verifications')
        .delete()
        .eq('user_id', userId);
      
      if (verificationsError) {
        console.error('Error deleting seller verifications:', verificationsError);
      }

      // 13. Set verified_by to NULL in seller_verifications where this user was the verifier
      const { error: verificationUpdateError } = await supabaseAdmin
        .from('seller_verifications')
        .update({ verified_by: null })
        .eq('verified_by', userId);
      
      if (verificationUpdateError) {
        console.error('Error updating seller verifications:', verificationUpdateError);
      }

      // 14. Set admin_id to NULL in admin_notifications where this user was referenced
      const { error: notificationUpdateError } = await supabaseAdmin
        .from('admin_notifications')
        .update({ admin_id: null })
        .eq('admin_id', userId);
      
      if (notificationUpdateError) {
        console.error('Error updating admin notifications:', notificationUpdateError);
      }

      // 15. Delete the user's profile last
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      console.log('Related records cleaned up successfully');

    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
      return new Response(
        JSON.stringify({ error: 'Failed to clean up user data' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Delete the user from Auth using admin privileges
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user from Auth:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete user from authentication system' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('User successfully deleted from Auth');

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in delete-user function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
