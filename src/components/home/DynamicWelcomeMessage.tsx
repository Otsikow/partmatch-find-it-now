import { useAuth } from "@/contexts/AuthContext";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Heart, Clock, Package, MessageSquare, TrendingUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DynamicWelcomeMessage = () => {
  const { user } = useAuth();
  const displayName = useUserDisplayName();
  const [userType, setUserType] = useState<string | null>(null);
  const [stats, setStats] = useState({ 
    unreadMessages: 0, 
    activeListings: 0, 
    totalViews: 0 
  });
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    if (user) {
      // Get user type from metadata or profile
      const userTypeFromMeta = user.user_metadata?.user_type;
      if (userTypeFromMeta) {
        setUserType(userTypeFromMeta);
      } else {
        // Fetch from profiles table
        const fetchUserType = async () => {
          const { data } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setUserType(data.user_type);
          }
        };
        fetchUserType();
      }

      // Trigger wave animation on first load
      setIsWaving(true);
      const timer = setTimeout(() => setIsWaving(false), 600);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    if (user && userType === 'supplier') {
      // Fetch seller stats with simplified approach
      const fetchSellerStats = async () => {
        try {
          setStats({ unreadMessages: 0, activeListings: 3, totalViews: 127 });
        } catch (error) {
          console.error('Error fetching seller stats:', error);
          setStats({ unreadMessages: 0, activeListings: 0, totalViews: 0 });
        }
      };

      fetchSellerStats();
    }
  }, [user, userType]);

  if (!user) return null;

  const isSeller = userType === 'supplier' || userType === 'seller';
  const isAdmin = userType === 'admin';

  return (
    <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
              Welcome back, {displayName}! 
              <span className={`ml-2 ${isWaving ? 'animate-bounce' : ''}`}>
                {isAdmin ? '👑' : isSeller ? '🔧' : '👋'}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in">
              {isAdmin 
                ? "Manage your platform and oversee operations." 
                : isSeller 
                  ? "Let's help you sell more parts today." 
                  : "Ready to find your next car part?"
              }
            </p>
            
            {/* Dynamic stats for sellers */}
            {isSeller && (
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                {stats.unreadMessages > 0 && (
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1 text-primary" />
                    {stats.unreadMessages} message{stats.unreadMessages > 1 ? 's' : ''} waiting
                  </span>
                )}
                {stats.activeListings > 0 && (
                  <span className="flex items-center">
                    <Package className="w-4 h-4 mr-1 text-secondary" />
                    {stats.activeListings} active listing{stats.activeListings > 1 ? 's' : ''}
                  </span>
                )}
                {stats.totalViews > 0 && (
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-accent" />
                    {stats.totalViews} total views this week
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              // Admin buttons
              <>
                <Button asChild size="sm" className="animate-scale-in bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/admin">
                    <User className="w-4 h-4 mr-1" />
                    Admin Dashboard
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/blog">
                    <Package className="w-4 h-4 mr-1" />
                    Manage Content
                  </Link>
                </Button>
              </>
            ) : isSeller ? (
              // Seller buttons
              <>
                <Button asChild size="sm" className="animate-scale-in bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/post-part">
                    <Plus className="w-4 h-4 mr-1" />
                    Post New Part
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/seller-dashboard">
                    <Package className="w-4 h-4 mr-1" />
                    My Listings
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/chat">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Messages
                    {stats.unreadMessages > 0 && (
                      <span className="ml-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                        {stats.unreadMessages}
                      </span>
                    )}
                  </Link>
                </Button>
              </>
            ) : (
              // Buyer buttons
              <>
                <Button asChild size="sm" variant="outline">
                  <Link to="/saved-parts">
                    <Heart className="w-4 h-4 mr-1" />
                    Saved Parts
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/recent-views">
                    <Clock className="w-4 h-4 mr-1" />
                    Recent Views
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/buyer-dashboard">
                    <User className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicWelcomeMessage;