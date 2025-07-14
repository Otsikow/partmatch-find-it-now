
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import ChatButton from "./chat/ChatButton";
import SaveButton from "./SaveButton";
import GuestSaveButton from "./GuestSaveButton";
import WhatsAppContactButton from "./WhatsAppContactButton";
import { useAuth } from "@/contexts/AuthContext";

interface CarPartCardFooterProps {
  partId: string;
  supplierId: string;
  partTitle?: string;
  onContact?: () => void;
}

const CarPartCardFooter = ({ partId, supplierId, partTitle = "this part", onContact }: CarPartCardFooterProps) => {
  const { user } = useAuth();

  return (
    <CardFooter className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
      <div className="flex gap-2 sm:gap-3 w-full">
        <ChatButton
          sellerId={supplierId}
          partId={partId}
          partTitle={partTitle}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base h-10 sm:h-11"
        />
        {user ? (
          <SaveButton 
            partId={partId} 
            size="default"
            variant="outline"
            className="border-red-200 hover:bg-red-50 h-10 sm:h-11"
          />
        ) : (
          <GuestSaveButton 
            partId={partId} 
            size="default"
            variant="outline"
            className="border-red-200 hover:bg-red-50 h-10 sm:h-11"
          />
        )}
      </div>
      
      <WhatsAppContactButton
        partTitle={partTitle}
        className="w-full font-semibold py-2 sm:py-3 px-4 sm:px-5 rounded-lg transition-all duration-300 text-sm sm:text-base h-10 sm:h-11"
      />
    </CardFooter>
  );
};

export default CarPartCardFooter;
