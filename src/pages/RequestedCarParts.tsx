import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import MobileHeader from "@/components/MobileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

const RequestedCarParts = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<PartRequest[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter(request =>
      request.part_needed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.car_make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.car_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('part_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: t('error'),
        description: "Failed to load requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = (requestId: string) => {
    if (!user) {
      navigate('/seller-auth');
      return;
    }
    // Navigate to seller dashboard with the specific request
    navigate('/seller-dashboard', { state: { activeTab: 'requests', highlightRequest: requestId } });
  };

  const handleContact = (phone: string, request: PartRequest) => {
    const message = `Hi! I saw your request for ${request.part_needed} for ${request.car_make} ${request.car_model} (${request.car_year}). I may have what you're looking for.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
        <MobileHeader />
        <div className="pt-16 pb-20 px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('loading')}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
      <MobileHeader />
      <div className="pt-16 pb-20 px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-foreground">{t('requestedCarParts')}</h1>
              <p className="text-muted-foreground">{t('browseAndRespondRequests')}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder={t('searchRequests')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-primary">{filteredRequests.length}</div>
          <div className="text-sm text-primary">{t('activeRequests')}</div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">{t('noRequestsFound')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
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
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {request.part_needed}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.car_make} {request.car_model} ({request.car_year})
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary flex-shrink-0">
                      {t('active')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {request.description && (
                    <p className="text-sm text-muted-foreground">{request.description}</p>
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

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => handleMakeOffer(request.id)}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg text-sm sm:text-base"
                    >
                      {t('makeOffer')}
                    </Button>
                    <Button
                      onClick={() => handleContact(request.phone, request)}
                      className="bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg text-sm sm:text-base"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestedCarParts;