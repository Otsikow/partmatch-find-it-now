
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useUserRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserRedirect = async () => {
      if (!user) return;

      try {
        // Get user metadata to determine user type
        const userType = user.user_metadata?.user_type;
        
        if (userType === 'supplier') {
          navigate('/supplier');
          toast({
            title: "Welcome back!",
            description: "Redirecting to your supplier dashboard.",
          });
        } else if (userType === 'owner') {
          navigate('/');
          toast({
            title: "Welcome back!",
            description: "You can now start requesting parts.",
          });
        } else {
          // Default redirect to home for users without specific type
          navigate('/');
        }
      } catch (error) {
        console.error('Error handling user redirect:', error);
        // Default to home page on error
        navigate('/');
      }
    };

    handleUserRedirect();
  }, [user, navigate]);

  return { user };
};
