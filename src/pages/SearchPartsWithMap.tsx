import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCarParts } from "@/hooks/useCarParts";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SearchControls from "@/components/SearchControls";
import CarPartsList from "@/components/CarPartsList";
import PageHeader from "@/components/PageHeader";
import PendingRatingNotification from "@/components/PendingRatingNotification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Calendar,
  MessageCircle,
  Package,
  ClipboardList,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Define the filters interface to match what SearchControls expects
interface FilterState {
  make: string;
  model: string;
  year: string;
  category: string;
  location: string;
  priceRange: [number, number];
  maxDistance?: number;
}

interface PartRequest {
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
  photo_url?: string;
  currency?: string;
}

const SearchPartsWithMap = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    make: "",
    model: "",
    year: "",
    category: "",
    location: "",
    priceRange: [0, 10000] as [number, number],
    maxDistance: 300 // Default to 300 miles
  });

  // For part requests
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<PartRequest[]>([]);

  const {
    requestLocation,
    location,
    loading: locationLoading,
    error: locationError,
    permission
  } = useLocationDetection({
    enableHighAccuracy: true,
    includeAddress: true
  });

  const { parts, loading, error } = useCarParts({ 
    searchTerm, 
    filters,
    userLocation: location
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter(
      (request) =>
        request.part_needed
          .toLowerCase()
          .includes(requestSearchTerm.toLowerCase()) ||
        request.car_make
          .toLowerCase()
          .includes(requestSearchTerm.toLowerCase()) ||
        request.car_model
          .toLowerCase()
          .includes(requestSearchTerm.toLowerCase()) ||
        request.location.toLowerCase().includes(requestSearchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [requestSearchTerm, requests]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("part_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: t("error"),
        description: "Failed to load requests",
        variant: "destructive",
      });
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleMakeOffer = (requestId: string) => {
    if (!user) {
      navigate("/seller-auth");
      return;
    }
    navigate("/seller-dashboard", {
      state: { activeTab: "requests", highlightRequest: requestId },
    });
  };

  const handleContact = (phone: string, request: PartRequest) => {
    const message = `Hi! I saw your request for ${request.part_needed} for ${request.car_make} ${request.car_model} (${request.car_year}). I may have what you're looking for.`;
    const whatsappUrl = `https://wa.me/${phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleLocationRequest = async () => {
    await requestLocation();
  };
  
  // Custom handler to ensure type compatibility
  const handleFiltersChange = (newFilters: FilterState) => {
    console.log('New filters:', newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <PageHeader 
        title="Browse Parts with Map"
        subtitle="Find parts near you with location directions"
        backTo="/"
      />
      
      <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <PendingRatingNotification />
        
        <div className="mb-6">
          <Button 
            onClick={handleLocationRequest}
            disabled={locationLoading}
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {locationLoading ? "Getting location..." : "📍 Use My Location"}
          </Button>
          
          {locationError && (
            <div className="mt-2">
              <p className="text-sm text-destructive mb-2">{locationError}</p>
              {/* Manual location input form appears when location is denied */}
              {permission === 'denied' && (
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    placeholder="Enter your city or location"
                    onChange={(e) => {
                      const location = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        location
                      }));
                    }}
                    className="flex-1"
                  />
                </div>
              )}
            </div>
          )}
          
          {location && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Showing results near {location.city || location.address}
              </p>
              <p className="text-sm font-medium text-primary mt-1">
                Current distance filter: {filters.maxDistance} miles
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="parts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-background border-2 border-border p-2 h-auto">
            <TabsTrigger
              value="parts"
              className="flex items-center gap-2 h-12 text-base font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Package className="w-5 h-5" />
              {t("partsForSale")}
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="flex items-center gap-2 h-12 text-base font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
            >
              <ClipboardList className="w-5 h-5" />
              {t("requestedParts")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parts" className="space-y-4 sm:space-y-6">
            <div className="mx-auto max-w-sm sm:max-w-none">
              <SearchControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                showLocationFilters={true}
              />
            </div>

            <CarPartsList 
              parts={parts} 
              loading={loading} 
              error={error}
              userLocation={location}
            />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4 sm:space-y-6">
            {/* Search for requests */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={t("searchRequests")}
                value={requestSearchTerm}
                onChange={(e) => setRequestSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stats */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-blue-600">
                {filteredRequests.length}
              </div>
              <div className="text-sm text-blue-700">{t("activeRequests")}</div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {requestsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">{t("loading")}...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">{t("noRequestsFound")}</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex gap-3 flex-1">
                          {request.photo_url && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={request.photo_url}
                                alt={request.part_needed}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {request.part_needed}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {request.car_make} {request.car_model} (
                              {request.car_year})
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 flex-shrink-0"
                        >
                          {t("active")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {request.description && (
                        <p className="text-sm text-gray-600">
                          {request.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(request.created_at)}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleMakeOffer(request.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {t("makeOffer")}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleContact(request.phone, request)}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SearchPartsWithMap;