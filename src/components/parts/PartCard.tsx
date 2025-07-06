import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Star, TrendingUp, Crown } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import MonetizationFeatures from "../MonetizationFeatures";

interface PartCardProps {
  part: CarPart;
  selectedPartForBoost: string | null;
  hasBusinessSubscription: boolean;
  onEdit: (part: CarPart) => void;
  onDelete: (partId: string) => void;
  onUpdateStatus: (partId: string, newStatus: string) => void;
  onToggleBoost: (partId: string | null) => void;
  onFeatureUpdate: () => void;
}

const PartCard = ({ 
  part, 
  selectedPartForBoost,
  hasBusinessSubscription,
  onEdit,
  onDelete,
  onUpdateStatus,
  onToggleBoost,
  onFeatureUpdate
}: PartCardProps) => {
  const isPartFeatured = (part: CarPart) => {
    return part.featured_until && new Date(part.featured_until) > new Date();
  };

  const isPartBoosted = (part: CarPart) => {
    return part.boosted_until && new Date(part.boosted_until) > new Date();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this part? This action cannot be undone.')) {
      onDelete(part.id);
    }
  };

  return (
    <Card className="p-4 sm:p-6">
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
            onFeatureUpdate={onFeatureUpdate}
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateStatus(part.id, part.status === 'hidden' ? 'available' : 'hidden')}
          className="flex items-center justify-center gap-1 text-xs sm:text-sm"
        >
          {part.status === 'hidden' ? <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />}
          <span className="hidden xs:inline">{part.status === 'hidden' ? 'Show' : 'Hide'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleBoost(selectedPartForBoost === part.id ? null : part.id)}
          className="flex items-center justify-center gap-1 text-xs sm:text-sm"
        >
          <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">{selectedPartForBoost === part.id ? 'Hide' : 'Promote'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(part)}
          className="flex items-center justify-center gap-1 text-xs sm:text-sm"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Edit</span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex items-center justify-center gap-1 text-xs sm:text-sm"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Delete</span>
        </Button>
      </div>
    </Card>
  );
};

export default PartCard;