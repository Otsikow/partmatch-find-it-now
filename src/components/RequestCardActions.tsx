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

  // Don't show actions if user is the owner of the request
  const isOwner = user?.id === request.owner_id;
  
  if (isOwner) {
    return null; // Don't render actions for request owners
  }

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
    <div className="flex gap-3 w-full mt-4 -mx-2 px-2">
      <Button
        onClick={handleOfferClick}
        size="sm"
        className="flex-1 min-w-[90px] bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
      >
        Make Offer
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleChatClick}
        className="flex-1 min-w-[70px] border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
      >
        Chat
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsAppClick}
        className="flex-1 min-w-[80px] border-success text-success-foreground bg-success hover:bg-success/90 font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
      >
        WhatsApp
      </Button>
    </div>
  );
};

export default RequestCardActions;