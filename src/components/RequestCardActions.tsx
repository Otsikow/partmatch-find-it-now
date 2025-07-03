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
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        onClick={onShowOfferForm}
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
  );
};

export default RequestCardActions;