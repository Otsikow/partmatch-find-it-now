
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import RequestCard from "@/components/RequestCard";
import RequestExpandedDialog from "@/components/RequestExpandedDialog";

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
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };

  const handleRequestDialogClose = () => {
    setIsRequestDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {requests.map(request => (
        <RequestCard
          key={request.id}
          request={request}
          onOfferSubmit={onOfferSubmit}
          onWhatsAppContact={onWhatsAppContact}
          onChatContact={onChatContact}
          isSubmittingOffer={isSubmittingOffer}
          onRequestClick={handleRequestClick}
        />
      ))}

      {requests.length === 0 && (
        <Card className="p-6 sm:p-8 lg:p-12 text-center bg-gradient-to-br from-card/90 to-muted/50 backdrop-blur-sm border-0 shadow-lg">
          <Package className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4 lg:mb-6" />
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">No active requests</h3>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">Check back later for new part requests from customers</p>
        </Card>
      )}

      <RequestExpandedDialog
        request={selectedRequest}
        isOpen={isRequestDialogOpen}
        onClose={handleRequestDialogClose}
      />
    </div>
  );
};

export default RequestsTab;
