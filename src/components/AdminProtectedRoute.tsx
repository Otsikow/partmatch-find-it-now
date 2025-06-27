
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
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        setHasCheckedProfile(true);
        return;
      }

      try {
        console.log('Fetching admin profile for:', user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching admin profile:', error);
          setUserType('owner'); // Default fallback
        } else {
          console.log('Admin profile found:', profile);
          setUserType(profile?.user_type || 'owner');
        }
      } catch (error) {
        console.error('Unexpected error fetching admin profile:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (userType !== 'admin') {
    toast({
      title: "Access Denied", 
      description: "Only administrators can access this dashboard.",
      variant: "destructive"
    });
    return <Navigate to="/buyer-dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
