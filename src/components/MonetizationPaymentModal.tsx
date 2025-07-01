import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Smartphone, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MonetizationPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  partId: string;
  featureType: string;
  amount: number;
  description: string;
  onPaymentSuccess: () => void;
}

const MonetizationPaymentModal = ({ 
  isOpen, 
  onClose, 
  partId, 
  featureType, 
  amount, 
  description, 
  onPaymentSuccess 
}: MonetizationPaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [mobileProvider, setMobileProvider] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'mobile_money' && (!mobileProvider || !mobileNumber)) {
      toast({
        title: "Mobile Money Details Required",
        description: "Please enter your mobile money provider and number.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const paymentReference = `MON-${Date.now()}`;
      
      toast({
        title: "Processing Payment",
        description: "Please wait while we process your payment...",
      });

      setTimeout(async () => {
        try {
          const updateData: Record<string, string> = {};
          const currentDate = new Date();

          switch (featureType) {
            case 'featured':
              updateData.featured_until = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
              break;
            case 'boost':
              updateData.boosted_until = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
              break;
            case 'subscription':
              break;
            case 'banner_ad':
              break;
            case 'extra_photos':
              break;
          }

          if (Object.keys(updateData).length > 0) {
            const { error } = await supabase
              .from('car_parts')
              .update(updateData)
              .eq('id', partId);

            if (error) throw error;
          }

          console.log('Payment processed:', {
            part_id: partId,
            feature_type: featureType,
            amount: amount,
            payment_method: paymentMethod,
            payment_reference: paymentReference
          });

          toast({
            title: "Payment Successful!",
            description: `Your listing has been upgraded with ${description}.`,
          });
          
          onPaymentSuccess();
          onClose();
        } catch (error: unknown) {
          console.error('Payment processing error:', error);
          const errorMessage = error instanceof Error ? error.message : "Please try again.";
          toast({
            title: "Payment Failed",
            description: errorMessage,
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }, 2000);

    } catch (error: unknown) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-3 sm:mx-auto max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
            Upgrade Listing - {description}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">GHS {amount.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-gray-600">One-time fee for {description}</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label className="text-xs sm:text-sm">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="mobile_money">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
                      Mobile Money
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                      Bank Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'mobile_money' && (
              <>
                <div>
                  <Label className="text-xs sm:text-sm">Mobile Money Provider</Label>
                  <Select value={mobileProvider} onValueChange={setMobileProvider}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                      <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm">Mobile Number</Label>
                  <Input
                    type="tel"
                    placeholder="0XX XXX XXXX"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 text-xs sm:text-sm">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MonetizationPaymentModal;
