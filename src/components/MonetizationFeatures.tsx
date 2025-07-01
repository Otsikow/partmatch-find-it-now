
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Camera, Crown, Megaphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PaymentModal from "./PaymentModal";

interface MonetizationFeaturesProps {
  partId: string;
  currentPhotoCount: number;
  isFeatured: boolean;
  isBoosted: boolean;
  hasBusinessSubscription: boolean;
  onFeatureUpdate: () => void;
}

const MonetizationFeatures = ({ 
  partId, 
  currentPhotoCount, 
  isFeatured, 
  isBoosted, 
  hasBusinessSubscription,
  onFeatureUpdate 
}: MonetizationFeaturesProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    type: string;
    amount: number;
    description: string;
  } | null>(null);

  const handleFeatureClick = (type: string, amount: number, description: string) => {
    setSelectedFeature({ type, amount, description });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: `Your listing has been upgraded with ${selectedFeature?.description}.`,
    });
    onFeatureUpdate();
    setShowPaymentModal(false);
    setSelectedFeature(null);
  };

  const canAddMorePhotos = currentPhotoCount < 10;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-600" />
            Boost Your Listing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Featured Listing */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium">Feature This Listing</h4>
                <p className="text-sm text-gray-600">Stand out for 7 days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">GHS 20</p>
              {isFeatured ? (
                <Badge variant="secondary">Active</Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleFeatureClick('featured', 20, 'Featured Listing')}
                  disabled={hasBusinessSubscription}
                >
                  {hasBusinessSubscription ? 'Included' : 'Feature'}
                </Button>
              )}
            </div>
          </div>

          {/* Boost Listing */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium">Boost Listing</h4>
                <p className="text-sm text-gray-600">Move to top for 3 days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">GHS 8</p>
              {isBoosted ? (
                <Badge variant="secondary">Active</Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleFeatureClick('boost', 8, 'Listing Boost')}
                >
                  Boost
                </Button>
              )}
            </div>
          </div>

          {/* Extra Photos */}
          {canAddMorePhotos && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Add More Photos</h4>
                  <p className="text-sm text-gray-600">
                    {currentPhotoCount}/10 photos used
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">GHS 10</p>
                <p className="text-xs text-gray-500">per extra photo</p>
                <Button
                  size="sm"
                  onClick={() => handleFeatureClick('extra_photos', 10, 'Extra Photo')}
                  disabled={!canAddMorePhotos}
                >
                  Add Photo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Subscription */}
      {!hasBusinessSubscription && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Crown className="h-5 w-5" />
              Business Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Premium Business Plan</h4>
                  <ul className="text-sm text-gray-600 mt-1">
                    <li>• Unlimited posts</li>
                    <li>• Always featured listings</li>
                    <li>• Priority support</li>
                    <li>• Advanced analytics</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-xl">GHS 100</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => handleFeatureClick('subscription', 100, 'Business Subscription')}
              >
                Upgrade to Business
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Homepage Banner Ad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-red-600" />
            Homepage Banner Ad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Premium Visibility</h4>
              <p className="text-sm text-gray-600">Feature your business on homepage for 7 days</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600 text-xl">GHS 200</p>
              <Button
                onClick={() => handleFeatureClick('banner_ad', 200, 'Homepage Banner Ad')}
                className="mt-2"
              >
                Buy Banner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedFeature && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          offerId={partId}
          amount={selectedFeature.amount}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default MonetizationFeatures;
