
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
        // Get user profile to determine user type
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          // Default to buyer dashboard on error
          navigate('/buyer-dashboard');
          return;
        }

        // Redirect based on user type
        if (profile?.user_type === 'supplier') {
          navigate('/supplier');
          toast({
            title: "Welcome back!",
            description: "Access your seller dashboard to manage your parts and offers.",
          });
        } else {
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
