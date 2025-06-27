
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
      if (!user) {
        console.log('useUserRedirect: No user found, skipping redirect');
        return;
      }

      try {
        console.log('useUserRedirect: Checking user redirect for:', user.id);
        
        // Get user profile to determine user type
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type, first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        console.log('useUserRedirect: Profile query result:', { profile, error });

        if (error) {
          console.error('useUserRedirect: Error fetching user profile for redirect:', error);
          
          // If profile doesn't exist, check user metadata for user_type
          if (error.code === 'PGRST116') {
            console.log('useUserRedirect: Profile not found, creating profile based on metadata');
            
            const userTypeFromMetadata = user.user_metadata?.user_type || 'owner';
            console.log('useUserRedirect: User type from metadata:', userTypeFromMetadata);
            
            const newProfile = {
              id: user.id,
              user_type: userTypeFromMetadata,
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              phone: user.user_metadata?.phone || ''
            };
            
            console.log('useUserRedirect: Creating profile with data:', newProfile);
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
            
            if (insertError) {
              console.error('useUserRedirect: Error creating profile for redirect:', insertError);
            } else {
              console.log('useUserRedirect: Profile created successfully');
            }
            
            // Redirect based on the metadata user_type
            if (userTypeFromMetadata === 'supplier') {
              console.log('useUserRedirect: Redirecting supplier to supplier dashboard');
              navigate('/supplier');
              toast({
                title: "Welcome back, Seller!",
                description: "Access your seller dashboard to manage your parts and offers.",
              });
              return;
            } else if (userTypeFromMetadata === 'admin') {
              console.log('useUserRedirect: Redirecting admin to admin dashboard');
              navigate('/admin');
              toast({
                title: "Welcome back, Administrator!",
                description: "Access your admin dashboard to manage the platform.",
              });
              return;
            }
          }
          
          // Default to buyer dashboard on error
          console.log('useUserRedirect: Defaulting to buyer dashboard due to error');
          navigate('/buyer-dashboard');
          return;
        }

        console.log('useUserRedirect: User profile for redirect:', profile);
        console.log('useUserRedirect: User type detected:', profile?.user_type);
        
        // Redirect based on user type with role-specific messaging
        if (profile?.user_type === 'supplier') {
          console.log('useUserRedirect: Redirecting supplier to supplier dashboard');
          navigate('/supplier');
          toast({
            title: "Welcome back, Seller!",
            description: "Access your seller dashboard to manage your parts and offers.",
          });
        } else if (profile?.user_type === 'admin') {
          console.log('useUserRedirect: Redirecting admin to admin dashboard');
          navigate('/admin');
          toast({
            title: "Welcome back, Administrator!",
            description: "Access your admin dashboard to manage the platform.",
          });
        } else {
          // For 'owner' and any other user types, go to buyer dashboard
          console.log('useUserRedirect: Redirecting to buyer dashboard, user_type:', profile?.user_type);
          navigate('/buyer-dashboard');
          toast({
            title: "Welcome back, Buyer!",
            description: "Find the car parts you need from our network of verified sellers.",
          });
        }
      } catch (error) {
        console.error('useUserRedirect: Error handling user redirect:', error);
        // Default to buyer dashboard on error
        console.log('useUserRedirect: Defaulting to buyer dashboard due to catch error');
        navigate('/buyer-dashboard');
      }
    };

    handleUserRedirect();
  }, [user, navigate]);

  return { user };
};
