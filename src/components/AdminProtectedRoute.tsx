
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
  const [isAuthorizedEmail, setIsAuthorizedEmail] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      console.log('AdminProtectedRoute: Checking admin access for user:', user.id);
      console.log('AdminProtectedRoute: User email:', user.email);

      // Check if the email is authorized using database function
      try {
        const { data: emailAuthorized } = await supabase.rpc('is_authorized_admin_email', {
          email_to_check: user.email || ''
        });
        
        setIsAuthorizedEmail(emailAuthorized || false);

        if (!emailAuthorized) {
          console.log('AdminProtectedRoute: Email not authorized for admin access');
          
          // Log unauthorized access attempt
          await supabase.rpc('log_admin_security_event', {
            event_type: 'UNAUTHORIZED_ACCESS',
            event_details: {
              email: user.email,
              user_id: user.id,
              details: 'Attempted access to admin area with unauthorized email',
              timestamp: new Date().toISOString()
            }
          });
          
          setUserType('unauthorized');
          setProfileLoading(false);
          return;
        }

        // Check user metadata for admin role
        const metadataUserType = user.user_metadata?.user_type;
        console.log('AdminProtectedRoute: Metadata user_type:', metadataUserType);

        if (metadataUserType === 'admin') {
          console.log('AdminProtectedRoute: User is admin based on metadata');
          setUserType('admin');
          setProfileLoading(false);
          return;
        }

        // Check profile table as fallback
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        console.log('AdminProtectedRoute: Profile query result:', { profile, error });

        if (error || !profile) {
          console.error('AdminProtectedRoute: Error fetching profile or no profile found:', error);
          setUserType('unauthorized');
        } else {
          console.log('AdminProtectedRoute: Profile user_type:', profile?.user_type);
          // Only allow admin access if both email is authorized AND user_type is admin
          if (profile.user_type === 'admin') {
            setUserType('admin');
            
            // Log successful admin access
            await supabase.rpc('log_admin_security_event', {
              event_type: 'ADMIN_ACTION',
              event_details: {
                email: user.email,
                user_id: user.id,
                details: 'Admin accessed protected area',
                timestamp: new Date().toISOString()
              }
            });
          } else {
            setUserType('unauthorized');
          }
        }
      } catch (error) {
        console.error('AdminProtectedRoute: Unexpected error:', error);
        setUserType('unauthorized');
      } finally {
        setProfileLoading(false);
      }
    };

    checkAdminAccess();
  }, [user]);

  console.log('AdminProtectedRoute: Current state:', {
    loading,
    profileLoading,
    userType,
    isAuthorizedEmail,
    userId: user?.id,
    userEmail: user?.email
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminProtectedRoute: No user, redirecting to admin auth');
    return <Navigate to="/admin-auth" replace />;
  }

  if (!isAuthorizedEmail || userType !== 'admin') {
    console.log('AdminProtectedRoute: Access denied, userType:', userType, 'emailAuthorized:', isAuthorizedEmail);
    toast({
      title: "Access Denied", 
      description: "You are not authorized to access the admin dashboard. Contact system administrator.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  console.log('AdminProtectedRoute: Admin access granted');
  return <>{children}</>;
};

export default AdminProtectedRoute;
