import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Eye, MousePointer, Calendar, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useListingAnalytics } from "@/hooks/useListingAnalytics";
import PromotionSuggestionsModal from "./PromotionSuggestionsModal";
import { supabase } from "@/integrations/supabase/client";

interface ListingPerformance {
  id: string;
  title: string;
  view_count: number;
  click_count: number;
  created_at: string;
  price: number;
  currency: string;
  is_featured: boolean;
  boosted_until?: string;
  last_suggested_promotion?: string;
}

const SellerPromotionDashboard = () => {
  const { user } = useAuth();
  const { checkForPromotionSuggestions } = useListingAnalytics();
  const [listings, setListings] = useState<ListingPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingPerformance | null>(null);
  const [promotionSuggestions, setPromotionSuggestions] = useState([]);

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('car_parts')
        .select('id, title, view_count, click_count, created_at, price, currency, is_featured, boosted_until, last_suggested_promotion')
        .eq('supplier_id', user.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching listings:', error);
        return;
      }

      setListings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSuggestions = async (listing: ListingPerformance) => {
    try {
      setSelectedListing(listing);
      const suggestionData = await checkForPromotionSuggestions(listing.id);
      
      if (suggestionData?.suggestions && suggestionData.suggestions.length > 0) {
        setPromotionSuggestions(suggestionData.suggestions);
        setShowPromotionModal(true);
      } else {
        setPromotionSuggestions([]);
        setShowPromotionModal(true);
      }
    } catch (error) {
      console.error('Error checking suggestions:', error);
    }
  };

  const getListingAge = (createdAt: string) => {
    const days = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getPerformanceStatus = (listing: ListingPerformance) => {
    const age = getListingAge(listing.created_at);
    const views = listing.view_count || 0;
    const clicks = listing.click_count || 0;
    
    if (age <= 1) return { status: 'new', color: 'blue' };
    if (views < 5 && age >= 3) return { status: 'low', color: 'red' };
    if (views < 10 && age >= 7) return { status: 'poor', color: 'red' };
    if (views >= 20) return { status: 'good', color: 'green' };
    return { status: 'average', color: 'yellow' };
  };

  const shouldShowSuggestion = (listing: ListingPerformance) => {
    if (!listing.last_suggested_promotion) return true;
    
    const daysSinceLastSuggestion = Math.floor(
      (new Date().getTime() - new Date(listing.last_suggested_promotion).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceLastSuggestion >= 7;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading your listings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Listing Performance & Promotion Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <Alert>
              <AlertDescription>
                You don't have any active listings yet. Create your first listing to see performance data.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => {
                const performance = getPerformanceStatus(listing);
                const age = getListingAge(listing.created_at);
                const canSuggest = shouldShowSuggestion(listing);
                
                return (
                  <Card key={listing.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-sm">{listing.title}</h4>
                            <Badge 
                              variant={performance.color === 'green' ? 'default' : 'secondary'}
                              className={`text-xs ${
                                performance.color === 'red' ? 'bg-red-100 text-red-800' :
                                performance.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                performance.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {performance.status}
                            </Badge>
                            {listing.is_featured && (
                              <Badge className="text-xs bg-orange-100 text-orange-800">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {listing.view_count || 0} views
                            </div>
                            <div className="flex items-center gap-1">
                              <MousePointer className="h-3 w-3" />
                              {listing.click_count || 0} clicks
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {age} days old
                            </div>
                            <div className="font-medium text-foreground">
                              {listing.currency} {listing.price}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {canSuggest && (performance.status === 'low' || performance.status === 'poor' || age <= 1) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCheckSuggestions(listing)}
                              className="text-xs"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Boost Options
                            </Button>
                          )}
                          
                          {!canSuggest && (
                            <div className="text-xs text-muted-foreground">
                              Suggested recently
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promotion Suggestions Modal */}
      <PromotionSuggestionsModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        suggestions={promotionSuggestions}
        listingId={selectedListing?.id || ""}
        listingTitle={selectedListing?.title || ""}
        listingAnalytics={selectedListing ? {
          views: selectedListing.view_count || 0,
          clicks: selectedListing.click_count || 0,
          age_days: getListingAge(selectedListing.created_at)
        } : undefined}
      />
    </>
  );
};

export default SellerPromotionDashboard;