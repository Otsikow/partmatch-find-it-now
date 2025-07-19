import { Button } from "@/components/ui/button";
import { MessageCircle, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

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
  const { user, userType } = useAuth();

  const handleAuthenticatedAction = (action: () => void, actionName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: `Please sign in to ${actionName.toLowerCase()} the buyer.`,
        variant: "destructive",
      });
      return;
    }

    if (!userType || (userType !== 'supplier' && userType !== 'admin')) {
      toast({
        title: "Access restricted",
        description: `Only sellers and admins can ${actionName.toLowerCase()} buyers.`,
        variant: "destructive",
      });
      return;
    }

    action();
  };

  const handleChatClick = () => {
    handleAuthenticatedAction(
      () => onChatContact(request.id, request.owner_id),
      "Chat with"
    );
  };

  const handleWhatsAppClick = () => {
    handleAuthenticatedAction(
      () => onWhatsAppContact(request.phone, request),
      "WhatsApp"
    );
  };

  const handleOfferClick = () => {
    handleAuthenticatedAction(
      onShowOfferForm,
      "Make an offer to"
    );
  };

  return (
    <div className="grid grid-cols-3 gap-0.5 w-full -mx-2">
      <Button 
        onClick={handleOfferClick}
        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg text-[9px] sm:text-xs font-medium px-0.5 sm:px-2 py-1 sm:py-2 h-7 sm:h-9 min-w-0 flex-1"
      >
        <span className="hidden xs:inline">Make Offer</span>
        <span className="xs:hidden">Offer</span>
      </Button>
      <Button
        variant="outline"
        onClick={handleChatClick}
        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-[9px] sm:text-xs font-medium px-0.5 sm:px-2 py-1 sm:py-2 h-7 sm:h-9 min-w-0 flex-1"
      >
        <MessageSquare className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
        <span className="hidden xs:inline">Chat</span>
        <span className="xs:hidden">Chat</span>
      </Button>
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg text-[9px] sm:text-xs font-medium px-0.5 sm:px-2 py-1 sm:py-2 h-7 sm:h-9 min-w-0 flex-1"
      >
        <MessageCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
        <span className="hidden xs:inline">WhatsApp</span>
        <span className="xs:hidden">WA</span>
      </Button>
    </div>
  );
};

export default RequestCardActions;