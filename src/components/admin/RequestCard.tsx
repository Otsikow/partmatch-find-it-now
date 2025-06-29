
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Users, CheckCircle, Package } from "lucide-react";

interface Request {
  id: string;
  make: string;
  model: string;
  year: string;
  part: string;
  customer: string;
  location: string;
  phone: string;
  status: 'pending' | 'matched' | 'completed';
  timestamp: string;
}

interface RequestCardProps {
  request: Request;
  onMatchSupplier: (requestId: string) => void;
  onCompleteRequest: (requestId: string) => void;
  hasRelatedOffer: boolean;
}

const RequestCard = ({ request, onMatchSupplier, onCompleteRequest, hasRelatedOffer }: RequestCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'matched': return <Users className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <h3 className="font-playfair font-semibold text-lg sm:text-xl">
            {request.make} {request.model} {request.year}
          </h3>
          <p className="text-gray-600 font-crimson text-base sm:text-lg">Part: {request.part}</p>
          <p className="text-sm sm:text-base text-gray-500 font-inter">Customer: {request.customer}</p>
        </div>
        <div className="text-right">
          <Badge className={`${getStatusColor(request.status)} flex items-center gap-1 text-sm sm:text-base`}>
            {getStatusIcon(request.status)}
            {request.status}
          </Badge>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-inter">{request.timestamp}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-crimson">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {request.location}
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          {request.phone}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {request.status === 'pending' && hasRelatedOffer && (
          <Button 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => onMatchSupplier(request.id)}
          >
            Match with Supplier
          </Button>
        )}
        {request.status === 'matched' && (
          <Button 
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => onCompleteRequest(request.id)}
          >
            Mark Complete
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => window.open(`tel:${request.phone}`, '_self')}
          className="text-base border-purple-200 hover:bg-purple-50"
        >
          Call Customer
        </Button>
      </div>
    </Card>
  );
};

export default RequestCard;
