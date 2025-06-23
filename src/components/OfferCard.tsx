
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Eye, EyeOff } from "lucide-react";
import PaymentModal from "./PaymentModal";
import VerifiedBadge from "./VerifiedBadge";

interface OfferCardProps {
  offer: {
    id: string;
    price: number;
    message?: string;
    photo_url?: string;
    contact_unlocked: boolean;
    contact_unlock_fee: number;
    supplier: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      is_verified: boolean;
      rating?: number;
      location?: string;
    };
  };
  requestPhone?: string;
  onContactUnlocked?: () => void;
}

const OfferCard = ({ offer, requestPhone, onContactUnlocked }: OfferCardProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleWhatsAppContact = (phone: string) => {
    const message = `Hi! I'm interested in your car part offer for GHS ${offer.price}. Can we discuss?`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const supplierName = offer.supplier.first_name || offer.supplier.last_name 
    ? `${offer.supplier.first_name || ''} ${offer.supplier.last_name || ''}`.trim()
    : 'Supplier';

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{supplierName}</h3>
            <VerifiedBadge isVerified={offer.supplier.is_verified} />
          </div>
          {offer.supplier.location && (
            <p className="text-sm text-gray-600">{offer.supplier.location}</p>
          )}
          {offer.supplier.rating && offer.supplier.rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm">⭐ {offer.supplier.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">GHS {offer.price}</p>
        </div>
      </div>

      {offer.message && (
        <div className="mb-3">
          <p className="text-sm text-gray-700">{offer.message}</p>
        </div>
      )}

      {offer.photo_url && (
        <div className="mb-3">
          <img 
            src={offer.photo_url} 
            alt="Part photo" 
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="space-y-2">
        {offer.contact_unlocked ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <Phone className="h-4 w-4 text-green-600" />
              <span className="font-medium">{offer.supplier.phone}</span>
            </div>
            <Button
              onClick={() => handleWhatsAppContact(offer.supplier.phone || '')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message on WhatsApp
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <EyeOff className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Contact hidden</span>
              <Badge variant="outline" className="ml-auto">
                GHS {offer.contact_unlock_fee} to unlock
              </Badge>
            </div>
            <Button
              onClick={() => setShowPaymentModal(true)}
              variant="outline"
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Unlock Contact (GHS {offer.contact_unlock_fee})
            </Button>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        offerId={offer.id}
        amount={offer.contact_unlock_fee}
        onPaymentSuccess={() => {
          onContactUnlocked?.();
        }}
      />
    </Card>
  );
};

export default OfferCard;
