
import { useState } from "react";
import { useCarParts } from "@/hooks/useCarParts";
import SearchControls from "@/components/SearchControls";
import CarPartsList from "@/components/CarPartsList";
import PageHeader from "@/components/PageHeader";
import PendingRatingNotification from "@/components/PendingRatingNotification";

const SearchParts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    category: "",
    location: "",
    priceRange: [0, 10000] as [number, number],
  });

  const { parts, loading, error } = useCarParts({ searchTerm, filters });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader 
        title="Browse Parts"
        subtitle="Find your perfect car part"
        showBackButton={true}
        backTo="/"
      />
      
      <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <PendingRatingNotification />
        
        <div className="space-y-4 sm:space-y-6">
          <div className="mx-auto max-w-sm sm:max-w-none">
            <SearchControls
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
          
          <CarPartsList 
            parts={parts} 
            loading={loading} 
            error={error} 
          />
        </div>
      </main>
    </div>
  );
};

export default SearchParts;
