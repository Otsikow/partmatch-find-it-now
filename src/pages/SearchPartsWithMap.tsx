import { useState } from "react";
import { useCarParts } from "@/hooks/useCarParts";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import SearchControls from "@/components/SearchControls";
import CarPartsList from "@/components/CarPartsList";
import PageHeader from "@/components/PageHeader";
import PendingRatingNotification from "@/components/PendingRatingNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

// Define the filters interface to match what SearchControls expects
interface FilterState {
  make: string;
  model: string;
  year: string;
  category: string;
  location: string;
  priceRange: [number, number];
  maxDistance?: number;
}

const SearchPartsWithMap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    make: "",
    model: "",
    year: "",
    category: "",
    location: "",
    priceRange: [0, 10000] as [number, number],
    maxDistance: 300 // Default to 300 miles
  });

  const {
    requestLocation,
    location,
    loading: locationLoading,
    error: locationError,
    permission
  } = useLocationDetection({
    enableHighAccuracy: true,
    includeAddress: true
  });

  const { parts, loading, error } = useCarParts({ 
    searchTerm, 
    filters,
    userLocation: location
  });

  const handleLocationRequest = async () => {
    await requestLocation();
  };
  
  // Custom handler to ensure type compatibility
  const handleFiltersChange = (newFilters: FilterState) => {
    console.log('New filters:', newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <PageHeader 
        title="Browse Parts with Map"
        subtitle="Find parts near you with location directions"
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8">
        <PendingRatingNotification />
        
        <div className="mb-6">
          <Button 
            onClick={handleLocationRequest}
            disabled={locationLoading}
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {locationLoading ? "Getting location..." : "📍 Use My Location"}
          </Button>
          
          {locationError && (
            <div className="mt-2">
              <p className="text-sm text-destructive mb-2">{locationError}</p>
              {/* Manual location input form appears when location is denied */}
              {permission === 'denied' && (
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    placeholder="Enter your city or location"
                    onChange={(e) => {
                      const location = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        location
                      }));
                    }}
                    className="flex-1"
                  />
                </div>
              )}
            </div>
          )}
          
          {location && (
            <p className="mt-2 text-sm text-muted-foreground">
              Showing results near {location.city || location.address}
            </p>
          )}
        </div>
        
        <SearchControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          showLocationFilters={true}
        />
        
        <div className="mt-6">
          <CarPartsList 
            parts={parts} 
            loading={loading} 
            error={error}
            userLocation={location}
          />
        </div>
      </main>
    </div>
  );
};

export default SearchPartsWithMap;