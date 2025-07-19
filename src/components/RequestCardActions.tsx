import { Button } from "@/components/ui/button";
import { MessageCircle, MessageSquare } from "lucide-react";

interface Request {
  id: string;
  phone: string;
  owner_id: string;
}

interface RequestCardActionsProps {
  request: Request;
  onShowOfferForm: () => void;
  onChatContact: (requestId: string, ownerId: string) => void;
  onWhatsAppContact: (phone: string, request: Request) => void;
}

const RequestCardActions = ({
  request,
  onShowOfferForm,
  onChatContact,
  onWhatsAppContact
}: RequestCardActionsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <Button 
        onClick={onShowOfferForm}
        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg text-xs font-medium px-2 py-2 h-9 min-w-0"
      >
        Make Offer
      </Button>
      <Button
        variant="outline"
        onClick={() => onChatContact(request.id, request.owner_id)}
        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs font-medium px-2 py-2 h-9 min-w-0"
      >
        <MessageSquare className="h-3 w-3 mr-1" />
        Chat
      </Button>
      <Button
        onClick={() => onWhatsAppContact(request.phone, request)}
        className="bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg text-xs font-medium px-2 py-2 h-9 min-w-0"
      >
        <MessageCircle className="h-3 w-3 mr-1" />
        WhatsApp
      </Button>
    </div>
  );
};

export default RequestCardActions;