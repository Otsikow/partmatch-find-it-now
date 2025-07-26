
import React, { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, MessageCircle, Eye, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const BuyerDashboardHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.first_name || profile?.last_name) {
          setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim());
        } else {
          // Fallback to email prefix if no name
          const emailPrefix = user.email?.split('@')[0] || '';
          setUserName(emailPrefix);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to email prefix
        const emailPrefix = user.email?.split('@')[0] || '';
        setUserName(emailPrefix);
      }
    };

    fetchUserName();
  }, [user]);

  const handleChatWithSeller = () => {
    navigate('/chat');
  };

  const handleViewPart = () => {
    navigate('/search-parts-with-map');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-lg">
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
              <Logo className="h-8 w-auto sm:h-10 object-contain" />
            </Link>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight break-words">
                {t('buyerDashboard', 'Buyer Dashboard')}
              </h1>
              <p className="text-sm sm:text-base text-white/90 leading-tight break-words mt-1">
                {userName ? `Welcome back, ${userName}` : t('manageDashboardSubtitle', 'Manage your car part requests and orders')}
              </p>
            </div>
          </div>
          
          {/* Right section with action buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChatWithSeller}
              className="hidden sm:flex items-center space-x-2 text-white hover:bg-white/30 hover:text-white shadow-lg backdrop-blur-sm border border-white/20"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              <MessageCircle className="h-4 w-4 drop-shadow-md" />
              <span className="hidden md:inline font-medium">Chat with Seller</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewPart}
              className="hidden sm:flex items-center space-x-2 text-white hover:bg-white/30 hover:text-white shadow-lg backdrop-blur-sm border border-white/20"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              <Eye className="h-4 w-4 drop-shadow-md" />
              <span className="hidden md:inline font-medium">View Part</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-white hover:bg-white/30 hover:text-white shadow-lg backdrop-blur-sm border border-white/20"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              <LogOut className="h-4 w-4 drop-shadow-md" />
              <span className="hidden sm:inline font-medium">Sign Out</span>
            </Button>

            {/* Mobile-only buttons */}
            <div className="sm:hidden flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChatWithSeller}
                className="p-2 text-white hover:bg-white/30 hover:text-white shadow-lg backdrop-blur-sm border border-white/20 rounded-full"
              >
                <MessageCircle className="h-4 w-4 drop-shadow-md" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewPart}
                className="p-2 text-white hover:bg-white/30 hover:text-white shadow-lg backdrop-blur-sm border border-white/20 rounded-full"
              >
                <Eye className="h-4 w-4 drop-shadow-md" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
