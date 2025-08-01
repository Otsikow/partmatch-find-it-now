import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Eye, MessageCircle, Share } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/PageHeader";

const RecentViewsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [clearingAll, setClearingAll] = useState(false);

  const { data: recentViews = [], isLoading, refetch } = useQuery({
    queryKey: ['recent-views-page', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('recent_views')
        .select(`
          *,
          car_parts (
            id,
            title,
            price,
            currency,
            images,
            city,
            country,
            condition,
            make,
            model,
            year,
            status,
            created_at,
            supplier_id,
            profiles!car_parts_supplier_id_fkey (
              first_name,
              last_name,
              rating,
              total_ratings,
              is_verified
            )
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching recent views:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user
  });

  const handleClearAll = async () => {
    if (!user) return;
    
    setClearingAll(true);
    try {
      const { error } = await supabase
        .from('recent_views')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to clear recent views');
        console.error('Error clearing recent views:', error);
        return;
      }

      toast.success('Recent views cleared');
      refetch();
    } catch (error) {
      toast.error('Failed to clear recent views');
      console.error('Error clearing recent views:', error);
    } finally {
      setClearingAll(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'GHS') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const viewDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - viewDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - viewDate.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
    }
  };

  const groupViewsByDate = (views: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    views.forEach(view => {
      const viewDate = new Date(view.viewed_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      if (viewDate.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (viewDate.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = viewDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(view);
    });
    
    return groups;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader 
          title="Recent Views" 
          subtitle="Your browsing history"
          showBackButton 
        />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-6 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {isMobile && <MobileBottomTabs />}
      </div>
    );
  }

  const groupedViews = groupViewsByDate(recentViews);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Recent Views" 
        subtitle={`${recentViews.length} part${recentViews.length !== 1 ? 's' : ''} viewed recently`}
        showBackButton 
      />
      
      <div className="container mx-auto px-4 py-8">
        {recentViews.length > 0 && (
          <div className="flex items-center justify-end mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              disabled={clearingAll}
            >
              {clearingAll ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              Clear All
            </Button>
          </div>
        )}

        {recentViews.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recent views</h3>
              <p className="text-muted-foreground mb-6">
                Parts you view will appear here for easy access
              </p>
              <Button asChild>
                <Link to="/search-parts">
                  Browse Parts
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedViews).map(([dateGroup, views]) => (
              <div key={dateGroup}>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                  {dateGroup}
                </h2>
                <div className="space-y-3">
                  {views.map((viewItem: any) => {
                    const part = viewItem.car_parts;
                    if (!part) return null;

                    const seller = part.profiles;
                    const mainImage = part.images?.[0] || '/placeholder.svg';
                    const isUnavailable = part.status !== 'available';
                    
                    return (
                      <Card 
                        key={viewItem.id} 
                        className={`group hover:shadow-md transition-all duration-200 cursor-pointer ${
                          isUnavailable ? 'opacity-60' : ''
                        }`}
                        onClick={() => navigate(`/part/${part.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <img
                                src={mainImage}
                                alt={part.title}
                                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                              />
                              {isUnavailable && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">
                                    Sold
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg line-clamp-1 flex-1">
                                  {part.title}
                                </h3>
                                <div className="flex items-center gap-2 ml-4">
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {formatRelativeTime(viewItem.viewed_at)}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 mb-2">
                                <div className="text-xl font-bold text-primary">
                                  {formatPrice(part.price, part.currency)}
                                </div>
                                {isUnavailable && (
                                  <Badge variant="destructive">
                                    No longer available
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="text-sm text-muted-foreground mb-2">
                                {part.make} {part.model} ({part.year}) • {part.condition}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                  📍 {part.city && part.country ? `${part.city}, ${part.country}` : part.location}
                                </div>
                                
                                {seller && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">
                                      {seller.first_name} {seller.last_name}
                                    </span>
                                    {seller.is_verified && (
                                      <span className="text-blue-600">✓</span>
                                    )}
                                    {seller.total_ratings > 0 && (
                                      <div className="flex items-center gap-1">
                                        <span>⭐</span>
                                        <span>{Number(seller.rating).toFixed(1)}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex gap-2 mt-3">
                                <Button 
                                  size="sm"
                                  disabled={isUnavailable}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/part/${part.id}`);
                                  }}
                                >
                                  View Again
                                </Button>
                                {!isUnavailable && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/chat?seller=${part.supplier_id}&part=${part.id}`);
                                      }}
                                    >
                                      <MessageCircle className="w-4 h-4 mr-1" />
                                      Contact
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (navigator.share) {
                                          navigator.share({
                                            title: part.title,
                                            text: `Check out this ${part.title} on PartMatch`,
                                            url: window.location.origin + `/part/${part.id}`
                                          });
                                        } else {
                                          navigator.clipboard.writeText(window.location.origin + `/part/${part.id}`);
                                          toast.success('Link copied to clipboard');
                                        }
                                      }}
                                    >
                                      <Share className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
      {isMobile && <MobileBottomTabs />}
    </div>
  );
};

export default RecentViewsPage;