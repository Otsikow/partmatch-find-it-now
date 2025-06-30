
import { useAuth } from "@/contexts/AuthContext";
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

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('Buyer');
  const [activeSection, setActiveSection] = useState('orders');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Sample count
  const { pendingRatings } = useTransactionRating();

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
        return <MyOrders />; // Same as orders but could be filtered for completed orders
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <PageHeader 
        title={`Welcome ${displayName}`}
        subtitle={getSectionTitle()}
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Show pending rating notifications */}
        {pendingRatings.length > 0 && <PendingRatingNotification />}
        
        <div className="flex gap-6 min-h-[600px]">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <BuyerSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              unreadMessages={unreadMessages}
              unreadNotifications={unreadNotifications}
            />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden w-full mb-6">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'orders', label: 'Orders' },
                  { id: 'messages', label: 'Messages' },
                  { id: 'saved-parts', label: 'Saved' },
                  { id: 'notifications', label: 'Alerts' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'rate-sellers', label: 'Rate' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
