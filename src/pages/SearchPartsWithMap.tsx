
import { useState } from "react";
import { useCarParts } from "@/hooks/useCarParts";
import SearchControls from "@/components/SearchControls";
import CarPartsList from "@/components/CarPartsList";
import PageHeader from "@/components/PageHeader";

const SearchPartsWithMap = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <PageHeader 
        title="Browse Parts with Map"
        subtitle="Find parts near you with location directions"
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8">
        <SearchControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <div className="mt-6">
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

export default SearchPartsWithMap;
