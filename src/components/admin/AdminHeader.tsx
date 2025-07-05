
import { LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";
import AdminNotificationBell from "./AdminNotificationBell";

interface AdminHeaderProps {
  onNavigateToVerifications?: () => void;
}

const AdminHeader = ({ onNavigateToVerifications }: AdminHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = useUserDisplayName('Admin');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin-auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoBack = () => {
    console.log('AdminHeader: Back button clicked, navigating to home page');
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 shadow-2xl border-b-4 border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
                  alt="PartMatch Logo" 
                  className="h-6 w-auto sm:h-8 brightness-0 invert"
                />
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold text-white mb-1">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-purple-100 font-crimson">
                  Welcome back, {displayName}
                </p>
              </div>
            </div>
            
            {/* Home Icon Button */}
            <Button 
              onClick={handleGoBack}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 transition-all duration-300 font-inter ml-2 p-2"
              title="Go to Home Page"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <AdminNotificationBell onNavigateToVerifications={onNavigateToVerifications} />
            </div>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 transition-all duration-300 font-inter"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
