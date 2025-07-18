import { useState } from "react";
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
  Trash2, 
  Phone,
  Car,
  Wrench
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

  if (!request) return null;

  const isAdmin = user?.user_metadata?.user_type === 'admin';

  const handleMakeOffer = () => {
    if (!user) {
      navigate("/seller-auth");
      return;
    }
    navigate("/seller-dashboard", {
      state: { activeTab: "requests", highlightRequest: request.id },
    });
    onClose();
  };

  const handleContact = () => {
    const message = `Hi! I saw your request for ${request.part_needed} for ${request.car_make} ${request.car_model} (${request.car_year}). I may have what you're looking for.`;
    const whatsappUrl = `https://wa.me/${request.phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleHideRequest = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("part_requests")
        .update({ status: "cancelled" })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Request Hidden",
        description: "The part request has been hidden from public view.",
      });

      onRequestUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error hiding request:", error);
      toast({
        title: "Error",
        description: "Failed to hide the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!isAdmin) return;
    
    if (!confirm("Are you sure you want to permanently delete this request? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    try {
      // First delete any related offers
      await supabase
        .from("offers")
        .delete()
        .eq("request_id", request.id);

      // Then delete the request
      const { error } = await supabase
        .from("part_requests")
        .delete()
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Request Deleted",
        description: "The part request has been permanently deleted.",
      });

      onRequestUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: "Failed to delete the request. Please try again.",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-left">
            {request.part_needed}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Image */}
          {request.photo_url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
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
          <div className="flex justify-between items-center">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800"
            >
              {request.status === 'pending' ? 'Active' : request.status}
            </Badge>
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHideRequest}
                  disabled={isLoading}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteRequest}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Vehicle Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Make</p>
                  <p className="font-medium">{request.car_make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-medium">{request.car_model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-medium">{request.car_year}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Part Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Part Needed</h3>
              </div>
              <p className="font-medium text-lg mb-2">{request.part_needed}</p>
              {request.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-800">{request.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{request.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{request.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    Posted on {formatDate(request.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleMakeOffer}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Make Offer
              </Button>
              <Button
                variant="outline"
                onClick={handleContact}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600"
                size="lg"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestExpandedDialog;