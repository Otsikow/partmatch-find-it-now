
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

interface Part {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  price: string;
  condition: 'New' | 'Used' | 'Refurbished';
  supplier: string;
  location: string;
  phone: string;
  image?: string;
}

const SearchParts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');

  // Mock data - in real app this would come from a database
  const mockParts: Part[] = [
    {
      id: '1',
      name: 'Alternator',
      make: 'Toyota',
      model: 'Corolla',
      year: '2015-2018',
      price: 'GHS 450',
      condition: 'New',
      supplier: 'AutoParts Ghana',
      location: 'Accra Central',
      phone: '+233 20 123 4567'
    },
    {
      id: '2',
      name: 'Brake Pads (Front)',
      make: 'Honda',
      model: 'Civic',
      year: '2012-2016',
      price: 'GHS 180',
      condition: 'New',
      supplier: 'Parts Express',
      location: 'Kumasi',
      phone: '+233 24 987 6543'
    },
    {
      id: '3',
      name: 'Headlight Assembly',
      make: 'Nissan',
      model: 'Sentra',
      year: '2013-2017',
      price: 'GHS 320',
      condition: 'Used',
      supplier: 'Speed Parts',
      location: 'Tema',
      phone: '+233 26 555 1234'
    },
    {
      id: '4',
      name: 'Water Pump',
      make: 'Toyota',
      model: 'Camry',
      year: '2010-2014',
      price: 'GHS 280',
      condition: 'Refurbished',
      supplier: 'Reliable Auto',
      location: 'Accra',
      phone: '+233 20 888 9999'
    }
  ];

  const filteredParts = mockParts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMake = selectedMake === '' || part.make === selectedMake;
    return matchesSearch && matchesMake;
  });

  const uniqueMakes = Array.from(new Set(mockParts.map(part => part.make)));

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Used': return 'bg-blue-100 text-blue-800';
      case 'Refurbished': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="p-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm border-b">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-green-600" />
          <h1 className="text-xl font-bold">Search Parts</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search Controls */}
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search parts (e.g. alternator, brake pads)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedMake === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMake('')}
              >
                All Makes
              </Button>
              {uniqueMakes.map(make => (
                <Button
                  key={make}
                  variant={selectedMake === make ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMake(make)}
                >
                  {make}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {filteredParts.length} Parts Found
            </h2>
          </div>

          {filteredParts.map(part => (
            <Card key={part.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{part.name}</h3>
                  <p className="text-gray-600">
                    {part.make} {part.model} ({part.year})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{part.price}</p>
                  <Badge className={getConditionColor(part.condition)}>
                    {part.condition}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{part.supplier}</p>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      {part.location}
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(`tel:${part.phone}`, '_self')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredParts.length === 0 && (
            <Card className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No parts found</h3>
              <p className="text-gray-600 mb-4">
                Try searching with different keywords or{' '}
                <Link to="/request" className="text-green-600 hover:underline">
                  request the part you need
                </Link>
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchParts;
