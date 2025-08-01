import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  MessageCircle, 
  EyeOff, 
  Eye,
  Trash2, 
  Phone,
  Car,
  Wrench,
  User
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ChatButton from "@/components/chat/ChatButton";
import RequestCardActions from "./RequestCardActions";
import RequestCardOfferForm from "./RequestCardOfferForm";
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

interface RequestExpandedDialogProps {
  request: PartRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestUpdated?: () => void;
}

const RequestExpandedDialog = ({ 
  request, 
  isOpen, 
  onClose, 
  onRequestUpdated 
}: RequestExpandedDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerLocation, setOfferLocation] = useState("");
  
  const { handleMakeOffer: submitOffer, handleWhatsAppContact, isSubmittingOffer } = useOfferHandling();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch buyer's profile information
  useEffect(() => {
    const fetchBuyerProfile = async () => {
      if (!request?.owner_id) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, user_type, is_verified')
          .eq('id', request.owner_id)
          .single();
        
        setBuyerProfile(profile);
      } catch (error) {
        console.error('Error fetching buyer profile:', error);
      }
    };

    fetchBuyerProfile();
  }, [request?.owner_id]);

  if (!request) return null;

  // Check if user is admin or request owner
  const isAdmin = userProfile?.user_type === 'admin' || user?.user_metadata?.user_type === 'admin';
  const isOwner = user?.id === request.owner_id;
  const canModifyRequest = isAdmin || isOwner;

  const [showOfferForm, setShowOfferForm] = useState(false);

  const handleMakeOffer = () => {
    if (!user) {
      navigate("/seller-auth");
      return;
    }
    setShowOfferForm(true);
  };

  const handleContact = () => {
    const message = `Hi! I saw your request for ${request.part_needed} for ${request.car_make} ${request.car_model} (${request.car_year}). I may have what you're looking for.`;
    const whatsappUrl = `https://wa.me/${request.phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleChatContact = (requestId: string, ownerId: string) => {
    // Chat functionality is handled by ChatButton component
    console.log('Chat initiated for request:', requestId, 'with owner:', ownerId);
  };

  const handleHideRequest = async () => {
    if (!canModifyRequest) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to hide this request.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Hiding request:', request.id, 'User:', user?.id, 'IsAdmin:', isAdmin, 'IsOwner:', isOwner);
      
      const { error } = await supabase
        .from("part_requests")
        .update({ status: "cancelled" })
        .eq("id", request.id);

      if (error) {
        console.error('Error hiding request:', error);
        throw error;
      }

      toast({
        title: "Request Hidden",
        description: isAdmin ? "The part request has been hidden from public view." : "Your request has been hidden from public view.",
      });

      onRequestUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error hiding request:", error);
      toast({
        title: "Error",
        description: `Failed to hide the request: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnhideRequest = async () => {
    if (!canModifyRequest) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to unhide this request.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Unhiding request:', request.id, 'User:', user?.id, 'IsAdmin:', isAdmin, 'IsOwner:', isOwner);
      
      const { error } = await supabase
        .from("part_requests")
        .update({ status: "pending" })
        .eq("id", request.id);

      if (error) {
        console.error('Error unhiding request:', error);
        throw error;
      }

      toast({
        title: "Request Restored",
        description: isAdmin ? "The part request has been restored to public view." : "Your request has been restored to public view.",
      });

      onRequestUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error unhiding request:", error);
      toast({
        title: "Error",
        description: `Failed to restore the request: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!canModifyRequest) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete this request.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm(isAdmin ? 
      "Are you sure you want to permanently delete this request? This action cannot be undone." :
      "Are you sure you want to permanently delete your request? This action cannot be undone."
    )) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Deleting request:', request.id, 'User:', user?.id, 'IsAdmin:', isAdmin, 'IsOwner:', isOwner);
      
      // First delete any related offers
      const { error: offersError } = await supabase
        .from("offers")
        .delete()
        .eq("request_id", request.id);

      
      if (offersError) {
        console.error('Error deleting related offers:', offersError);
        // Continue with request deletion even if offers deletion fails
      }

      // Then delete the request
      const { error } = await supabase
        .from("part_requests")
        .delete()
        .eq("id", request.id);

      if (error) {
        console.error('Error deleting request:', error);
        throw error;
      }

      toast({
        title: "Request Deleted",
        description: isAdmin ? "The part request has been permanently deleted." : "Your request has been permanently deleted.",
      });

      onRequestUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: `Failed to delete the request: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-left leading-tight">
            {request.part_needed}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Request Image */}
          {request.photo_url && (
            <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-gray-100">
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

          {/* Status Badge */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 w-fit"
            >
              {request.status === 'pending' ? 'Active' : request.status}
            </Badge>
            {canModifyRequest && (
              <div className="flex gap-2 flex-wrap">
                {request.status === 'cancelled' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnhideRequest}
                    disabled={isLoading}
                    className="text-green-600 hover:text-green-700 text-xs"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Unhide
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleHideRequest}
                    disabled={isLoading}
                    className="text-orange-600 hover:text-orange-700 text-xs"
                  >
                    <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Hide
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteRequest}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 text-xs"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="font-semibold text-base sm:text-lg">Vehicle Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Make</p>
                  <p className="font-medium text-sm sm:text-base">{request.car_make}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Model</p>
                  <p className="font-medium text-sm sm:text-base">{request.car_model}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Year</p>
                  <p className="font-medium text-sm sm:text-base">{request.car_year}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Part Information */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <h3 className="font-semibold text-base sm:text-lg">Part Needed</h3>
              </div>
              <p className="font-medium text-base sm:text-lg mb-2">{request.part_needed}</p>
              {request.description && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-800 text-sm sm:text-base">{request.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buyer Information */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <h3 className="font-semibold text-base sm:text-lg">Requested By</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  {buyerProfile ? (
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base">
                        {buyerProfile.first_name} {buyerProfile.last_name}
                      </p>
                      {buyerProfile.is_verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Verified
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600 capitalize">
                    {buyerProfile?.user_type || 'Owner'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base truncate">{request.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base truncate">{request.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">
                    Posted on {formatDate(request.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - Only show for non-owners */}
          {request.status === 'pending' && !isOwner && (
            <div className="pt-2 sm:pt-4">
              {showOfferForm ? (
                <RequestCardOfferForm
                  requestId={request.id}
                  offerPrice={offerPrice}
                  setOfferPrice={setOfferPrice}
                  offerMessage={offerMessage}
                  setOfferMessage={setOfferMessage}
                  offerLocation={offerLocation}
                  setOfferLocation={setOfferLocation}
                  onSubmit={async (requestId, price, message, location) => {
                    await submitOffer(requestId, price, message, location);
                    setShowOfferForm(false);
                    setOfferPrice("");
                    setOfferMessage("");
                    setOfferLocation("");
                    onClose();
                  }}
                  onCancel={() => {
                    setShowOfferForm(false);
                    setOfferPrice("");
                    setOfferMessage("");
                    setOfferLocation("");
                  }}
                  isSubmitting={isSubmittingOffer}
                />
              ) : (
                <RequestCardActions
                  request={{
                    id: request.id,
                    phone: request.phone,
                    owner_id: request.owner_id
                  }}
                  onShowOfferForm={() => setShowOfferForm(true)}
                  onChatContact={handleChatContact}
                  onWhatsAppContact={(phone, req) => handleWhatsAppContact(phone, {
                    id: req.id,
                    car_make: request.car_make,
                    car_model: request.car_model,
                    car_year: request.car_year,
                    part_needed: request.part_needed,
                    location: request.location,
                    phone: req.phone
                  })}
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestExpandedDialog;