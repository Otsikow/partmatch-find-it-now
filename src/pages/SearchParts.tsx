
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 font-inter">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Search className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">Search Parts</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        {/* Search Controls */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search parts (e.g. alternator, brake pads)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-base sm:text-lg border-emerald-200 focus:border-emerald-400"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedMake === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMake('')}
                className={selectedMake === '' ? "bg-gradient-to-r from-emerald-600 to-green-700 text-base" : "text-base border-emerald-200 hover:bg-emerald-50"}
              >
                All Makes
              </Button>
              {uniqueMakes.map(make => (
                <Button
                  key={make}
                  variant={selectedMake === make ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMake(make)}
                  className={selectedMake === make ? "bg-gradient-to-r from-emerald-600 to-green-700 text-base" : "text-base border-emerald-200 hover:bg-emerald-50"}
                >
                  {make}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              {filteredParts.length} Parts Found
            </h2>
          </div>

          {filteredParts.map(part => (
            <Card key={part.id} className="p-4 sm:p-6 bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div>
                  <h3 className="font-playfair font-semibold text-lg sm:text-xl">{part.name}</h3>
                  <p className="text-gray-600 font-crimson text-base sm:text-lg">
                    {part.make} {part.model} ({part.year})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">{part.price}</p>
                  <Badge className={`${getConditionColor(part.condition)} text-sm sm:text-base`}>
                    {part.condition}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium font-inter text-base sm:text-lg">{part.supplier}</p>
                    <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base font-crimson">
                      <MapPin className="h-4 w-4" />
                      {part.location}
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
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
            <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm border-0 shadow-lg">
              <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-playfair font-semibold mb-2 sm:mb-3">No parts found</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 font-crimson text-base sm:text-lg">
                Try searching with different keywords or{' '}
                <Link to="/request" className="text-emerald-600 hover:underline font-medium">
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
