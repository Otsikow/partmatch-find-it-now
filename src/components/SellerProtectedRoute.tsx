
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

  useEffect(() => {
    const checkUserAccess = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      console.log('SellerProtectedRoute: Checking access for user:', user.id);
      console.log('SellerProtectedRoute: User metadata:', user.user_metadata);

      // First check user metadata directly
      const metadataUserType = user.user_metadata?.user_type;
      console.log('SellerProtectedRoute: Metadata user_type:', metadataUserType);

      if (metadataUserType === 'supplier') {
        console.log('SellerProtectedRoute: User is supplier based on metadata');
        setUserType('supplier');
        setProfileLoading(false);
        return;
      }

      // If no metadata, check profile table
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        console.log('SellerProtectedRoute: Profile query result:', { profile, error });

        if (error) {
          console.error('SellerProtectedRoute: Error fetching profile:', error);
          // No profile found and no supplier metadata - deny access
          setUserType('not_supplier');
        } else {
          console.log('SellerProtectedRoute: Profile user_type:', profile?.user_type);
          setUserType(profile?.user_type || 'not_supplier');
        }
      } catch (error) {
        console.error('SellerProtectedRoute: Unexpected error:', error);
        setUserType('not_supplier');
      } finally {
        setProfileLoading(false);
      }
    };

    checkUserAccess();
  }, [user]);

  console.log('SellerProtectedRoute: Current state:', {
    loading,
    profileLoading,
    userType,
    userId: user?.id,
    userEmail: user?.email
  });

  if (loading || profileLoading) {
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
    console.log('SellerProtectedRoute: Access denied, userType:', userType);
    toast({
      title: "Access Denied",
      description: "Only sellers can access this dashboard. Please register as a seller to continue.",
      variant: "destructive"
    });
    return <Navigate to="/buyer-dashboard" replace />;
  }

  console.log('SellerProtectedRoute: Access granted for supplier');
  return <>{children}</>;
};

export default SellerProtectedRoute;
