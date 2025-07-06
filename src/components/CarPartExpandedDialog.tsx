
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import SaveButton from "./SaveButton";
import ChatButton from "./chat/ChatButton";
import VerifiedSellerBadge from "./VerifiedSellerBadge";
import SellerRatingDisplay from "./SellerRatingDisplay";
import PriceComparisonSection from "./PriceComparisonSection";
import ImageGallery from "./ImageGallery";

interface CarPartExpandedDialogProps {
  part: CarPart;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact?: () => void;
}

const CarPartExpandedDialog = ({ part, isOpen, onOpenChange, onContact }: CarPartExpandedDialogProps) => {
  // Fix the seller name construction to handle the profiles structure properly
  const sellerName = part.profiles?.first_name && part.profiles?.last_name 
    ? `${part.profiles.first_name} ${part.profiles.last_name}`.trim()
    : part.profiles?.first_name || part.profiles?.last_name || 'Seller';
  
  const initials = sellerName === 'Seller' 
    ? 'S' 
    : sellerName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();

  console.log('CarPartExpandedDialog - sellerName:', sellerName, 'for part:', part.title);
  console.log('CarPartExpandedDialog - profiles data:', part.profiles);

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
            <ImageGallery 
              images={part.images} 
              title={part.title}
              className="mb-6"
            />
          )}

          <div>
            <h4 className="font-semibold text-gray-900">Vehicle Details</h4>
            <p className="text-gray-600">{part.make} {part.model} ({part.year})</p>
            <p className="text-gray-600">Part Type: {part.part_type}</p>
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

          <div className="border-t pt-4">
            <PriceComparisonSection currentPart={part} />
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
