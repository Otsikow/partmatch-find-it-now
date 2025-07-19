
import { LogOut, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";
import AdminNotificationBell from "./AdminNotificationBell";
import ThemeToggle from "@/components/ThemeToggle";

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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Back Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="h-10 w-10 hover:bg-accent/20 transition-colors"
          aria-label="Go back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Center: Logo and Title */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <div className="flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-primary/20 shadow-sm">
            <img 
              src="/lovable-uploads/015b9a61-a3c7-4c8f-b3b7-f9c10a5e00ea.png" 
              alt="PartMatch Logo" 
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-playfair font-bold text-foreground truncate">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <AdminNotificationBell onNavigateToVerifications={onNavigateToVerifications} />
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="hidden sm:flex hover:bg-accent/20 transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
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
