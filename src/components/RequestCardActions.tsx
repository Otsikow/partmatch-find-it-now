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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
      <Button 
        onClick={onShowOfferForm}
        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg text-xs sm:text-sm font-medium px-3 py-2 h-10 sm:h-auto col-span-1 sm:col-span-1"
      >
        <span className="hidden xs:inline">Make Offer</span>
        <span className="xs:hidden">Offer</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => onChatContact(request.id, request.owner_id)}
        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs sm:text-sm font-medium px-3 py-2 h-10 sm:h-auto"
      >
        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Chat
      </Button>
      <Button
        onClick={() => onWhatsAppContact(request.phone, request)}
        className="bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg text-xs sm:text-sm font-medium px-3 py-2 h-10 sm:h-auto"
      >
        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        WhatsApp
      </Button>
    </div>
  );
};

export default RequestCardActions;