
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Phone, User } from "lucide-react";
import { CarPart } from "@/types/CarPart";
import VerifiedSellerBadge from "./VerifiedSellerBadge";

interface CarPartCardProps {
  part: CarPart;
  onContact?: () => void;
}

const CarPartCard = ({ part, onContact }: CarPartCardProps) => {
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

  return (
    <Card className="w-full max-w-sm bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
      {/* Image Section */}
      {part.images && part.images.length > 0 && (
        <div className="relative h-48 bg-gray-100">
          <img
            src={part.images[0]}
            alt={part.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge 
              variant="secondary" 
              className={`${getConditionColor(part.condition)} font-semibold`}
            >
              {part.condition}
            </Badge>
          </div>
        </div>
      )}

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

      <CardFooter className="pt-3">
        <Button 
          onClick={onContact}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Phone className="h-4 w-4 mr-2" />
          Contact Seller
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarPartCard;
