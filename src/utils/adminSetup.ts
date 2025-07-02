import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log('Admin user created successfully:', data.user.id);
      return { success: true, data: { userId: data.user.id } };
    }

    return { success: false, error: 'User creation failed - no user data returned' };
  } catch (error: any) {
    console.error('Unexpected error creating admin user:', error);
    return { success: false, error: error.message };
  }
};
