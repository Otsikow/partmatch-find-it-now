
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminNotificationBell from "./AdminNotificationBell";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";

interface AdminHeaderProps {
  onNavigateToVerifications?: () => void;
}

const AdminHeader = ({ onNavigateToVerifications }: AdminHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const adminName = useUserDisplayName("Admin");

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin-auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 shadow-2xl border-b-4 border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleGoBack}
              className="text-white hover:bg-white/20 transition-all duration-300 p-2"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/lovable-uploads/82ecb905-adea-450b-b104-83fa38679cfb.png" 
                alt="PartMatch Logo" 
                className="h-8 w-auto sm:h-10"
              />
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-white mb-1 sm:mb-2">
                  {adminName && adminName !== "Admin" ? `Welcome, ${adminName}` : "Admin Dashboard"}
                </h1>
                <p className="text-sm sm:text-base text-purple-100 font-crimson">
                  Manage your marketplace with ease
                </p>
              </div>
            </div>
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
