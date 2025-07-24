
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RequestCardHeader from "./RequestCardHeader";
import RequestCardMetadata from "./RequestCardMetadata";
import RequestCardOfferForm from "./RequestCardOfferForm";
import RequestCardActions from "./RequestCardActions";

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

  const handleSubmitOffer = async (requestId: string, price: number, message: string, location: string) => {
    await onOfferSubmit(requestId, price, message, location);
    
    // Reset form
    setShowOfferForm(false);
    setOfferPrice('');
    setOfferMessage('');
    setOfferLocation('');
  };

  const handleCancelOffer = () => {
    setShowOfferForm(false);
    setOfferPrice('');
    setOfferMessage('');
    setOfferLocation('');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <RequestCardHeader request={request as Request & { photo_url?: string }} />

      <CardContent className="pt-0">
        <RequestCardMetadata 
          location={request.location}
          phone={request.phone}
          createdAt={request.created_at}
        />

        {showOfferForm ? (
          <RequestCardOfferForm
            requestId={request.id}
            offerPrice={offerPrice}
            setOfferPrice={setOfferPrice}
            offerMessage={offerMessage}
            setOfferMessage={setOfferMessage}
            offerLocation={offerLocation}
            setOfferLocation={setOfferLocation}
            onSubmit={handleSubmitOffer}
            onCancel={handleCancelOffer}
            isSubmitting={isSubmittingOffer}
          />
        ) : (
          <RequestCardActions
            request={request}
            onShowOfferForm={() => setShowOfferForm(true)}
            onChatContact={onChatContact}
            onWhatsAppContact={onWhatsAppContact}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
