
import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Grid3X3, Map, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { CarPart } from "@/types/CarPart";
import Footer from "@/components/Footer";

const SearchPartsWithMap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    fetchParts();
  }, []);

  useEffect(() => {
    if (viewMode === 'map' && mapContainer.current && !map.current) {
      initializeMap();
    }
    
    if (viewMode === 'map' && map.current) {
      updateMapMarkers();
    }
  }, [viewMode, parts]);

  const fetchParts = async () => {
    try {
      const { data, error } = await supabase
        .from('car_parts')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedParts = (data || []).map(part => ({
        ...part,
        condition: part.condition as 'New' | 'Used' | 'Refurbished',
        status: part.status as 'available' | 'sold' | 'hidden' | 'pending'
      }));
      
      setParts(typedParts);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2x6dzZkdXZiMDEyMzJqcGEwMzQyM2xlMSJ9.UKvTlBGGqFXJ9kEF7Q6GnA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.1870, 5.6037], // Accra, Ghana
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  const updateMapMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for filtered parts with location
    const partsWithLocation = filteredParts.filter(part => part.latitude && part.longitude);
    
    partsWithLocation.forEach(part => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#ea580c';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${part.title}</h3>
            <p class="text-sm text-gray-600">${part.make} ${part.model} ${part.year}</p>
            <p class="text-lg font-bold text-orange-600">${part.currency} ${part.price}</p>
            <p class="text-xs text-gray-500">${part.address || 'Location not specified'}</p>
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([part.longitude!, part.latitude!])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (partsWithLocation.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      partsWithLocation.forEach(part => {
        bounds.extend([part.longitude!, part.latitude!]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const matchesSearch = !searchTerm || 
        part.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.part_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMake = !selectedMake || part.make === selectedMake;
      const matchesModel = !selectedModel || part.model === selectedModel;
      const matchesYear = !selectedYear || part.year.toString() === selectedYear;
      const matchesCondition = !selectedCondition || part.condition === selectedCondition;
      const matchesPrice = !maxPrice || part.price <= parseFloat(maxPrice);

      return matchesSearch && matchesMake && matchesModel && matchesYear && matchesCondition && matchesPrice;
    });
  }, [parts, searchTerm, selectedMake, selectedModel, selectedYear, selectedCondition, maxPrice]);

  const uniqueMakes = [...new Set(parts.map(part => part.make))].sort();
  const uniqueModels = [...new Set(parts.filter(part => !selectedMake || part.make === selectedMake).map(part => part.model))].sort();
  const uniqueYears = [...new Set(parts.map(part => part.year.toString()))].sort().reverse();

  const handleWhatsAppContact = (part: CarPart) => {
    // For now, just show a message - you'd need to get supplier phone from profiles table
    alert(`Contact supplier for ${part.title}. WhatsApp integration would be implemented here.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading parts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
      {/* Header */}
      <header className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-white/50 flex-shrink-0">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-emerald-600 flex-shrink-0" />
          <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent truncate">
            Find Car Parts Near You
          </h1>
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-1 bg-white/50 rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="h-8"
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Search Filters */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Search parts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select value={selectedMake} onValueChange={setSelectedMake}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Makes</SelectItem>
                  {uniqueMakes.map(make => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Models</SelectItem>
                  {uniqueModels.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Max Price (GHS)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              <div className="text-sm text-gray-600 flex items-center">
                {filteredParts.length} parts found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <Card key={part.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {part.images && part.images.length > 0 && (
                    <img
                      src={part.images[0]}
                      alt={part.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{part.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {part.make} {part.model} ({part.year}) - {part.part_type}
                    </p>
                    
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary">{part.condition}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-orange-600">
                        {part.currency} {part.price}
                      </span>
                    </div>

                    {part.address && (
                      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {part.address}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleWhatsAppContact(part)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-300px)]">
            <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPartsWithMap;
