
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useOfferHandling } from '@/hooks/useOfferHandling';
import RequestExpandedDialog from '@/components/RequestExpandedDialog';

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
  owner_id: string;
  photo_url?: string;
  currency?: string;
}

const BuyerRequestsTab = () => {
  const { user } = useAuth();
  const { handleMakeOffer, handleWhatsAppContact, isSubmittingOffer } = useOfferHandling();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['buyer-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('part_requests')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching buyer requests:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };

  const handleRequestDialogClose = () => {
    setIsRequestDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleRequestUpdated = () => {
    refetch(); // Refresh the requests list
  };

  const handleChatContact = (requestId: string, ownerId: string) => {
    // For buyer's own requests, they can't chat with themselves
    console.log('Cannot chat with yourself for your own request');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request: Request) => (
        <Card 
          key={request.id} 
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => handleRequestClick(request)}
        >
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {request.car_make} {request.car_model} {request.car_year}
                </h3>
                <p className="text-orange-600 font-medium text-base mb-3">
                  Part Needed: {request.part_needed}
                </p>
                
                {request.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">
                      {request.description}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{request.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(request.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : request.status === 'offer_received'
                    ? 'bg-blue-100 text-blue-800'
                    : request.status === 'cancelled'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {request.status === 'pending' ? 'Active' : 
                   request.status === 'offer_received' ? 'Has Offers' : 
                   request.status === 'cancelled' ? 'Hidden' :
                   'Completed'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <RequestExpandedDialog
        request={selectedRequest}
        isOpen={isRequestDialogOpen}
        onClose={handleRequestDialogClose}
        onRequestUpdated={handleRequestUpdated}
      />

      {requests.length === 0 && (
        <Card className="p-12 text-center bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border-0 shadow-lg">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-3">No Requests Yet</h3>
          <p className="text-gray-600 text-lg mb-6">You haven't submitted any part requests yet</p>
          <button 
            onClick={() => window.location.href = '/request-part'}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Submit Your First Request
          </button>
        </Card>
      )}
    </div>
  );
};

export default BuyerRequestsTab;
