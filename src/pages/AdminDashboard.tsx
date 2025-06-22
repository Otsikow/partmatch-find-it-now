import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Package, CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Request {
  id: string;
  make: string;
  model: string;
  year: string;
  part: string;
  customer: string;
  location: string;
  phone: string;
  status: 'pending' | 'matched' | 'completed';
  timestamp: string;
}

interface Offer {
  id: string;
  requestId: string;
  supplier: string;
  price: string;
  phone: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Corolla',
      year: '2015',
      part: 'Alternator',
      customer: 'John Doe',
      location: 'Accra',
      phone: '+233 20 123 4567',
      status: 'pending',
      timestamp: '2024-01-15 10:30'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: '2012',
      part: 'Brake Pads',
      customer: 'Jane Smith',
      location: 'Kumasi',
      phone: '+233 24 987 6543',
      status: 'matched',
      timestamp: '2024-01-15 09:15'
    }
  ]);

  const [offers] = useState<Offer[]>([
    {
      id: '1',
      requestId: '1',
      supplier: 'AutoParts Ghana',
      price: 'GHS 450',
      phone: '+233 20 555 1234',
      status: 'pending'
    },
    {
      id: '2',
      requestId: '2',
      supplier: 'Parts Express',
      price: 'GHS 180',
      phone: '+233 24 777 8888',
      status: 'accepted'
    }
  ]);

  const handleMatchSupplier = (requestId: string, offerId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'matched' } : req
    ));
    
    toast({
      title: "Match Created!",
      description: "Both customer and supplier have been notified via WhatsApp.",
    });
  };

  const handleCompleteRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'completed' } : req
    ));
    
    toast({
      title: "Request Completed!",
      description: "The transaction has been marked as complete.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'matched': return <Users className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 font-inter">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-yellow-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">{requests.filter(r => r.status === 'pending').length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Pending Requests</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">{requests.filter(r => r.status === 'matched').length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Matched</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-green-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">{requests.filter(r => r.status === 'completed').length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Completed</p>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3 w-fit mx-auto mb-3 shadow-lg">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">{requests.length}</p>
            <p className="text-sm sm:text-base text-gray-600 font-crimson">Total Requests</p>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm">
            <TabsTrigger value="requests" className="text-base font-inter">All Requests</TabsTrigger>
            <TabsTrigger value="offers" className="text-base font-inter">Supplier Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Customer Requests</h2>
              
              {requests.map(request => (
                <Card key={request.id} className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div>
                      <h3 className="font-playfair font-semibold text-lg sm:text-xl">
                        {request.make} {request.model} {request.year}
                      </h3>
                      <p className="text-gray-600 font-crimson text-base sm:text-lg">Part: {request.part}</p>
                      <p className="text-sm sm:text-base text-gray-500 font-inter">Customer: {request.customer}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1 text-sm sm:text-base`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 font-inter">{request.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-crimson">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {request.phone}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {request.status === 'pending' && (
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => handleMatchSupplier(request.id, '1')}
                      >
                        Match with Supplier
                      </Button>
                    )}
                    {request.status === 'matched' && (
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => handleCompleteRequest(request.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`tel:${request.phone}`, '_self')}
                      className="text-base border-purple-200 hover:bg-purple-50"
                    >
                      Call Customer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Supplier Offers</h2>
              
              {offers.map(offer => {
                const relatedRequest = requests.find(r => r.id === offer.requestId);
                return (
                  <Card key={offer.id} className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div>
                        <h3 className="font-playfair font-semibold text-lg sm:text-xl">
                          {relatedRequest?.make} {relatedRequest?.model} - {relatedRequest?.part}
                        </h3>
                        <p className="text-gray-600 font-crimson text-base sm:text-lg">Supplier: {offer.supplier}</p>
                        <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">{offer.price}</p>
                      </div>
                      <Badge className={`${getStatusColor(offer.status)} text-sm sm:text-base`}>
                        {offer.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-crimson">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {offer.phone}
                      </div>
                    </div>

                    {offer.status === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => handleMatchSupplier(offer.requestId, offer.id)}
                        >
                          Accept Offer
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`tel:${offer.phone}`, '_self')}
                          className="text-base border-purple-200 hover:bg-purple-50"
                        >
                          Call Supplier
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
