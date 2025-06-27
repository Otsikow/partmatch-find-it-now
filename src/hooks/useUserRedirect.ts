
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserRedirect = async () => {
      if (!user) return;

      try {
        console.log('Checking user redirect for:', user.id);
        
        // Get user profile to determine user type
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile for redirect:', error);
          
          // If profile doesn't exist, create it with default user_type
          if (error.code === 'PGRST116') {
            console.log('Profile not found, creating default profile for redirect');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                user_type: 'owner',
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                phone: user.user_metadata?.phone || ''
              });
            
            if (insertError) {
              console.error('Error creating profile for redirect:', insertError);
            }
          }
          
          // Default to buyer dashboard on error
          navigate('/buyer-dashboard');
          return;
        }

        console.log('User profile for redirect:', profile);
        
        // Redirect based on user type
        if (profile?.user_type === 'supplier') {
          console.log('Redirecting supplier to supplier dashboard');
          navigate('/supplier');
          toast({
            title: "Welcome back!",
            description: "Access your seller dashboard to manage your parts and offers.",
          });
        } else if (profile?.user_type === 'admin') {
          navigate('/admin');
          toast({
            title: "Welcome back, Admin!",
            description: "Access your admin dashboard to manage the platform.",
          });
        } else {
          // For 'owner' and any other user types, go to buyer dashboard
          navigate('/buyer-dashboard');
          toast({
            title: "Welcome back!",
            description: "Choose what you'd like to do from the options below.",
          });
        }
      } catch (error) {
        console.error('Error handling user redirect:', error);
        // Default to buyer dashboard on error
        navigate('/buyer-dashboard');
      }
    };

    handleUserRedirect();
  }, [user, navigate]);

  return { user };
};
