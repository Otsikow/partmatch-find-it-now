import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Star, TrendingUp, Crown, Eye, EyeOff } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import ImageGallery from "../ImageGallery";
import MonetizationFeatures from "../MonetizationFeatures";

interface PartExpandedDialogProps {
  part: CarPart;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPartForBoost: string | null;
  hasBusinessSubscription: boolean;
  onEdit: (part: CarPart) => void;
  onDelete: (partId: string) => void;
  onUpdateStatus: (partId: string, newStatus: string) => void;
  onToggleBoost: (partId: string | null) => void;
  onFeatureUpdate: () => void;
}

const PartExpandedDialog = ({ 
  part, 
  isOpen, 
  onOpenChange,
  selectedPartForBoost,
  hasBusinessSubscription,
  onEdit,
  onDelete,
  onUpdateStatus,
  onToggleBoost,
  onFeatureUpdate
}: PartExpandedDialogProps) => {
  const isPartFeatured = (part: CarPart) => {
    return part.featured_until && new Date(part.featured_until) > new Date();
  };

  const isPartBoosted = (part: CarPart) => {
    return part.boosted_until && new Date(part.boosted_until) > new Date();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this part? This action cannot be undone.')) {
      onDelete(part.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {part.title}
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
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image Gallery */}
          {part.images && part.images.length > 0 && (
            <ImageGallery 
              images={part.images} 
              title={part.title}
              className="mb-6"
            />
          )}

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Vehicle Details</h4>
              <p className="text-gray-600">{part.make} {part.model} ({part.year})</p>
              <p className="text-gray-600">Part Type: {part.part_type}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
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

          {part.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{part.description}</p>
            </div>
          )}

          {part.address && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{part.address}</span>
            </div>
          )}

          {/* Monetization Features */}
          {selectedPartForBoost === part.id && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <MonetizationFeatures
                partId={part.id}
                currentPhotoCount={part.images?.length || 0}
                isFeatured={isPartFeatured(part)}
                isBoosted={isPartBoosted(part)}
                hasBusinessSubscription={hasBusinessSubscription}
                onFeatureUpdate={onFeatureUpdate}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(part.id, part.status === 'hidden' ? 'available' : 'hidden')}
              className="flex items-center justify-center gap-1"
            >
              {part.status === 'hidden' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {part.status === 'hidden' ? 'Show' : 'Hide'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleBoost(selectedPartForBoost === part.id ? null : part.id)}
              className="flex items-center justify-center gap-1"
            >
              <Crown className="h-4 w-4" />
              {selectedPartForBoost === part.id ? 'Hide Promote' : 'Promote'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onEdit(part);
                onOpenChange(false);
              }}
              className="flex items-center justify-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center justify-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartExpandedDialog;