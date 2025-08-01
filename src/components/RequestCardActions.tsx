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
    console.log('🔐 handleAuthenticatedAction called:', {
      user: user?.id,
      userType,
      actionName,
      hasUser: !!user,
      isSupplier: userType === 'supplier',
      isAdmin: userType === 'admin'
    });

    if (!user) {
      console.log('❌ No user - showing sign in toast');
      toast({
        title: "Sign in required",
        description: `Please sign in to ${actionName.toLowerCase()} the buyer.`,
        variant: "destructive",
      });
      return;
    }

    if (!userType || (userType !== 'supplier' && userType !== 'admin')) {
      console.log('❌ User type not authorized:', userType);
      toast({
        title: "Access restricted",
        description: `Only sellers and admins can ${actionName.toLowerCase()} buyers.`,
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Authentication passed, executing action');
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
    console.log('🔵 Make Offer button clicked!', {
      requestId: request.id,
      userId: user?.id,
      userType: userType,
      isOwner: user?.id === request.owner_id,
      user: user,
      elementExists: !!document.querySelector('[data-testid="make-offer-button"]'),
      buttonElement: document.querySelector('[data-testid="make-offer-button"]')
    });
    
    handleAuthenticatedAction(
      () => {
        console.log('🟢 Authentication passed, calling onShowOfferForm');
        onShowOfferForm();
      },
      "make an offer to"
    );
  };

  return (
    <div className="flex gap-2 w-full mt-4 -mx-2 px-2">
      <Button
        onClick={handleOfferClick}
        size="sm"
        data-testid="make-offer-button"
        className="flex-1 min-w-[90px] bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
      >
        Make Offer
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleChatClick}
        className="flex-1 min-w-[60px] border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
      >
        Chat
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsAppClick}
        className="flex-1 min-w-[80px] border-green-600 text-white bg-green-600 hover:bg-green-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
      >
        WhatsApp
      </Button>
    </div>
  );
};

export default RequestCardActions;