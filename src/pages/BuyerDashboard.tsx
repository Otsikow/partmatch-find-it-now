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
      {/* Header with Logo and Back Arrow */}
      <PageHeader 
        title={`Buyer Dashboard - ${getSectionTitle()}`}
        subtitle={`Welcome back, ${displayName}`}
        showSignOut={true}
        showHomeButton={true}
      />
      
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
          {/* Mobile Navigation */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4">
            <div className="grid grid-cols-3 tablet:grid-cols-6 gap-3">
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
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span className="text-xs font-medium truncate w-full text-center">
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
