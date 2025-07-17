
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import ChatButton from "./chat/ChatButton";
import SaveButton from "./SaveButton";

interface CarPartCardFooterProps {
  partId: string;
  supplierId: string;
  onContact?: () => void;
}

const CarPartCardFooter = ({ partId, supplierId, onContact }: CarPartCardFooterProps) => {
  return (
    <CardFooter className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
      <div className="flex gap-2 sm:gap-3 w-full">
        <ChatButton
          sellerId={supplierId}
          partId={partId}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base h-10 sm:h-11"
        />
        <SaveButton 
          partId={partId} 
          size="default"
          variant="outline"
          className="border-red-200 hover:bg-red-50 h-10 sm:h-11"
        />
      </div>
      
      <Button 
        onClick={onContact}
        variant="outline"
        className="w-full border-green-600 text-green-700 hover:bg-green-50 font-semibold py-2 sm:py-3 px-4 sm:px-5 rounded-lg transition-all duration-300 text-sm sm:text-base h-10 sm:h-11"
      >
        <Phone className="h-4 w-4 mr-2" />
        Contact Seller
      </Button>
    </CardFooter>
  );
};

export default CarPartCardFooter;
