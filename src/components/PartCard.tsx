
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { Part } from "@/types/Part";
import ChatButton from "@/components/chat/ChatButton";
import SaveButton from "@/components/SaveButton";

interface PartCardProps {
  part: Part;
}

const PartCard = ({ part }: PartCardProps) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Used': return 'bg-blue-100 text-blue-800';
      case 'Refurbished': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1">
          <h3 className="font-playfair font-semibold text-lg sm:text-xl lg:text-2xl">{part.name}</h3>
          <p className="text-gray-600 font-crimson text-base sm:text-lg lg:text-xl">
            {part.make} {part.model} ({part.year})
          </p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">{part.price}</p>
          <div className="flex items-center gap-2">
            <Badge className={`${getConditionColor(part.condition)} text-sm sm:text-base`}>
              {part.condition}
            </Badge>
            <SaveButton 
              partId={part.id || 'mock-part-id'} 
              size="sm" 
              variant="outline"
              className="border-red-200 hover:bg-red-50"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-3 sm:pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium font-inter text-base sm:text-lg">{part.supplier}</p>
            <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base font-crimson">
              <MapPin className="h-4 w-4" />
              {part.location}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <ChatButton
              sellerId={part.id || 'mock-seller-id'}
              partId={part.id}
              size="sm"
              variant="outline"
              className="border-purple-600 text-purple-700 hover:bg-purple-50 h-9 sm:h-10"
            />
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base h-9 sm:h-10"
              size="sm"
              onClick={() => window.open(`tel:${part.phone}`, '_self')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PartCard;
