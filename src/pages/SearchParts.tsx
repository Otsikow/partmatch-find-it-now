
import { useState } from "react";
import { useCarParts } from "@/hooks/useCarParts";
import SearchControls from "@/components/SearchControls";
import CarPartsList from "@/components/CarPartsList";
import PageHeader from "@/components/PageHeader";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <PageHeader 
        title="Browse Car Parts"
        subtitle="Find the perfect part for your vehicle"
        backTo="/"
      />
      
      <main className="container mx-auto px-4 py-8">
        <SearchControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <CarPartsList 
          parts={parts} 
          loading={loading} 
          error={error} 
        />
      </main>
    </div>
  );
};

export default SearchParts;
