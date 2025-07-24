
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import RequestCard from "@/components/RequestCard";

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

interface RequestsTabProps {
  requests: Request[];
  onOfferSubmit: (requestId: string, price: number, message: string, location: string) => Promise<void>;
  onWhatsAppContact: (phone: string, request: Request) => void;
  onChatContact: (requestId: string, ownerId: string) => void;
  isSubmittingOffer: boolean;
}

const RequestsTab = ({ requests, onOfferSubmit, onWhatsAppContact, onChatContact, isSubmittingOffer }: RequestsTabProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {requests.map(request => (
        <RequestCard
          key={request.id}
          request={request}
          onOfferSubmit={onOfferSubmit}
          onWhatsAppContact={onWhatsAppContact}
          onChatContact={onChatContact}
          isSubmittingOffer={isSubmittingOffer}
        />
      ))}

      {requests.length === 0 && (
        <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3">No active requests</h3>
          <p className="text-gray-600 text-base sm:text-lg">Check back later for new part requests from customers</p>
        </Card>
      )}
    </div>
  );
};

export default RequestsTab;
