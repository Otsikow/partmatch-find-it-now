
import React from 'react';
import { ArrowLeft, Settings, MessageCircle, Eye, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const BuyerDashboardHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChatWithSeller = () => {
    navigate('/chat');
  };

  const handleViewPart = () => {
    navigate('/search-parts-with-map');
  };

  const handleSettings = () => {
    navigate('/buyer-dashboard?tab=profile');
  };

  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary-foreground text-white shadow-lg">
      <div className="px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Left section with back button, logo and title */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/20 rounded-full text-white hover:text-white flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png" 
                alt="PartMatch - Car Parts Marketplace" 
                className="h-8 w-auto sm:h-10 object-contain" 
              />
            </Link>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight break-words">
                {t('buyerDashboard', 'Buyer Dashboard')}
              </h1>
              <p className="text-sm sm:text-base text-white/90 leading-tight break-words mt-1">
                {t('manageDashboardSubtitle', 'Manage your car part requests and orders')}
              </p>
            </div>
          </div>
          
          {/* Right section with action buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChatWithSeller}
              className="hidden sm:flex items-center space-x-2 text-white hover:bg-white/20 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden md:inline">Chat with Seller</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewPart}
              className="hidden sm:flex items-center space-x-2 text-white hover:bg-white/20 hover:text-white"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden md:inline">View Part</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSettings}
              className="flex items-center space-x-2 text-white hover:bg-white/20 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>

            {/* Mobile-only buttons */}
            <div className="sm:hidden flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChatWithSeller}
                className="p-2 text-white hover:bg-white/20 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewPart}
                className="p-2 text-white hover:bg-white/20 hover:text-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
