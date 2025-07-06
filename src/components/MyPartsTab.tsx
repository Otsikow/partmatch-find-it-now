import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Eye, EyeOff, Star, TrendingUp, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CarPart } from "@/types/CarPart";
import MonetizationFeatures from "./MonetizationFeatures";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface MyPartsTabProps {
  onRefresh: () => void;
}

const MyPartsTab = ({ onRefresh }: MyPartsTabProps) => {
  const { user } = useAuth();
  const { hasBusinessSubscription } = useSubscriptionStatus();
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartForBoost, setSelectedPartForBoost] = useState<string | null>(null);
  const [editingPart, setEditingPart] = useState<CarPart | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    make: '',
    model: '',
    year: '',
    part_type: '',
    condition: '',
    price: '',
    address: ''
  });

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

  const handleEditPart = (part: CarPart) => {
    setEditingPart(part);
    setEditFormData({
      title: part.title,
      description: part.description || '',
      make: part.make,
      model: part.model,
      year: part.year.toString(),
      part_type: part.part_type,
      condition: part.condition,
      price: part.price.toString(),
      address: part.address || ''
    });
  };

  const handleUpdatePart = async () => {
    if (!editingPart) return;

    setEditLoading(true);
    try {
      const price = parseFloat(editFormData.price);
      const year = parseInt(editFormData.year);

      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid price.",
          variant: "destructive"
        });
        return;
      }

      if (isNaN(year) || year < 1990 || year > new Date().getFullYear()) {
        toast({
          title: "Invalid Year",
          description: "Please enter a valid year.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('car_parts')
        .update({
          title: editFormData.title.trim(),
          description: editFormData.description.trim() || null,
          make: editFormData.make.trim(),
          model: editFormData.model.trim(),
          year: year,
          part_type: editFormData.part_type,
          condition: editFormData.condition,
          price: price,
          address: editFormData.address.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPart.id);

      if (error) throw error;

      // Update the local state
      setParts(prev => prev.map(part => 
        part.id === editingPart.id 
          ? { 
              ...part, 
              title: editFormData.title.trim(),
              description: editFormData.description.trim() || null,
              make: editFormData.make.trim(),
              model: editFormData.model.trim(),
              year: year,
              part_type: editFormData.part_type,
              condition: editFormData.condition as 'New' | 'Used' | 'Refurbished',
              price: price,
              address: editFormData.address.trim()
            }
          : part
      ));

      toast({
        title: "Success",
        description: "Part updated successfully.",
      });

      setEditingPart(null);
    } catch (error) {
      console.error('Error updating part:', error);
      toast({
        title: "Error",
        description: "Failed to update part.",
        variant: "destructive"
      });
    } finally {
      setEditLoading(false);
    }
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
                  <Badge>
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {isPartBoosted(part) && (
                  <Badge>
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
                <Badge>
                  {part.condition}
                </Badge>
                <Badge>
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
                hasBusinessSubscription={hasBusinessSubscription}
                onFeatureUpdate={fetchMyParts}
              />
            </div>
          )}

          <div className="grid grid-cols-2 sm:flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePartStatus(part.id, part.status === 'hidden' ? 'available' : 'hidden')}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              {part.status === 'hidden' ? <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />}
              <span className="hidden xs:inline">{part.status === 'hidden' ? 'Show' : 'Hide'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPartForBoost(
                selectedPartForBoost === part.id ? null : part.id
              )}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{selectedPartForBoost === part.id ? 'Hide' : 'Promote'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditPart(part)}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deletePart(part.id)}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Delete</span>
            </Button>
          </div>
        </Card>
      ))}

      {/* Edit Part Modal */}
      <Dialog open={!!editingPart} onOpenChange={() => setEditingPart(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Car Part</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Part Title *</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Front Brake Pads for Toyota Camry"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the condition, compatibility, and any additional details..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-make">Car Make *</Label>
                <Input
                  id="edit-make"
                  value={editFormData.make}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="Toyota"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-model">Car Model *</Label>
                <Input
                  id="edit-model"
                  value={editFormData.model}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Camry"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-year">Year *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={editFormData.year}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2020"
                  min="1990"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Part Type *</Label>
                <Select 
                  value={editFormData.part_type} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, part_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select part type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engine">Engine</SelectItem>
                    <SelectItem value="Transmission">Transmission</SelectItem>
                    <SelectItem value="Brakes">Brakes</SelectItem>
                    <SelectItem value="Suspension">Suspension</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Body">Body</SelectItem>
                    <SelectItem value="Interior">Interior</SelectItem>
                    <SelectItem value="Tires & Wheels">Tires & Wheels</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condition *</Label>
                <Select 
                  value={editFormData.condition} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, condition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (GHS) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="150.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Location/Address *</Label>
                <Input
                  id="edit-address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Accra, Greater Accra"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleUpdatePart}
                disabled={editLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {editLoading ? 'Updating...' : 'Update Part'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingPart(null)}
                disabled={editLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPartsTab;
