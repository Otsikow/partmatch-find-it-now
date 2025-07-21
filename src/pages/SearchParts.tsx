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
import RequestCard from "@/components/RequestCard";
import { useOfferHandling } from "@/hooks/useOfferHandling";

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

  // Add offer handling
  const { handleMakeOffer: submitOffer, handleWhatsAppContact, isSubmittingOffer } = useOfferHandling(fetchRequests);

  const handleExpandRequest = (request: PartRequest) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };

  const handleChatContact = (requestId: string, ownerId: string) => {
    // Navigate to chat with the request owner
    navigate(`/chat?sellerId=${ownerId}`);
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

      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 sm:pb-6">
        <PendingRatingNotification />

        <Tabs defaultValue="parts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 bg-background border-2 border-border p-1 sm:p-2 h-auto rounded-lg">
            <TabsTrigger
              value="parts"
              className="flex items-center gap-1 sm:gap-2 h-10 sm:h-12 text-sm sm:text-base font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200 px-2 sm:px-3"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t("partsForSale")}</span>
              <span className="xs:hidden">Parts</span>
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="flex items-center gap-1 sm:gap-2 h-10 sm:h-12 text-sm sm:text-base font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200 px-2 sm:px-3"
            >
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t("requestedParts")}</span>
              <span className="xs:hidden">Requests</span>
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
                  <RequestCard
                    key={request.id}
                    request={request}
                    onOfferSubmit={submitOffer}
                    onWhatsAppContact={handleWhatsAppContact}
                    onChatContact={handleChatContact}
                    isSubmittingOffer={isSubmittingOffer}
                  />
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
