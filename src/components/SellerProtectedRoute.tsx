
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SellerProtectedRouteProps {
  children: React.ReactNode;
}

const SellerProtectedRoute = ({ children }: SellerProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        setHasCheckedProfile(true);
        return;
      }

      try {
        console.log('SellerProtectedRoute: Fetching user profile for:', user.id);
        
        // First check if profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('SellerProtectedRoute: Error fetching user profile:', error);
          
          // If profile doesn't exist, create it with default user_type
          if (error.code === 'PGRST116') {
            console.log('SellerProtectedRoute: Profile not found, creating default profile');
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
              console.error('SellerProtectedRoute: Error creating profile:', insertError);
            }
            
            setUserType('owner');
          } else {
            setUserType('owner'); // Default fallback
          }
        } else {
          console.log('SellerProtectedRoute: User profile found:', profile);
          setUserType(profile?.user_type || 'owner');
        }
      } catch (error) {
        console.error('SellerProtectedRoute: Unexpected error fetching user profile:', error);
        setUserType('owner');
      } finally {
        setProfileLoading(false);
        setHasCheckedProfile(true);
      }
    };

    if (!hasCheckedProfile) {
      fetchUserProfile();
    }
  }, [user, hasCheckedProfile]);

  if (loading || profileLoading || !hasCheckedProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('SellerProtectedRoute: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (userType !== 'supplier') {
    console.log('SellerProtectedRoute: User is not a supplier, userType:', userType);
    toast({
      title: "Access Denied",
      description: "Only sellers can access this dashboard. Please register as a seller to continue.",
      variant: "destructive"
    });
    return <Navigate to="/buyer-dashboard" replace />;
  }

  console.log('SellerProtectedRoute: User is a supplier, allowing access');
  return <>{children}</>;
};

export default SellerProtectedRoute;
