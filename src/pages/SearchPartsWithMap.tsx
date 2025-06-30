
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
        subtitle="Find parts near you with our interactive map"
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8">
        <SearchControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-600">Map integration coming soon...</p>
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

export default SearchPartsWithMap;
