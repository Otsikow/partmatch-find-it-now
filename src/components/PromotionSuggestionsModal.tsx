import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Target, Camera, TrendingUp } from "lucide-react";

interface PromotionSuggestion {
  type: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  icon: string;
  benefits: string[];
  criteria: any;
}

interface PromotionSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: PromotionSuggestion[];
  listingId: string;
  listingTitle: string;
  listingAnalytics?: {
    views: number;
    clicks: number;
    age_days: number;
  };
}

const getIconComponent = (type: string) => {
  switch (type) {
    case 'feature':
      return <Sparkles className="h-6 w-6 text-yellow-500" />;
    case 'boost':
      return <Target className="h-6 w-6 text-blue-500" />;
    case 'extra_images':
      return <Camera className="h-6 w-6 text-green-500" />;
    default:
      return <TrendingUp className="h-6 w-6 text-primary" />;
  }
};

const PromotionSuggestionsModal = ({
  isOpen,
  onClose,
  suggestions,
  listingId,
  listingTitle,
  listingAnalytics
}: PromotionSuggestionsModalProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePromotionPurchase = async (suggestion: PromotionSuggestion) => {
    setLoading(suggestion.type);
    
    try {
      // In a real implementation, this would integrate with your payment system
      // For now, we'll simulate the purchase and update the listing
      
      const { error } = await supabase.functions.invoke('process-payment', {
        body: {
          type: 'promotion',
          listingId,
          promotionType: suggestion.type,
          amount: suggestion.price,
          currency: suggestion.currency
        }
      });

      if (error) {
        throw error;
      }

      // Track the conversion
      await supabase.functions.invoke('boost-suggestion-agent', {
        body: {
          action: 'track_conversion',
          suggestionId: `${listingId}_${suggestion.type}` // This would be the actual suggestion ID from the database
        }
      });

      toast({
        title: "Promotion Activated!",
        description: `Your ${suggestion.title.toLowerCase()} promotion is now active.`,
      });

      onClose();
    } catch (error: any) {
      console.error('Promotion purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  if (!suggestions.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Boost Your Listing Performance
          </DialogTitle>
          <DialogDescription>
            Get more views and faster responses for "{listingTitle}"
          </DialogDescription>
        </DialogHeader>

        {listingAnalytics && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Current Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{listingAnalytics.views}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{listingAnalytics.clicks}</div>
                  <div className="text-xs text-muted-foreground">Clicks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{listingAnalytics.age_days}</div>
                  <div className="text-xs text-muted-foreground">Days Live</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="text-sm font-medium text-foreground">Recommended Promotions</div>
          
          {suggestions.map((suggestion, index) => (
            <Card key={suggestion.type} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getIconComponent(suggestion.type)}
                    <div>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {suggestion.currency} {suggestion.price}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-foreground mb-2">Benefits:</div>
                    <ul className="space-y-1">
                      {suggestion.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <Button
                    onClick={() => handlePromotionPurchase(suggestion)}
                    disabled={loading === suggestion.type}
                    className="w-full"
                    size="lg"
                  >
                    {loading === suggestion.type ? "Processing..." : `Activate for ${suggestion.currency} ${suggestion.price}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-4">
          These suggestions are based on your listing's performance and market demand.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionSuggestionsModal;