
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="p-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm border-b">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-600" />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
            <p className="text-sm text-gray-600">Pending Requests</p>
          </Card>
          <Card className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{requests.filter(r => r.status === 'matched').length}</p>
            <p className="text-sm text-gray-600">Matched</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{requests.filter(r => r.status === 'completed').length}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </Card>
          <Card className="p-4 text-center">
            <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{requests.length}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">All Requests</TabsTrigger>
            <TabsTrigger value="offers">Supplier Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Customer Requests</h2>
              
              {requests.map(request => (
                <Card key={request.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.make} {request.model} {request.year}
                      </h3>
                      <p className="text-gray-600">Part: {request.part}</p>
                      <p className="text-sm text-gray-500">Customer: {request.customer}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{request.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {request.phone}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <Button 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleMatchSupplier(request.id, '1')}
                      >
                        Match with Supplier
                      </Button>
                    )}
                    {request.status === 'matched' && (
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleCompleteRequest(request.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`tel:${request.phone}`, '_self')}
                    >
                      Call Customer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Supplier Offers</h2>
              
              {offers.map(offer => {
                const relatedRequest = requests.find(r => r.id === offer.requestId);
                return (
                  <Card key={offer.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {relatedRequest?.make} {relatedRequest?.model} - {relatedRequest?.part}
                        </h3>
                        <p className="text-gray-600">Supplier: {offer.supplier}</p>
                        <p className="text-lg font-semibold text-green-600">{offer.price}</p>
                      </div>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {offer.phone}
                      </div>
                    </div>

                    {offer.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleMatchSupplier(offer.requestId, offer.id)}
                        >
                          Accept Offer
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`tel:${offer.phone}`, '_self')}
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
