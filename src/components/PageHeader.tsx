import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Home, Bell, X, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import NotificationBell from "./NotificationBell";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  showSignOut?: boolean;
  showHomeButton?: boolean;
  children?: React.ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  showBackButton = false,
  backTo,
  showSignOut = false,
  showHomeButton = false,
  children
}: PageHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signOut, user } = useAuth();

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const handleNotificationClick = () => {
    // TODO: Implement notification panel
    console.log('Opening notifications...');
  };

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/buyer-auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleHome = () => {
    console.log('PageHeader: Home button clicked, navigating to /');
    window.location.href = '/';
  };

  return (
    <header className="relative px-3 py-3 sm:p-6 bg-gradient-to-r from-primary via-primary/95 to-primary-foreground backdrop-blur-lg shadow-lg border-b border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-indigo-600/20"></div>
      <div className="relative flex items-center gap-2 sm:gap-3 w-full">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack} 
            className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-white/20 flex-shrink-0 text-white hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        
        {/* Professional PartMatch Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
            <img 
              src="/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png" 
              alt="PartMatch - Car Parts Marketplace" 
              className="h-6 w-auto sm:h-8 object-contain" 
            />
          </div>
        </Link>
        
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight break-words">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-white/90 leading-tight break-words mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Notification Bell */}
          <div className="hidden sm:block bg-white/10 rounded-full p-1">
            <NotificationBell />
          </div>

          {/* Profile Icon */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30"
                >
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                      {getInitials(user.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('dashboard')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {showHomeButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleHome} 
              className="text-white hover:bg-white/20 hover:text-white transition-all duration-300 h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2"
            >
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('home')}</span>
            </Button>
          )}
          
          {showSignOut && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut} 
              className="text-white hover:bg-white/20 hover:text-white transition-all duration-300 h-8 w-8 sm:h-auto sm:w-auto p-1 sm:p-2"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          
          {children}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;