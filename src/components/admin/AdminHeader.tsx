
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
    <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 backdrop-blur-lg shadow-lg border-b border-border/50">
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
        <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/30 shadow-lg flex items-center gap-2">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="PartMatch Logo" 
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
          <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PartMatch
          </div>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            Admin Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <AdminNotificationBell onNavigateToVerifications={onNavigateToVerifications} />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
