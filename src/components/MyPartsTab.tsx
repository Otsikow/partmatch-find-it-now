import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Star, TrendingUp, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CarPart } from "@/types/CarPart";
import MonetizationFeatures from "./MonetizationFeatures";

interface MyPartsTabProps {
  onRefresh: () => void;
}

const MyPartsTab = ({ onRefresh }: MyPartsTabProps) => {
  const { user } = useAuth();
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartForBoost, setSelectedPartForBoost] = useState<string | null>(null);

  useEffect(() => {
    fetchMyParts();
  }, [user]);

  const fetchMyParts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('car_parts')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedParts = (data || []).map(part => ({
        ...part,
        condition: part.condition as 'New' | 'Used' | 'Refurbished',
        status: part.status as 'available' | 'sold' | 'hidden' | 'pending'
      }));
      
      setParts(typedParts);
    } catch (error) {
      console.error('Error fetching parts:', error);
      toast({
        title: "Error",
        description: "Failed to load your parts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePartStatus = async (partId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('car_parts')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', partId);

      if (error) throw error;

      setParts(prev => prev.map(part => 
        part.id === partId ? { ...part, status: newStatus as 'available' | 'sold' | 'hidden' | 'pending' } : part
      ));

      toast({
        title: "Success",
        description: `Part ${newStatus === 'hidden' ? 'hidden' : 'made visible'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating part:', error);
      toast({
        title: "Error",
        description: "Failed to update part status.",
        variant: "destructive"
      });
    }
  };

  const deletePart = async (partId: string) => {
    if (!confirm('Are you sure you want to delete this part? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('car_parts')
        .delete()
        .eq('id', partId);

      if (error) throw error;

      setParts(prev => prev.filter(part => part.id !== partId));
      toast({
        title: "Success",
        description: "Part deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting part:', error);
      toast({
        title: "Error",
        description: "Failed to delete part.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'hidden': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Used': return 'bg-blue-100 text-blue-800';
      case 'Refurbished': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isPartFeatured = (part: CarPart) => {
    return part.featured_until && new Date(part.featured_until) > new Date();
  };

  const isPartBoosted = (part: CarPart) => {
    return part.boosted_until && new Date(part.boosted_until) > new Date();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your parts...</p>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600 mb-4">You haven't posted any parts yet.</p>
        <p className="text-sm text-gray-500">Click "Post New Part" to get started.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {parts.map((part) => (
        <Card key={part.id} className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{part.title}</h3>
                {isPartFeatured(part) && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {isPartBoosted(part) && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Boosted
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-2">
                {part.make} {part.model} ({part.year}) - {part.part_type}
              </p>
              {part.description && (
                <p className="text-sm text-gray-600 mb-3">{part.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getConditionColor(part.condition)}>
                  {part.condition}
                </Badge>
                <Badge className={getStatusColor(part.status)}>
                  {part.status}
                </Badge>
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="text-xl font-bold text-orange-600">
                {part.currency} {part.price}
              </p>
              <p className="text-xs text-gray-500">
                Posted {new Date(part.created_at).toLocaleDateString()}
              </p>
              {(isPartFeatured(part) || isPartBoosted(part)) && (
                <div className="mt-1 text-xs text-gray-500">
                  {isPartFeatured(part) && (
                    <div>Featured until {new Date(part.featured_until!).toLocaleDateString()}</div>
                  )}
                  {isPartBoosted(part) && (
                    <div>Boosted until {new Date(part.boosted_until!).toLocaleDateString()}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {part.images && part.images.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {part.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${part.title} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border flex-shrink-0"
                />
              ))}
            </div>
          )}

          {/* Monetization Features */}
          {selectedPartForBoost === part.id && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <MonetizationFeatures
                partId={part.id}
                currentPhotoCount={part.images?.length || 0}
                isFeatured={isPartFeatured(part)}
                isBoosted={isPartBoosted(part)}
                hasBusinessSubscription={false} // This would come from user's subscription status
                onFeatureUpdate={fetchMyParts}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePartStatus(part.id, part.status === 'hidden' ? 'available' : 'hidden')}
              className="flex items-center gap-1"
            >
              {part.status === 'hidden' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {part.status === 'hidden' ? 'Show' : 'Hide'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPartForBoost(
                selectedPartForBoost === part.id ? null : part.id
              )}
              className="flex items-center gap-1"
            >
              <Crown className="h-4 w-4" />
              {selectedPartForBoost === part.id ? 'Hide Options' : 'Promote'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deletePart(part.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MyPartsTab;
