
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

  const formatPrice = (price: number, currency: string, country?: string) => {
    // If it's Ghana, force GHS currency regardless of what's stored
    if (country?.toLowerCase().includes('ghana')) {
      return `GHS ${price.toLocaleString()}`;
    }
    
    // Use proper currency symbols based on currency code
    switch (currency?.toUpperCase()) {
      case 'GHS':
        return `GHS ${price.toLocaleString()}`;
      case 'USD':
        return `$${price.toLocaleString()}`;
      case 'EUR':
        return `€${price.toLocaleString()}`;
      case 'GBP':
        return `£${price.toLocaleString()}`;
      case 'NGN':
        return `₦${price.toLocaleString()}`;
      default:
        return `${currency || 'GHS'} ${price.toLocaleString()}`;
    }
  };

  console.log('CarPartExpandedDialog - sellerName:', sellerName, 'for part:', part.title);
  console.log('CarPartExpandedDialog - profiles data:', part.profiles);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 pr-8">
            <span className="line-clamp-2">{part.title}</span>
            <SaveButton 
              partId={part.id} 
              size="sm"
              showText={true}
              className="self-start sm:self-auto"
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Image Gallery */}
          {part.images && part.images.length > 0 && (
            <ImageGallery 
              images={part.images} 
              title={part.title}
              className="mb-4 sm:mb-6"
            />
          )}

          {/* Mobile-first grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Vehicle Details</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">{part.make} {part.model} ({part.year})</p>
                  <p className="text-gray-600">Part Type: {part.part_type}</p>
                </div>
              </div>

              {part.address && (
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Location</h4>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{part.address}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Price</h4>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {formatPrice(part.price, part.currency, (part as any).country)}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Seller</h4>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarFallback className="text-xs sm:text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">{sellerName}</span>
                </div>
              </div>
            </div>
          </div>

          {part.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{part.description}</p>
            </div>
          )}

          <div className="border-t pt-3 sm:pt-4">
            <PriceComparisonSection currentPart={part} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <ChatButton
              sellerId={part.supplier_id}
              partId={part.id}
              size="default"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 justify-center"
            />
            <Button 
              onClick={onContact}
              variant="outline"
              size="default"
              className="flex-1 border-green-600 text-green-700 hover:bg-green-50 justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Contact </span>Seller
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarPartExpandedDialog;
