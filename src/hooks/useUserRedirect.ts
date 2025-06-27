
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useUserRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserRedirect = async () => {
      if (!user) return;

      try {
        // Redirect all authenticated users to the dashboard
        navigate('/dashboard');
        toast({
          title: "Welcome back!",
          description: "Choose what you'd like to do from the options below.",
        });
      } catch (error) {
        console.error('Error handling user redirect:', error);
        // Default to dashboard on error
        navigate('/dashboard');
      }
    };

    handleUserRedirect();
  }, [user, navigate]);

  return { user };
};
