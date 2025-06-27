
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const checkUserAccess = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      console.log('AdminProtectedRoute: Checking access for user:', user.id);
      console.log('AdminProtectedRoute: User metadata:', user.user_metadata);

      // First check user metadata directly
      const metadataUserType = user.user_metadata?.user_type;
      console.log('AdminProtectedRoute: Metadata user_type:', metadataUserType);

      if (metadataUserType === 'admin') {
        console.log('AdminProtectedRoute: User is admin based on metadata');
        setUserType('admin');
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

        console.log('AdminProtectedRoute: Profile query result:', { profile, error });

        if (error) {
          console.error('AdminProtectedRoute: Error fetching profile:', error);
          // No profile found and no admin metadata - deny access
          setUserType('not_admin');
        } else {
          console.log('AdminProtectedRoute: Profile user_type:', profile?.user_type);
          setUserType(profile?.user_type || 'not_admin');
        }
      } catch (error) {
        console.error('AdminProtectedRoute: Unexpected error:', error);
        setUserType('not_admin');
      } finally {
        setProfileLoading(false);
      }
    };

    checkUserAccess();
  }, [user]);

  console.log('AdminProtectedRoute: Current state:', {
    loading,
    profileLoading,
    userType,
    userId: user?.id,
    userEmail: user?.email
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminProtectedRoute: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (userType !== 'admin') {
    console.log('AdminProtectedRoute: Access denied, userType:', userType);
    toast({
      title: "Access Denied", 
      description: "Only administrators can access this dashboard.",
      variant: "destructive"
    });
    return <Navigate to="/buyer-dashboard" replace />;
  }

  console.log('AdminProtectedRoute: Access granted for admin');
  return <>{children}</>;
};

export default AdminProtectedRoute;
