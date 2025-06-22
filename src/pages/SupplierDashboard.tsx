
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Plus, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Request {
  id: string;
  make: string;
  model: string;
  year: string;
  part: string;
  location: string;
  phone: string;
  status: 'pending' | 'offered' | 'completed';
}

interface Part {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  price: string;
  condition: string;
  location: string;
}

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showAddPart, setShowAddPart] = useState(false);
  const [newPart, setNewPart] = useState({
    name: '',
    make: '',
    model: '',
    year: '',
    price: '',
    condition: 'New',
    location: ''
  });

  // Mock data
  const [requests] = useState<Request[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Corolla',
      year: '2015',
      part: 'Alternator',
      location: 'Accra',
      phone: '+233 20 123 4567',
      status: 'pending'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: '2012',
      part: 'Brake Pads',
      location: 'Kumasi',
      phone: '+233 24 987 6543',
      status: 'pending'
    }
  ]);

  const [myParts, setMyParts] = useState<Part[]>([
    {
      id: '1',
      name: 'Alternator',
      make: 'Toyota',
      model: 'Corolla',
      year: '2015-2018',
      price: 'GHS 450',
      condition: 'New',
      location: 'Accra Central'
    }
  ]);

  const handleMakeOffer = (requestId: string) => {
    console.log('Making offer for request:', requestId);
    toast({
      title: "Offer Sent!",
      description: "The customer will be notified of your offer.",
    });
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    const part: Part = {
      id: Date.now().toString(),
      ...newPart
    };
    setMyParts(prev => [...prev, part]);
    setNewPart({
      name: '',
      make: '',
      model: '',
      year: '',
      price: '',
      condition: 'New',
      location: ''
    });
    setShowAddPart(false);
    toast({
      title: "Part Added!",
      description: "Your part is now available for customers to find.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="p-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm border-b">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-orange-600" />
          <h1 className="text-xl font-bold">Supplier Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Part Requests</TabsTrigger>
            <TabsTrigger value="inventory">My Parts</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Customer Requests Near You</h2>
              
              {requests.map(request => (
                <Card key={request.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.make} {request.model} {request.year}
                      </h3>
                      <p className="text-gray-600">Part: {request.part}</p>
                    </div>
                    <Badge variant="outline">
                      {request.status}
                    </Badge>
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

                  <Button 
                    onClick={() => handleMakeOffer(request.id)}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    I Have This Part!
                  </Button>
                </Card>
              ))}

              {requests.length === 0 && (
                <Card className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                  <p className="text-gray-600">Check back later for new part requests</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Parts Inventory</h2>
                <Button 
                  onClick={() => setShowAddPart(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </div>

              {showAddPart && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Part</h3>
                  <form onSubmit={handleAddPart} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="partName">Part Name</Label>
                        <Input
                          id="partName"
                          value={newPart.name}
                          onChange={(e) => setNewPart(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Alternator"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="partMake">Make</Label>
                        <Input
                          id="partMake"
                          value={newPart.make}
                          onChange={(e) => setNewPart(prev => ({ ...prev, make: e.target.value }))}
                          placeholder="e.g. Toyota"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="partModel">Model</Label>
                        <Input
                          id="partModel"
                          value={newPart.model}
                          onChange={(e) => setNewPart(prev => ({ ...prev, model: e.target.value }))}
                          placeholder="e.g. Corolla"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="partYear">Year</Label>
                        <Input
                          id="partYear"
                          value={newPart.year}
                          onChange={(e) => setNewPart(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="e.g. 2015-2018"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="partPrice">Price</Label>
                        <Input
                          id="partPrice"
                          value={newPart.price}
                          onChange={(e) => setNewPart(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="e.g. GHS 450"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="partLocation">Location</Label>
                        <Input
                          id="partLocation"
                          value={newPart.location}
                          onChange={(e) => setNewPart(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. Accra Central"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                        Add Part
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowAddPart(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {myParts.map(part => (
                <Card key={part.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{part.name}</h3>
                      <p className="text-gray-600">
                        {part.make} {part.model} ({part.year})
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <span>{part.condition}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {part.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-600">{part.price}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupplierDashboard;
