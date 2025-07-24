
import { LogOut, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";
import AdminNotificationBell from "./AdminNotificationBell";
devin/1751454751-fix-admin-empty-dashboard
import { useUserDisplayName } from "@/hooks/useUserDisplayName";

interface AdminHeaderProps {
  onNavigateToVerifications?: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
}

const AdminHeader = ({ onNavigateToVerifications, onGoBack, onGoHome }: AdminHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
devin/1751454751-fix-admin-empty-dashboard
  const adminName = useUserDisplayName("Admin");


  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin-auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

devin/1751454751-fix-admin-empty-dashboard
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
            
  return (
    <header className="sticky top-0 z-50 bg-primary/90 text-primary-foreground backdrop-blur-lg border-b border-border/40 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Back Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onGoBack}
          className="h-10 w-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors backdrop-blur-sm border border-primary-foreground/20 shadow-lg"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Center: Logo and Title */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Link to="/admin" className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-primary-foreground/20 shadow-lg">
            <img 
              src="/lovable-uploads/015b9a61-a3c7-4c8f-b3b7-f9c10a5e00ea.png" 
              alt="PartMatch Logo" 
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
          </Link>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-playfair font-bold truncate">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-primary-foreground/90 truncate">
              Admin Dashboard
            </p>
main
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <AdminNotificationBell onNavigateToVerifications={onNavigateToVerifications} />
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
fix/admin-home-button
            onClick={onGoHome}
            className="flex bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors backdrop-blur-sm border border-primary-foreground/20 shadow-lg"
      
  
            <Link to="/admin">
              <Home className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors backdrop-blur-sm border border-red-500/20 shadow-lg"
         
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
