
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
        console.log('SellerProtectedRoute: No user, setting loading to false');
        setProfileLoading(false);
        setHasCheckedProfile(true);
        return;
      }

      try {
        console.log('SellerProtectedRoute: Fetching user profile for:', user.id);
        console.log('SellerProtectedRoute: User metadata:', user.user_metadata);
        
        // First check if profile exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type, first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        console.log('SellerProtectedRoute: Profile query result:', { profile, error });

        if (error) {
          console.error('SellerProtectedRoute: Error fetching user profile:', error);
          
          // If profile doesn't exist, create it with default user_type
          if (error.code === 'PGRST116') {
            console.log('SellerProtectedRoute: Profile not found, creating default profile');
            
            const newProfile = {
              id: user.id,
              user_type: 'supplier' as const,
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              phone: user.user_metadata?.phone || ''
            };
            
            console.log('SellerProtectedRoute: Creating profile with data:', newProfile);
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
            
            if (insertError) {
              console.error('SellerProtectedRoute: Error creating profile:', insertError);
            } else {
              console.log('SellerProtectedRoute: Profile created successfully');
            }
            
            setUserType('supplier');
            console.log('SellerProtectedRoute: Set userType to supplier (default)');
          } else {
            setUserType('supplier'); // Default fallback
            console.log('SellerProtectedRoute: Set userType to supplier (fallback)');
          }
        } else {
          console.log('SellerProtectedRoute: User profile found:', profile);
          const detectedUserType = profile?.user_type || 'supplier';
          setUserType(detectedUserType);
          console.log('SellerProtectedRoute: Set userType to:', detectedUserType);
        }
      } catch (error) {
        console.error('SellerProtectedRoute: Unexpected error fetching user profile:', error);
        setUserType('supplier');
        console.log('SellerProtectedRoute: Set userType to supplier (catch error)');
      } finally {
        setProfileLoading(false);
        setHasCheckedProfile(true);
        console.log('SellerProtectedRoute: Profile check completed');
      }
    };

    if (!hasCheckedProfile) {
      console.log('SellerProtectedRoute: Starting profile check...');
      fetchUserProfile();
    }
  }, [user, hasCheckedProfile]);

  console.log('SellerProtectedRoute: Current state:', {
    loading,
    profileLoading,
    hasCheckedProfile,
    userType,
    userId: user?.id,
    userEmail: user?.email
  });

  if (loading || profileLoading || !hasCheckedProfile) {
    console.log('SellerProtectedRoute: Still loading...');
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
    console.log('SellerProtectedRoute: Expected userType: supplier, got:', userType);
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
