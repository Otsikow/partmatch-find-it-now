import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import BuyerSidebar from "@/components/buyer/BuyerSidebar";
import MyOrders from "@/components/buyer/MyOrders";
import SavedParts from "@/components/buyer/SavedParts";
import BuyerNotifications from "@/components/buyer/BuyerNotifications";
import BuyerProfile from "@/components/buyer/BuyerProfile";
import Chat from "@/pages/Chat";
import PendingRatingNotification from "@/components/PendingRatingNotification";
import { useTransactionRating } from "@/hooks/useTransactionRating";
import { useNotifications } from "@/hooks/useNotifications";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('Buyer');
  const [activeSection, setActiveSection] = useState('orders');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { notifications } = useNotifications();
  const { pendingRatings } = useTransactionRating();

  const unreadNotifications = notifications.filter(n => !n.sent).length;

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setDisplayName(name || user.email?.split('@')[0] || 'Buyer');
        } else {
          setDisplayName(user.email?.split('@')[0] || 'Buyer');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setDisplayName(user.email?.split('@')[0] || 'Buyer');
      }
    };

    fetchUserName();
  }, [user]);

  useEffect(() => {
    // Fetch unread message count
    const fetchUnreadMessages = async () => {
      if (!user) return;

      try {
        const { data: chats } = await supabase
          .from('chats')
          .select('buyer_unread_count')
          .eq('buyer_id', user.id);

        if (chats) {
          const totalUnread = chats.reduce((sum, chat) => sum + (chat.buyer_unread_count || 0), 0);
          setUnreadMessages(totalUnread);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <MyOrders />;
      case 'messages':
        return <Chat />;
      case 'saved-parts':
        return <SavedParts />;
      case 'rate-sellers':
        return <MyOrders />;
      case 'notifications':
        return <BuyerNotifications />;
      case 'profile':
        return <BuyerProfile />;
      default:
        return <MyOrders />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'orders': return 'My Orders';
      case 'messages': return 'Messages';
      case 'saved-parts': return 'Saved Parts';
      case 'rate-sellers': return 'Rate Sellers';
      case 'notifications': return 'Notifications';
      case 'profile': return 'Profile Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optimized Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back button and Logo */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <img 
                src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
                alt="PartMatch Logo" 
                className="h-8 w-auto"
              />
            </div>

            {/* Center: Title (hidden on very small screens) */}
            <div className="hidden sm:block text-center flex-1 mx-4">
              <h1 className="text-lg font-semibold text-blue-600">Buyer Dashboard</h1>
              <p className="text-sm text-gray-500 truncate">Welcome back, {displayName}</p>
            </div>

            {/* Right: Home and Profile */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Mobile title (shown on small screens) */}
          <div className="sm:hidden mt-3 text-center">
            <h1 className="text-lg font-semibold text-blue-600">Buyer Dashboard</h1>
            <p className="text-sm text-gray-500">{getSectionTitle()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="h-full bg-white border-r border-gray-200 shadow-sm">
            <BuyerSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              unreadMessages={unreadMessages}
              unreadNotifications={unreadNotifications}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Improved Mobile Navigation */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-2 py-3">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 max-w-md mx-auto sm:max-w-none">
              {[
                { id: 'orders', label: 'Orders', icon: '📦' },
                { id: 'messages', label: 'Messages', icon: '💬', badge: unreadMessages },
                { id: 'saved-parts', label: 'Saved', icon: '❤️' },
                { id: 'notifications', label: 'Alerts', icon: '🔔', badge: unreadNotifications },
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'rate-sellers', label: 'Rate', icon: '⭐' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base sm:text-lg mb-1">{item.icon}</span>
                  <span className="text-xs font-medium truncate w-full text-center leading-tight">
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Show pending rating notifications */}
              {pendingRatings.length > 0 && (
                <div className="mb-6">
                  <PendingRatingNotification />
                </div>
              )}
              
              {/* Content Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
                <div className="p-6">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyerDashboard;
