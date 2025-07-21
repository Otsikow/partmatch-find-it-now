import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useMonetizationPricing } from "@/hooks/useMonetizationPricing";
import { useBusinessSubscription } from "@/hooks/useBusinessSubscription";
import MonetizationPaymentModal from "@/components/MonetizationPaymentModal";
import {
  Crown,
  Zap,
  Camera,
  Star,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Home,
} from "lucide-react";

interface ComprehensiveMonetizationPanelProps {
  partId: string;
  currentPhotoCount: number;
  isFeatured?: boolean;
  featuredUntil?: string;
  isBoosted?: boolean;
  boostedUntil?: string;
  isUrgent?: boolean;
  urgentUntil?: string;
  isHighlighted?: boolean;
  highlightedUntil?: string;
  hasVerifiedBadge?: boolean;
  verifiedBadgeUntil?: string;
  extraPhotosCount?: number;
  onFeatureUpdate?: () => void;
}

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

const ComprehensiveMonetizationPanel: React.FC<
  ComprehensiveMonetizationPanelProps
> = ({
  partId,
  currentPhotoCount,
  isFeatured = false,
  featuredUntil,
  isBoosted = false,
  boostedUntil,
  isUrgent = false,
  urgentUntil,
  isHighlighted = false,
  highlightedUntil,
  hasVerifiedBadge = false,
  verifiedBadgeUntil,
  extraPhotosCount = 0,
  onFeatureUpdate,
}) => {
  const { pricing, loading: pricingLoading } = useMonetizationPricing();
  const { isBusinessUser, loading: subscriptionLoading } =
    useBusinessSubscription();

  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures>({
    feature: false,
    boost: false,
    combo: false,
    urgent: false,
    highlight: false,
    verified_badge: false,
    extra_photos: 0,
    business_subscription: false,
    banner_ad: false,
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const getPricing = (type: string) =>
    pricing.find((p) => p.feature_type === type);

  // Calculate total amount based on selected features
  useEffect(() => {
    let total = 0;

    Object.entries(selectedFeatures).forEach(([key, value]) => {
      if (value && key !== "extra_photos") {
        const priceConfig = getPricing(key);
        if (priceConfig) {
          total += priceConfig.amount;
        }
      }
    });

    // Add extra photos cost (flat fee for 4-10 photos)
    if (selectedFeatures.extra_photos > 0) {
      const photoPrice = getPricing("extra_photo");
      if (photoPrice) {
        total += photoPrice.amount; // Flat fee, not per photo
      }
    }

    // Handle combo pricing (feature + boost for discounted price)
    if (selectedFeatures.combo) {
      const featurePrice = getPricing("feature")?.amount || 0;
      const boostPrice = getPricing("boost")?.amount || 0;
      const comboPrice = getPricing("combo")?.amount || 0;
      total = total - featurePrice - boostPrice + comboPrice;
    }

    setTotalAmount(total);
  }, [selectedFeatures, pricing]);

  const handleFeatureToggle = (
    feature: keyof SelectedFeatures,
    checked: boolean
  ) => {
    setSelectedFeatures((prev) => {
      const newState = { ...prev, [feature]: checked };

      // Handle combo logic
      if (feature === "combo" && checked) {
        newState.feature = true;
        newState.boost = true;
      } else if (feature === "combo" && !checked) {
        newState.feature = false;
        newState.boost = false;
      } else if ((feature === "feature" || feature === "boost") && !checked) {
        newState.combo = false;
      }

      return newState;
    });
  };

  const handleExtraPhotosChange = (amount: number) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      extra_photos: Math.max(0, prev.extra_photos + amount),
    }));
  };

  const handlePurchase = () => {
    if (totalAmount > 0) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedFeatures({
      feature: false,
      boost: false,
      combo: false,
      urgent: false,
      highlight: false,
      verified_badge: false,
      extra_photos: 0,
      business_subscription: false,
      banner_ad: false,
    });
    onFeatureUpdate?.();
  };

  const formatTimeRemaining = (until: string) => {
    const now = new Date();
    const endDate = new Date(until);
    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Expired";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  if (pricingLoading || subscriptionLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Active Features */}
      {(isFeatured ||
        isBoosted ||
        isUrgent ||
        isHighlighted ||
        hasVerifiedBadge) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Active Promotions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isFeatured && featuredUntil && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">Featured</span>
                </div>
                <Badge variant="secondary">
                  {formatTimeRemaining(featuredUntil)}
                </Badge>
              </div>
            )}
            {isBoosted && boostedUntil && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Boosted</span>
                </div>
                <Badge variant="secondary">
                  {formatTimeRemaining(boostedUntil)}
                </Badge>
              </div>
            )}
            {isUrgent && urgentUntil && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium">Urgent</span>
                </div>
                <Badge variant="secondary">
                  {formatTimeRemaining(urgentUntil)}
                </Badge>
              </div>
            )}
            {isHighlighted && highlightedUntil && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Highlighted</span>
                </div>
                <Badge variant="secondary">
                  {formatTimeRemaining(highlightedUntil)}
                </Badge>
              </div>
            )}
            {hasVerifiedBadge && verifiedBadgeUntil && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Verified Badge</span>
                </div>
                <Badge variant="secondary">
                  {formatTimeRemaining(verifiedBadgeUntil)}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Business Subscription Status */}
      {isBusinessUser && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">
                  Business Subscription Active
                </h3>
                <p className="text-sm text-orange-700">
                  You have access to premium features and discounted rates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Promote Your Listing */}
      <Card>
        <CardHeader>
          <CardTitle>Promote Your Listing</CardTitle>
          <p className="text-sm text-gray-600">
            Boost visibility and get more inquiries with our promotion options
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Feature & Boost Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Featured Listing */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="feature"
                  checked={selectedFeatures.feature}
                  onCheckedChange={(checked) =>
                    handleFeatureToggle("feature", checked as boolean)
                  }
                  disabled={selectedFeatures.combo}
                />
                <label
                  htmlFor="feature"
                  className="text-sm font-medium cursor-pointer"
                >
                  Featured Listing
                </label>
                <Badge variant="outline">
                  GHS {getPricing("feature")?.amount || 20} / 7 days
                </Badge>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                Top placement in search results
              </p>
            </div>

            {/* Boost Listing */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="boost"
                  checked={selectedFeatures.boost}
                  onCheckedChange={(checked) =>
                    handleFeatureToggle("boost", checked as boolean)
                  }
                  disabled={selectedFeatures.combo}
                />
                <label
                  htmlFor="boost"
                  className="text-sm font-medium cursor-pointer"
                >
                  Boost Listing
                </label>
                <Badge variant="outline">
                  GHS {getPricing("boost")?.amount || 10} / 3 days
                </Badge>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                Higher visibility in search
              </p>
            </div>
          </div>

          {/* Combo Option */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="combo"
                checked={selectedFeatures.combo}
                onCheckedChange={(checked) =>
                  handleFeatureToggle("combo", checked as boolean)
                }
              />
              <label
                htmlFor="combo"
                className="text-sm font-medium cursor-pointer"
              >
                Feature + Boost Combo
              </label>
              <Badge variant="default" className="bg-blue-600">
                Save GHS{" "}
                {(getPricing("feature")?.amount || 20) +
                  (getPricing("boost")?.amount || 10) -
                  (getPricing("combo")?.amount || 30)}
              </Badge>
              <Badge variant="outline">
                GHS {getPricing("combo")?.amount || 30} / 7 days
              </Badge>
            </div>
            <p className="text-xs text-blue-700 ml-6 mt-1">
              Best value: Both featured and boosted for 7 days
            </p>
          </div>

          <Separator />

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Urgent Tag */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={selectedFeatures.urgent}
                onCheckedChange={(checked) =>
                  handleFeatureToggle("urgent", checked as boolean)
                }
              />
              <label
                htmlFor="urgent"
                className="text-sm font-medium cursor-pointer"
              >
                Urgent Tag
              </label>
              <Badge variant="outline" className="text-red-600">
                GHS {getPricing("urgent")?.amount || 4}
              </Badge>
            </div>

            {/* Highlight */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="highlight"
                checked={selectedFeatures.highlight}
                onCheckedChange={(checked) =>
                  handleFeatureToggle("highlight", checked as boolean)
                }
              />
              <label
                htmlFor="highlight"
                className="text-sm font-medium cursor-pointer"
              >
                Highlight
              </label>
              <Badge variant="outline" className="text-purple-600">
                GHS {getPricing("highlight")?.amount || 5}
              </Badge>
            </div>

            {/* Verified Badge */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified_badge"
                checked={selectedFeatures.verified_badge}
                onCheckedChange={(checked) =>
                  handleFeatureToggle("verified_badge", checked as boolean)
                }
              />
              <label
                htmlFor="verified_badge"
                className="text-sm font-medium cursor-pointer"
              >
                Verified Badge
              </label>
              <Badge variant="outline" className="text-green-600">
                GHS {getPricing("verified_badge")?.amount || 15}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Extra Photos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Extra Photos</h4>
                <p className="text-sm text-gray-500">
                  Currently using: {currentPhotoCount + extraPhotosCount}/10
                  photos
                </p>
              </div>
              <Badge variant="outline">
                GHS {getPricing("extra_photo")?.amount || 5} each
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtraPhotosChange(-1)}
                disabled={selectedFeatures.extra_photos === 0}
              >
                -
              </Button>
              <span className="font-medium w-8 text-center">
                {selectedFeatures.extra_photos}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtraPhotosChange(1)}
                disabled={
                  currentPhotoCount +
                    extraPhotosCount +
                    selectedFeatures.extra_photos >=
                  10
                }
              >
                +
              </Button>
            </div>
          </div>

          <Separator />

          {/* Business Subscription */}
          {!isBusinessUser && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="business_subscription"
                  checked={selectedFeatures.business_subscription}
                  onCheckedChange={(checked) =>
                    handleFeatureToggle(
                      "business_subscription",
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor="business_subscription"
                  className="text-sm font-medium cursor-pointer"
                >
                  Business Subscription
                </label>
                <Badge variant="default" className="bg-orange-600">
                  GHS {getPricing("business_subscription")?.amount || 100} /
                  month
                </Badge>
              </div>
              <ul className="text-xs text-orange-700 ml-6 space-y-1">
                <li>• Discounted promotion rates</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
                <li>• Bulk listing tools</li>
              </ul>
            </div>
          )}

          {/* Homepage Banner Ad */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="banner_ad"
                checked={selectedFeatures.banner_ad}
                onCheckedChange={(checked) =>
                  handleFeatureToggle("banner_ad", checked as boolean)
                }
              />
              <label
                htmlFor="banner_ad"
                className="text-sm font-medium cursor-pointer"
              >
                Homepage Banner Ad
              </label>
              <Badge variant="default" className="bg-purple-600">
                GHS {getPricing("banner_ad")?.amount || 180} / 7 days
              </Badge>
            </div>
            <p className="text-xs text-purple-700 ml-6">
              Premium placement on the homepage for maximum visibility
            </p>
          </div>

          {/* Total & Purchase */}
          {totalAmount > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  GHS {totalAmount.toFixed(2)}
                </span>
              </div>
              <Button onClick={handlePurchase} className="w-full" size="lg">
                Purchase Promotions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <MonetizationPaymentModal
          currency={pricing[0]?.currency || "GHS"}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          partId={partId}
          features={selectedFeatures}
          totalAmount={totalAmount}
          pricing={pricing}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default ComprehensiveMonetizationPanel;
