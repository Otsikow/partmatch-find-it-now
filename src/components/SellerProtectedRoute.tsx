
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
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setUserType('owner'); // Default to buyer on error
        } else {
          setUserType(profile?.user_type || 'owner');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserType('owner');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

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
    return <Navigate to="/auth" replace />;
  }

  if (userType !== 'supplier') {
    toast({
      title: "Access Denied",
      description: "Only sellers can access this dashboard. Please register as a seller to continue.",
      variant: "destructive"
    });
    return <Navigate to="/buyer-dashboard" replace />;
  }

  return <>{children}</>;
};

export default SellerProtectedRoute;
