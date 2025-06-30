
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Calendar, Image as ImageIcon } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import { useState } from "react";

interface CarPartCardProps {
  part: CarPart & {
    profiles?: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      location?: string;
    };
  };
}

const CarPartCard = ({ part }: CarPartCardProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Used': return 'bg-blue-100 text-blue-800';
      case 'Refurbished': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const supplierName = part.profiles 
    ? `${part.profiles.first_name || ''} ${part.profiles.last_name || ''}`.trim()
    : 'Supplier';

  const location = part.profiles?.location || part.address || 'Location not specified';
  const phone = part.profiles?.phone;

  // Get images from the part
  const images = part.images || [];
  const hasImages = images.length > 0;

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Gallery Section */}
      {hasImages && (
        <div className="mb-4">
          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={images[selectedImageIndex]}
              alt={`${part.title} - Image ${selectedImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {!images[selectedImageIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                    selectedImageIndex === index ? 'border-emerald-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1">
          <h3 className="font-playfair font-semibold text-lg sm:text-xl mb-1">{part.title}</h3>
          <p className="text-gray-600 font-crimson text-base sm:text-lg mb-1">
            {part.make} {part.model} ({part.year})
          </p>
          <p className="text-sm text-gray-500 capitalize">{part.part_type}</p>
          {part.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{part.description}</p>
          )}
        </div>
        <div className="text-right ml-4">
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
            {part.currency} {part.price.toLocaleString()}
          </p>
          <Badge className={`${getConditionColor(part.condition)} text-sm sm:text-base mt-1`}>
            {part.condition}
          </Badge>
        </div>
      </div>

      <div className="border-t pt-3 sm:pt-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <p className="font-medium font-inter text-base sm:text-lg">{supplierName}</p>
            <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base font-crimson mb-1">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Calendar className="h-3 w-3" />
              {new Date(part.created_at).toLocaleDateString()}
            </div>
          </div>
          
          {phone && (
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg ml-4"
              onClick={() => window.open(`tel:${phone}`, '_self')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CarPartCard;
