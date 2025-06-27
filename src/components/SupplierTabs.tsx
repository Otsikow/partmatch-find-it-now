import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Clock, Phone, MapPin, Package, TrendingUp, CheckCircle, User } from "lucide-react";
import SellerProfileManagement from "./SellerProfileManagement";

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
}

interface Offer {
  id: string;
  price: number;
  message?: string;
  status: string;
  created_at: string;
  contact_unlocked: boolean;
  request: {
    id: string;
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
    phone: string;
    location: string;
  };
}

interface SupplierTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  requests: Request[];
  offers: Offer[];
  onOfferSubmit: (requestId: string, price: number, message: string, location: string) => void;
  onWhatsAppContact: (phone: string, request: Request | Offer['request']) => void;
  isSubmittingOffer: boolean;
}

const SupplierTabs = ({
  activeTab,
  onTabChange,
  requests,
  offers,
  onOfferSubmit,
  onWhatsAppContact,
  isSubmittingOffer
}: SupplierTabsProps) => {
  const [offerData, setOfferData] = useState<{ [key: string]: { price: string; message: string; location: string } }>({});

  const handleOfferSubmit = (requestId: string) => {
    const data = offerData[requestId];
    if (!data?.price || !data?.location) {
      toast({
        title: "Missing Information",
        description: "Please provide both price and your location.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    onOfferSubmit(requestId, price, data.message, data.location);
    
    // Clear the form
    setOfferData(prev => ({ ...prev, [requestId]: { price: '', message: '', location: '' } }));
  };

  const updateOfferData = (requestId: string, field: string, value: string) => {
    setOfferData(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value
      }
    }));
  };

  const getOfferData = (requestId: string, field: string) => {
    return offerData[requestId]?.[field] || '';
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="requests" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Part Requests ({requests.length})
        </TabsTrigger>
        <TabsTrigger value="offers" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          My Offers ({offers.length})
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-orange-700 mb-2">Active Part Requests</h3>
          <p className="text-gray-600">Make offers on parts you can supply</p>
        </div>

        {requests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active requests at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-orange-700">
                        {request.part_needed}
                      </CardTitle>
                      <p className="text-gray-600">
                        {request.car_make} {request.car_model} {request.car_year}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.description && (
                    <p className="text-gray-700">{request.description}</p>
                  )}
                  
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-medium text-orange-700">Make an Offer</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Input
                          type="number"
                          placeholder="Price (GHS)"
                          value={getOfferData(request.id, 'price')}
                          onChange={(e) => updateOfferData(request.id, 'price', e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Your location"
                          value={getOfferData(request.id, 'location')}
                          onChange={(e) => updateOfferData(request.id, 'location', e.target.value)}
                        />
                      </div>
                      <div>
                        <Button
                          onClick={() => handleOfferSubmit(request.id)}
                          disabled={isSubmittingOffer}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                        >
                          {isSubmittingOffer ? 'Submitting...' : 'Submit Offer'}
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Additional message (optional)"
                      value={getOfferData(request.id, 'message')}
                      onChange={(e) => updateOfferData(request.id, 'message', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="offers" className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-orange-700 mb-2">My Offers</h3>
          <p className="text-gray-600">Track your submitted offers and their status</p>
        </div>

        {offers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't made any offers yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-blue-700">
                        {offer.request.part_needed}
                      </CardTitle>
                      <p className="text-gray-600">
                        {offer.request.car_make} {offer.request.car_model} {offer.request.car_year}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={offer.status === 'accepted' ? 'default' : 'outline'}
                        className={offer.status === 'accepted' ? 'bg-green-600' : 'text-blue-600 border-blue-600'}
                      >
                        {offer.status}
                      </Badge>
                      <p className="text-lg font-bold text-green-600 mt-1">
                        GHS {offer.price}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offer.message && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Your Message:</p>
                      <p className="text-gray-600">{offer.message}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {offer.request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(offer.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {offer.status === 'accepted' && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Offer Accepted!</span>
                        </div>
                        <Button
                          onClick={() => onWhatsAppContact(offer.request.phone, offer.request)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Buyer
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-orange-700 mb-2">Profile Management</h3>
          <p className="text-gray-600">Manage your seller account information</p>
        </div>

        <SellerProfileManagement />
      </TabsContent>
    </Tabs>
  );
};

export default SupplierTabs;
