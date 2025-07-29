import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Star, TrendingUp, Crown } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import { useState } from "react";
import MonetizationFeatures from "../MonetizationFeatures";
import PartExpandedDialog from "./PartExpandedDialog";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const isPartFeatured = (part: CarPart) => {
    return part.is_featured || (part.featured_until && new Date(part.featured_until) > new Date());
  };

  const isPartBoosted = (part: CarPart) => {
    return part.boosted_until && new Date(part.boosted_until) > new Date();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this part? This action cannot be undone.')) {
      onDelete(part.id);
    }
  };

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  return (
    <>
      <Card className="p-3 sm:p-4 lg:p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={handleCardClick}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
            <h3 className="font-semibold text-base sm:text-lg truncate">{part.title}</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {isPartFeatured(part) && (
                <Badge className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {isPartBoosted(part) && (
                <Badge className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Boosted
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mb-2 text-sm sm:text-base">
            {part.make} {part.model} ({part.year}) - {part.part_type}
          </p>
          {part.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{part.description}</p>
          )}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
            <Badge className="text-xs">
              {part.condition}
            </Badge>
            <Badge variant={part.status === 'hidden' ? 'secondary' : 'default'} className="text-xs">
              {part.status === 'hidden' ? 'Hidden from public' : 
               part.status === 'available' ? 'Available' : part.status}
            </Badge>
            {part.status === 'hidden' && (
              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                Not visible to buyers
              </Badge>
            )}
            {/* Inventory Status */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium">Stock:</span>
              <span className={`${
                (part.quantity || 0) === 0 ? 'text-red-600' :
                (part.quantity || 0) <= (part.low_stock_threshold || 2) ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {part.quantity || 0}
              </span>
              {(part.quantity || 0) <= (part.low_stock_threshold || 2) && (part.quantity || 0) > 0 && (
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                  Low Stock
                </Badge>
              )}
              {(part.quantity || 0) === 0 && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right sm:ml-4 shrink-0">
          <p className="text-lg sm:text-xl font-bold text-primary">
            {part.currency} {part.price}
          </p>
          <p className="text-xs text-muted-foreground">
            Posted {new Date(part.created_at).toLocaleDateString()}
          </p>
          {(isPartFeatured(part) || isPartBoosted(part)) && (
            <div className="mt-1 text-xs text-muted-foreground">
              {isPartFeatured(part) && (
                <div>
                  {part.featured_until 
                    ? `Featured until ${new Date(part.featured_until).toLocaleDateString()}`
                    : 'Featured'
                  }
                </div>
              )}
              {isPartBoosted(part) && (
                <div>Boosted until {new Date(part.boosted_until!).toLocaleDateString()}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {part.images && part.images.length > 0 && (
        <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2">
          {part.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${part.title} ${index + 1}`}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-border flex-shrink-0"
              onLoad={() => console.log('PartCard image loaded:', image)}
              onError={(e) => {
                console.error('PartCard image failed to load:', image);
                console.error('Error details:', e);
              }}
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 sm:pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(part.id, part.status === 'hidden' ? 'available' : 'hidden');
          }}
          className="flex items-center justify-center gap-1 text-xs px-2 py-1 h-auto"
        >
          {part.status === 'hidden' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          <span className="hidden sm:inline text-xs">{part.status === 'hidden' ? 'Show' : 'Hide'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBoost(selectedPartForBoost === part.id ? null : part.id);
          }}
          className="flex items-center justify-center gap-1 text-xs px-2 py-1 h-auto"
        >
          <Crown className="h-3 w-3" />
          <span className="hidden sm:inline text-xs">{selectedPartForBoost === part.id ? 'Hide' : 'Promote'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(part);
          }}
          className="flex items-center justify-center gap-1 text-xs px-2 py-1 h-auto"
        >
          <Edit className="h-3 w-3" />
          <span className="hidden sm:inline text-xs">Edit</span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="flex items-center justify-center gap-1 text-xs px-2 py-1 h-auto"
        >
          <Trash2 className="h-3 w-3" />
          <span className="hidden sm:inline text-xs">Delete</span>
        </Button>
      </div>
      </Card>

      <PartExpandedDialog
        part={part}
        isOpen={isExpanded}
        onOpenChange={setIsExpanded}
        selectedPartForBoost={selectedPartForBoost}
        hasBusinessSubscription={hasBusinessSubscription}
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdateStatus={onUpdateStatus}
        onToggleBoost={onToggleBoost}
        onFeatureUpdate={onFeatureUpdate}
      />
    </>
  );
};

export default PartCard;