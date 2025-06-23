
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { Part } from "@/types/Part";

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
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div>
          <h3 className="font-playfair font-semibold text-lg sm:text-xl">{part.name}</h3>
          <p className="text-gray-600 font-crimson text-base sm:text-lg">
            {part.make} {part.model} ({part.year})
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">{part.price}</p>
          <Badge className={`${getConditionColor(part.condition)} text-sm sm:text-base`}>
            {part.condition}
          </Badge>
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
          
          <Button 
            className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
            onClick={() => window.open(`tel:${part.phone}`, '_self')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PartCard;
