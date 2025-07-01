
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Phone, User, Expand } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import VerifiedSellerBadge from "./VerifiedSellerBadge";
import ChatButton from "./chat/ChatButton";
import SaveButton from "./SaveButton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CarPartCardProps {
  part: CarPart;
  onContact?: () => void;
}

const CarPartCard = ({ part, onContact }: CarPartCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'used':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'refurbished':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get the first valid image URL
  const getImageUrl = () => {
    if (part.images && part.images.length > 0) {
      const firstImage = part.images[0];
      console.log('Displaying image URL:', firstImage);
      // Ensure we have a proper URL format
      if (firstImage.startsWith('http')) {
        return firstImage;
      }
      // Handle relative URLs by making them absolute
      return firstImage;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <>
      <Card className="w-full max-w-sm bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden cursor-pointer">
        {/* Image Section */}
        <div onClick={() => setIsExpanded(true)}>
          {imageUrl ? (
            <div className="relative h-48 bg-gray-100">
              <img
                src={imageUrl}
                alt={part.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('hidden');
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUrl);
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <SaveButton 
                  partId={part.id} 
                  size="sm" 
                  variant="ghost"
                  className="bg-white/90 hover:bg-white shadow-sm"
                />
                <Badge 
                  variant="secondary" 
                  className={`${getConditionColor(part.condition)} font-semibold`}
                >
                  {part.condition}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2">
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-sm">No Image Available</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <SaveButton 
                  partId={part.id} 
                  size="sm" 
                  variant="ghost"
                  className="bg-white/90 hover:bg-white shadow-sm"
                />
                <Badge 
                  variant="secondary" 
                  className={`${getConditionColor(part.condition)} font-semibold`}
                >
                  {part.condition}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2">
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div onClick={() => setIsExpanded(true)}>
          <CardHeader className="pb-3">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                {part.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {part.make} {part.model} ({part.year})
                </p>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    {part.currency} {part.price}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-3">
            <div className="space-y-3">
              {part.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {part.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Seller</span>
                <VerifiedSellerBadge isVerified={false} size="sm" />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{part.address}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Listed {formatDate(part.created_at)}</span>
              </div>
            </div>
          </CardContent>
        </div>

        <CardFooter className="pt-3 space-y-2">
          <div className="flex gap-2 w-full">
            <ChatButton
              sellerId={part.supplier_id}
              partId={part.id}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            />
            <SaveButton 
              partId={part.id} 
              size="default"
              variant="outline"
              className="border-red-200 hover:bg-red-50"
            />
          </div>
          
          <Button 
            onClick={onContact}
            variant="outline"
            className="w-full border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact Seller
          </Button>
        </CardFooter>
      </Card>

      {/* Expanded View Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
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
    </>
  );
};

export default CarPartCard;
