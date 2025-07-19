import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCarParts } from "@/hooks/useCarParts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SearchControls from "@/components/SearchControls";
import CarPartsList from "@/components/CarPartsList";
import PageHeader from "@/components/PageHeader";
import RequestExpandedDialog from "@/components/RequestExpandedDialog";
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
import ChatButton from "@/components/chat/ChatButton";

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

const SearchParts = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    category: "",
    location: "",
    priceRange: [0, 10000] as [number, number],
  });

  // For car parts
  const {
    parts,
    loading: partsLoading,
    error: partsError,
  } = useCarParts({ searchTerm, filters });

  // For part requests
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<PartRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

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

  const handleExpandRequest = (request: PartRequest) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader
        title="Browse Parts for Sale & Requested Parts"
        subtitle="Find parts for sale and buyer requests"
        showBackButton={true}
        backTo="/"
      />

      <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 sm:pb-6">
        <PendingRatingNotification />

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
                onFiltersChange={setFilters}
              />
            </div>

            <CarPartsList
              parts={parts}
              loading={partsLoading}
              error={partsError}
            />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4 sm:space-y-6">
            {/* Search for requests */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t("searchRequests")}
                value={requestSearchTerm}
                onChange={(e) => setRequestSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stats */}
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-primary">
                {filteredRequests.length}
              </div>
              <div className="text-sm text-primary">{t("activeRequests")}</div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {requestsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{t("loading")}...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">{t("noRequestsFound")}</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleExpandRequest(request)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex gap-3 flex-1">
                          {request.photo_url && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                            <CardTitle className="text-lg font-semibold text-foreground">
                              {request.part_needed}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {request.car_make} {request.car_model} (
                              {request.car_year})
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary flex-shrink-0"
                        >
                          {t("active")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {request.description && (
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(request.created_at)}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2 pb-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMakeOffer(request.id);
                            }}
                            size="sm"
                            className="flex-1 min-w-[90px] bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
                          >
                           {t("makeOffer")}
                         </Button>
                         <ChatButton
                           sellerId={request.owner_id}
                           className="flex-1 min-w-[70px] border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
                           size="sm"
                         >
                           Chat
                         </ChatButton>
                         <Button
                           variant="outline"
                           size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContact(request.phone, request);
                            }}
                            className="flex-1 min-w-[80px] border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs h-9"
                          >
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

        <RequestExpandedDialog
          request={selectedRequest}
          isOpen={isRequestDialogOpen}
          onClose={() => setIsRequestDialogOpen(false)}
          onRequestUpdated={fetchRequests}
        />
      </main>
    </div>
  );
};

export default SearchParts;
