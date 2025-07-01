
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import SaveButton from "./SaveButton";
import ChatButton from "./chat/ChatButton";
import VerifiedSellerBadge from "./VerifiedSellerBadge";
import SellerRatingDisplay from "./SellerRatingDisplay";
import { getConditionColor } from "@/utils/carPartUtils";

interface CarPartExpandedDialogProps {
  part: CarPart;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact?: () => void;
}

const CarPartExpandedDialog = ({ part, isOpen, onOpenChange, onContact }: CarPartExpandedDialogProps) => {
  // Get seller name from profiles data - since business_name doesn't exist in profiles table, 
  // we'll use first_name and last_name, or fallback to 'Seller'
  const sellerName = `${part.profiles?.first_name || ''} ${part.profiles?.last_name || ''}`.trim() || 'Seller';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {part.title}
            <SaveButton 
              partId={part.id} 
              size="sm"
              showText={true}
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image Gallery */}
          {part.images && part.images.length > 0 && (
            <div className="space-y-2">
              <img
                src={part.images[0]}
                alt={part.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              {part.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {part.images.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${part.title} ${index + 2}`}
                      className="w-full h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900">Vehicle Details</h4>
              <p className="text-gray-600">{part.make} {part.model} ({part.year})</p>
              <p className="text-gray-600">Part Type: {part.part_type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Price & Condition</h4>
              <p className="text-2xl font-bold text-green-600">{part.currency} {part.price}</p>
              <Badge className={getConditionColor(part.condition)}>
                {part.condition}
              </Badge>
            </div>
          </div>

          {part.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{part.description}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{part.address}</span>
          </div>

          {/* Seller Information Section */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Seller Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">{sellerName}</span>
                <VerifiedSellerBadge isVerified={part.profiles?.is_verified || false} size="sm" />
              </div>
              
              <SellerRatingDisplay
                rating={part.profiles?.rating || 0}
                totalRatings={part.profiles?.total_ratings || 0}
                size="md"
                showBadge={true}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <ChatButton
              sellerId={part.supplier_id}
              partId={part.id}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
            />
            <Button 
              onClick={onContact}
              variant="outline"
              className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
            >
              <Phone className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarPartExpandedDialog;
