
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, MessageCircle, Clock, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LocationSelector from "@/components/LocationSelector";

interface Request {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  location: string;
  phone: string;
  description?: string;
  status: string;
  created_at: string;
  owner_id: string;
}

interface RequestCardProps {
  request: Request;
  onOfferSubmit: (requestId: string, price: number, message: string, location: string) => Promise<void>;
  onWhatsAppContact: (phone: string, request: Request) => void;
  onChatContact: (requestId: string, ownerId: string) => void;
  isSubmittingOffer: boolean;
}

const RequestCard = ({ request, onOfferSubmit, onWhatsAppContact, onChatContact, isSubmittingOffer }: RequestCardProps) => {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLocation, setOfferLocation] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitOffer = async () => {
    if (!offerPrice || !offerLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in price and location.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(offerPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return;
    }

    await onOfferSubmit(request.id, price, offerMessage, offerLocation);
    
    // Reset form
    setShowOfferForm(false);
    setOfferPrice('');
    setOfferMessage('');
    setOfferLocation('');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {request.car_make} {request.car_model} {request.car_year}
            </CardTitle>
            <p className="text-orange-600 font-semibold text-base sm:text-lg mt-1">
              Part: {request.part_needed}
            </p>
            {request.description && (
              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                {request.description}
              </p>
            )}
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex-shrink-0">
            Active Request
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{request.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{request.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>{formatDate(request.created_at)}</span>
          </div>
        </div>

        {showOfferForm ? (
          <div className="space-y-4 p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800">Submit Your Offer</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`price-${request.id}`} className="text-sm font-medium">Your Price (GHS) *</Label>
                <Input
                  id={`price-${request.id}`}
                  type="number"
                  placeholder="e.g. 150"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Your Location *</Label>
                <div className="mt-1">
                  <LocationSelector
                    value={offerLocation}
                    onChange={setOfferLocation}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor={`message-${request.id}`} className="text-sm font-medium">Additional Message (Optional)</Label>
              <Textarea
                id={`message-${request.id}`}
                placeholder="Describe the condition, warranty, or any other details..."
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSubmitOffer}
                disabled={isSubmittingOffer}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
              >
                {isSubmittingOffer ? "Submitting..." : "Submit Offer"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowOfferForm(false)}
                disabled={isSubmittingOffer}
                className="border-orange-200 hover:bg-orange-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => setShowOfferForm(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg text-sm sm:text-base"
            >
              I Have This Part!
            </Button>
            <Button
              variant="outline"
              onClick={() => onChatContact(request.id, request.owner_id)}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-sm sm:text-base"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              onClick={() => onWhatsAppContact(request.phone, request)}
              className="bg-green-600 hover:bg-green-700 text-white border-green-600 text-sm sm:text-base"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
