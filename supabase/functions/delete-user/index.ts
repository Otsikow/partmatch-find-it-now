
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

    console.log(`Admin ${adminUser.id} is deleting user: ${userId}`);

    // Clean up related records that would prevent user deletion
    console.log('Cleaning up related records for user:', userId);
    
    // Set verified_by to NULL in seller_verifications where this user was the verifier
    const { error: verificationUpdateError } = await supabaseAdmin
      .from('seller_verifications')
      .update({ verified_by: null })
      .eq('verified_by', userId);
    
    if (verificationUpdateError) {
      console.error('Error updating seller verifications:', verificationUpdateError);
    }

    // Set admin_id to NULL in admin_notifications where this user was referenced
    const { error: notificationUpdateError } = await supabaseAdmin
      .from('admin_notifications')
      .update({ admin_id: null })
      .eq('admin_id', userId);
    
    if (notificationUpdateError) {
      console.error('Error updating admin notifications:', notificationUpdateError);
    }

    // Delete user-specific records that should be removed when user is deleted
    const { error: userNotificationsError } = await supabaseAdmin
      .from('user_notifications')
      .delete()
      .eq('user_id', userId);
    
    if (userNotificationsError) {
      console.error('Error deleting user notifications:', userNotificationsError);
    }

    const { error: savedPartsError } = await supabaseAdmin
      .from('saved_parts')
      .delete()
      .eq('user_id', userId);
    
    if (savedPartsError) {
      console.error('Error deleting saved parts:', savedPartsError);
    }

    const { error: subscriptionsError } = await supabaseAdmin
      .from('business_subscriptions')
      .delete()
      .eq('user_id', userId);
    
    if (subscriptionsError) {
      console.error('Error deleting business subscriptions:', subscriptionsError);
    }

    const { error: purchasesError } = await supabaseAdmin
      .from('monetization_purchases')
      .delete()
      .eq('user_id', userId);
    
    if (purchasesError) {
      console.error('Error deleting monetization purchases:', purchasesError);
    }

    console.log('Related records cleaned up successfully');

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
