import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import LocationSelector from "@/components/LocationSelector";

interface RequestCardOfferFormProps {
  requestId: string;
  offerPrice: string;
  setOfferPrice: (price: string) => void;
  offerMessage: string;
  setOfferMessage: (message: string) => void;
  offerLocation: string;
  setOfferLocation: (location: string) => void;
  onSubmit: (
    requestId: string,
    price: number,
    message: string,
    location: string
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const RequestCardOfferForm = ({
  requestId,
  offerPrice,
  setOfferPrice,
  offerMessage,
  setOfferMessage,
  offerLocation,
  setOfferLocation,
  onSubmit,
  onCancel,
  isSubmitting,
}: RequestCardOfferFormProps) => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [currencyLabel, setCurrencyLabel] = useState("USD");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9bc8410018154a2b98484fb633107c83`
          );

          const data = await response.json();
          const result = data?.results?.[0];

          if (result) {
            const components = result.components;
            const city =
              components.city || components.town || components.village || "";
            const state = components.state || "";
            const country = components.country || "";
            const code = components["ISO_3166-1_alpha-2"] || "";

            const address = `${city}, ${state}, ${country}`;
            setOfferLocation(address);
            setCountryCode(code);

            const currencyMap: Record<string, string> = {
              GH: "GHS",
              NG: "NGN",
              KE: "KES",
              ZA: "ZAR",
              US: "USD",
              GB: "GBP",
              CA: "CAD",
              IN: "INR",
              PK: "PKR",
            };

            setCurrencyLabel(currencyMap[code] || "USD");
          }
        } catch (err) {
          console.error("Failed to reverse geocode:", err);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSubmit = async () => {
    if (!offerPrice || !offerLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in price and location.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(offerPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(requestId, price, offerMessage, offerLocation);
  };

  const isGhanaUser = countryCode === "GH";

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
      <h4 className="font-semibold text-orange-800 text-sm sm:text-base">
        Submit Your Offer
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor={`price-${requestId}`} className="text-sm font-medium">
            Your Price ({currencyLabel}) *
          </Label>
          <Input
            id={`price-${requestId}`}
            type="number"
            placeholder={`e.g. 150`}
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Your Location *</Label>
          <div className="mt-1">
            {isGhanaUser ? (
              <LocationSelector
                value={offerLocation}
                onChange={setOfferLocation}
              />
            ) : (
              <Input
                type="text"
                placeholder="Enter your city/location"
                value={offerLocation}
                onChange={(e) => setOfferLocation(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor={`message-${requestId}`} className="text-sm font-medium">
          Additional Message (Optional)
        </Label>
        <Textarea
          id={`message-${requestId}`}
          placeholder="Describe the condition, warranty, or any other details..."
          value={offerMessage}
          onChange={(e) => setOfferMessage(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
        >
          {isSubmitting ? "Submitting..." : "Submit Offer"}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-orange-200 hover:bg-orange-50"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RequestCardOfferForm;
