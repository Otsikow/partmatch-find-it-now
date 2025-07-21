import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Smartphone, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SelectedFeatures {
  feature: boolean;
  boost: boolean;
  combo: boolean;
  urgent: boolean;
  highlight: boolean;
  verified_badge: boolean;
  extra_photos: number;
  business_subscription: boolean;
  banner_ad: boolean;
}

interface MonetizationPricing {
  id: string;
  feature_type: string;
  amount: number;
  currency: string;
  duration_days: number | null;
  description: string;
  active: boolean;
}

interface MonetizationPaymentModalProps {
  isOpen: boolean;
  currency: string;
  onClose: () => void;
  partId: string;
  features?: SelectedFeatures;
  totalAmount?: number;
  pricing?: MonetizationPricing[];
  onPaymentSuccess: () => void;
  // Legacy props for backward compatibility
  featureType?: string;
  amount?: number;
  description?: string;
}

const MonetizationPaymentModal = ({
  isOpen,
  onClose,
  partId,
  features,
  totalAmount,
  pricing = [],
  onPaymentSuccess,
  // Legacy props
  featureType,
  amount,
  description,
}: MonetizationPaymentModalProps) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [mobileProvider, setMobileProvider] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Use legacy props if new props are not provided (backward compatibility)
  const finalAmount = totalAmount ?? amount ?? 0;
  const finalDescription = description || "promotion features";

  const processComprehensiveFeatures = async (
    features: SelectedFeatures,
    pricing: MonetizationPricing[],
    userId: string,
    partId: string,
    paymentReference: string
  ) => {
    const currentDate = new Date();
    const updateData: Record<string, any> = {};
    const purchases: any[] = [];

    // Process each selected feature
    for (const [featureKey, value] of Object.entries(features)) {
      if (!value || (typeof value === "number" && value === 0)) continue;

      const priceConfig = pricing.find((p) => p.feature_type === featureKey);
      if (!priceConfig) continue;

      // Create purchase record
      const purchase: any = {
        user_id: userId,
        listing_id: partId,
        purchase_type: featureKey,
        amount:
          typeof value === "number"
            ? priceConfig.amount * value
            : priceConfig.amount,
        currency: priceConfig.currency,
        duration_days: priceConfig.duration_days,
        payment_reference: paymentReference,
        payment_status: "paid",
        metadata: { quantity: typeof value === "number" ? value : 1 },
      };

      if (priceConfig.duration_days) {
        purchase.expires_at = new Date(
          currentDate.getTime() +
            priceConfig.duration_days * 24 * 60 * 60 * 1000
        ).toISOString();
      }

      purchases.push(purchase);

      // Update car_parts table
      switch (featureKey) {
        case "feature":
        case "combo":
          updateData.is_featured = true;
          updateData.featured_until = new Date(
            currentDate.getTime() +
              (priceConfig.duration_days || 7) * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "boost":
          updateData.boosted_until = new Date(
            currentDate.getTime() +
              (priceConfig.duration_days || 3) * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "urgent":
          updateData.is_urgent = true;
          updateData.urgent_until = new Date(
            currentDate.getTime() +
              (priceConfig.duration_days || 7) * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "highlight":
          updateData.is_highlighted = true;
          updateData.highlighted_until = new Date(
            currentDate.getTime() +
              (priceConfig.duration_days || 7) * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "verified_badge":
          updateData.has_verified_badge = true;
          updateData.verified_badge_until = new Date(
            currentDate.getTime() +
              (priceConfig.duration_days || 30) * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "extra_photos":
          updateData.extra_photos_count =
            (updateData.extra_photos_count || 0) + (value as number);
          break;
        case "business_subscription":
          // Handle business subscription
          await supabase.from("business_subscriptions").upsert(
            {
              user_id: userId,
              active: true,
              start_date: currentDate.toISOString(),
              end_date: new Date(
                currentDate.getTime() +
                  (priceConfig.duration_days || 30) * 24 * 60 * 60 * 1000
              ).toISOString(),
              payment_reference: paymentReference,
            },
            { onConflict: "user_id" }
          );
          break;
      }
    }

    // Handle combo feature (feature + boost)
    if (features.combo) {
      updateData.boosted_until = updateData.featured_until;
    }

    // Update car_parts table
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from("car_parts")
        .update(updateData)
        .eq("id", partId);

      if (error) throw error;
    }

    // Insert purchase records
    if (purchases.length > 0) {
      const { error } = await supabase
        .from("monetization_purchases")
        .insert(purchases);

      if (error) throw error;
    }
  };

  const processLegacyFeature = async (
    featureType: string | undefined,
    partId: string
  ) => {
    if (!featureType) return;

    const updateData: Record<string, string> = {};
    const currentDate = new Date();

    switch (featureType) {
      case "featured":
        updateData.is_featured = "true";
        updateData.featured_until = new Date(
          currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString();
        break;
      case "boost":
        updateData.boosted_until = new Date(
          currentDate.getTime() + 3 * 24 * 60 * 60 * 1000
        ).toISOString();
        break;
    }

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from("car_parts")
        .update(updateData)
        .eq("id", partId);

      if (error) throw error;
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    if (
      paymentMethod === "mobile_money" &&
      (!mobileProvider || !mobileNumber)
    ) {
      toast({
        title: "Mobile Money Details Required",
        description: "Please enter your mobile money provider and number.",
        variant: "destructive",
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
          if (!user?.id) {
            throw new Error("User not authenticated");
          }

          // Process comprehensive features if provided
          if (features && Object.keys(features).length > 0) {
            await processComprehensiveFeatures(
              features,
              pricing,
              user.id,
              partId,
              paymentReference
            );
          } else {
            // Legacy single feature processing
            await processLegacyFeature(featureType, partId);
          }

          // Log the purchase
          console.log("Payment processed:", {
            part_id: partId,
            user_id: user.id,
            features: features || { [featureType || "unknown"]: true },
            amount: finalAmount,
            payment_method: paymentMethod,
            payment_reference: paymentReference,
          });

          toast({
            title: "Payment Successful!",
            description: `Your listing has been upgraded with ${finalDescription}.`,
          });

          onPaymentSuccess();
          onClose();
        } catch (error: unknown) {
          console.error("Payment processing error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Please try again.";
          toast({
            title: "Payment Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
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
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              GHS {finalAmount.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              One-time fee for {finalDescription}
            </p>
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

            {paymentMethod === "mobile_money" && (
              <>
                <div>
                  <Label className="text-xs sm:text-sm">
                    Mobile Money Provider
                  </Label>
                  <Select
                    value={mobileProvider}
                    onValueChange={setMobileProvider}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                      <SelectItem value="airteltigo">
                        AirtelTigo Money
                      </SelectItem>
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
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-xs sm:text-sm"
            >
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
