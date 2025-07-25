
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import ChatButton from "./chat/ChatButton";
import SaveButton from "./SaveButton";
import FollowSellerButton from "./FollowSellerButton";

interface CarPartCardFooterProps {
  partId: string;
  supplierId: string;
  onContact?: () => void;
}

const CarPartCardFooter = ({ partId, supplierId, onContact }: CarPartCardFooterProps) => {
  return (
    <div className="pt-2 space-y-2">
      {/* Primary Chat Button - Full Width */}
      <ChatButton
        sellerId={supplierId}
        partId={partId}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm h-9"
      >
        Chat
      </ChatButton>
feat/dashboard-button
 main
      {/* Secondary Actions Row */}
      <div className="flex gap-1.5 w-full">
        <SaveButton 
          partId={partId} 
          size="sm"
          variant="outline"
          className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-600 h-8 px-2"
        />
        <FollowSellerButton 
          sellerId={supplierId}
          size="sm"
          variant="outline"
          showText={false}
          className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-600 h-8 px-2"
        />
feat/dashboard-button
        <Button
main
          onClick={onContact}
          size="sm"
          variant="outline"
          className="flex-1 border-green-600 text-green-600 hover:bg-green-50 font-medium transition-all duration-200 text-xs h-8 px-2"
        >
          <Phone className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CarPartCardFooter;
