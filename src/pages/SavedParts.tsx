import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft, Trash2, Share, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import { useIsMobile } from "@/hooks/use-mobile";

const SavedPartsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: savedParts = [], isLoading, refetch } = useQuery({
    queryKey: ['saved-parts-page', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('SavedParts: No user found');
        return [];
      }
      
      console.log('SavedParts: Fetching for user:', user.id);
      
      const { data, error } = await supabase
        .from('saved_parts')
        .select(`
          *,
          car_parts (
            id,
            title,
            price,
            currency,
            images,
            location,
            city,
            country,
            condition,
            make,
            model,
            year,
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
        .order('created_at', { ascending: false });

      console.log('SavedParts: Query result:', { data, error });

      if (error) {
        console.error('Error fetching saved parts:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user
  });

  const handleRemoveSaved = async (savedPartId: string) => {
    if (!user) return;
    
    setDeletingId(savedPartId);
    try {
      const { error } = await supabase
        .from('saved_parts')
        .delete()
        .eq('id', savedPartId)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to remove from saved parts');
        console.error('Error removing saved part:', error);
        return;
      }

      toast.success('Removed from saved parts');
      refetch();
    } catch (error) {
      toast.error('Failed to remove from saved parts');
      console.error('Error removing saved part:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number, currency: string = 'GHS') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Saved Parts</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {isMobile && <MobileBottomTabs />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Saved Parts</h1>
              <p className="text-muted-foreground">
                {savedParts.length} part{savedParts.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Your watchlist
            </span>
          </div>
        </div>

        {savedParts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No saved parts yet</h3>
              <p className="text-muted-foreground mb-6">
                Start saving parts you're interested in to build your watchlist
              </p>
              <Button asChild>
                <Link to="/search-parts">
                  Browse Parts
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedParts.map((savedItem: any) => {
              const part = savedItem.car_parts;
              if (!part) return null;

              const seller = part.profiles;
              const mainImage = part.images?.[0] || '/placeholder.svg';
              
              return (
                <Card 
                  key={savedItem.id} 
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/part/${part.id}`)}
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={mainImage}
                      alt={part.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSaved(savedItem.id);
                        }}
                        disabled={deletingId === savedItem.id}
                      >
                        {deletingId === savedItem.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-xs text-muted-foreground">
                        Saved {formatDate(savedItem.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                        {part.title}
                      </h3>
                    </div>
                    
                    <div className="text-2xl font-bold text-primary mb-2">
                      {formatPrice(part.price, part.currency)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {part.make} {part.model} ({part.year}) • {part.condition}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      📍 {part.city && part.country ? `${part.city}, ${part.country}` : part.location}
                    </div>
                    
                    {seller && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {seller.first_name} {seller.last_name}
                          </span>
                          {seller.is_verified && (
                            <span className="text-blue-600">✓</span>
                          )}
                        </div>
                        {seller.total_ratings > 0 && (
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{Number(seller.rating).toFixed(1)}</span>
                            <span className="text-muted-foreground">
                              ({seller.total_ratings})
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/part/${part.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat?seller=${part.supplier_id}&part=${part.id}`);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
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
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
      {isMobile && <MobileBottomTabs />}
    </div>
  );
};

export default SavedPartsPage;