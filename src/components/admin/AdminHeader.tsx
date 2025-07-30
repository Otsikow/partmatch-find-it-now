import React from 'react';
import { LogOut, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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

  const goBack = () => {
    console.log("🔧 AdminHeader: Navigating back");
    navigate(-1);
  };

  const goHome = () => {
    console.log("🔧 AdminHeader: Navigating to home");
    navigate('/');
  };

  const goToAdminDashboard = () => {
    console.log("🔧 AdminHeader: Navigating to admin dashboard");
    navigate('/admin');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin-auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 bg-primary/90 text-primary-foreground backdrop-blur-lg border-b border-border/40 shadow-lg"
      onPointerDown={(e) => console.log('🔧 Header pointer down:', e.target)}
      onClick={(e) => console.log('🔧 Header clicked:', e.target)}
    >
      <div 
        className="container mx-auto px-4 py-3 flex items-center justify-between"
        onPointerDown={(e) => console.log('🔧 Container pointer down:', e.target)}
        onClick={(e) => console.log('🔧 Container clicked:', e.target)}
      >
        {/* Left: Back Arrow */}
        <div
          onClick={() => {
            console.log('🔧 BACK ARROW CLICKED!');
            navigate('/');
          }}
          className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white transition-colors border border-white/30 shadow-lg cursor-pointer flex items-center justify-center rounded-md"
          style={{ 
            zIndex: 9999, 
            position: 'relative',
            minHeight: '40px',
            minWidth: '40px'
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </div>

        {/* Center: Logo and Title */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <button 
            onClick={() => {
              console.log('🔧 AdminHeader: Logo clicked!');
              goHome();
            }}
            className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-primary-foreground/20 shadow-lg hover:bg-primary-foreground/20 transition-colors cursor-pointer relative z-10"
          >
            <img 
              src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
              alt="PartMatch Logo" 
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain bg-white rounded-lg p-2 pointer-events-none"
            />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-playfair font-bold truncate">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-primary-foreground/90 truncate">
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
            onClick={() => {
              console.log('🔧 AdminHeader: Home button clicked!');
              goHome();
            }}
            className="hidden sm:flex bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors backdrop-blur-sm border border-primary-foreground/20 shadow-lg cursor-pointer relative z-10"
          >
            <Home className="h-4 w-4 mr-1 pointer-events-none" />
            <span className="pointer-events-none">Home</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors backdrop-blur-sm border border-red-500/20 shadow-lg"
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