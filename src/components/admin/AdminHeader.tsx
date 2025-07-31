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
    console.log("🔧 AdminHeader: Back button clicked - Navigating back");
    console.log("🔧 AdminHeader: Current location:", window.location.pathname);
    try {
      navigate(-1);
      console.log("🔧 AdminHeader: navigate(-1) executed successfully");
    } catch (error) {
      console.error("🔧 AdminHeader: Error in navigate(-1):", error);
    }
  };

  const goHome = () => {
    console.log("🔧 AdminHeader: Home button clicked - Navigating to home");
    console.log("🔧 AdminHeader: Current location:", window.location.pathname);
    console.log("🔧 AdminHeader: navigate function:", typeof navigate);
    try {
      // Navigate with state to prevent automatic redirect back to admin
      navigate('/', { state: { explicitHomeNavigation: true } });
      console.log("🔧 AdminHeader: navigate('/') executed successfully with explicitHomeNavigation flag");
    } catch (error) {
      console.error("🔧 AdminHeader: Error in navigate('/'):", error);
    }
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
    <header className="sticky top-0 z-50 bg-primary/90 text-primary-foreground backdrop-blur-lg border-b border-border/40 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Back Arrow */}
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔧 AdminHeader: Back button CLICKED!");
            goBack();
          }}
          className="h-12 w-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20 cursor-pointer"
          style={{ pointerEvents: 'auto', zIndex: 1000 }}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        {/* Center: Logo and Title */}
        <div className="flex items-center gap-3 flex-1 justify-start ml-4">
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
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("🔧 AdminHeader: Home button CLICKED!");
              goHome();
            }}
            className="h-10 w-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20 cursor-pointer"
            style={{ pointerEvents: 'auto', zIndex: 1000 }}
          >
            <Home className="h-4 w-4" />
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