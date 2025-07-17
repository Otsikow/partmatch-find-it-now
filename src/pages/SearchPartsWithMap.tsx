
import { useState, useEffect } from "react";
import { useCarParts } from "@/hooks/useCarParts";
import { useCountryDetection } from "@/hooks/useCountryDetection";
import SearchControls from "@/components/SearchControls";
import CarPartsList from "@/components/CarPartsList";
import PageHeader from "@/components/PageHeader";
import PendingRatingNotification from "@/components/PendingRatingNotification";

const SearchPartsWithMap = () => {
  const { country: userCountry } = useCountryDetection();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    category: "",
    location: "",
    country: "all", // Start with "all" by default
    priceRange: [0, 10000] as [number, number],
  });

  // Update country filter when user's country is detected
  useEffect(() => {
    if (userCountry && filters.country === "all") {
      setFilters(prev => ({ ...prev, country: userCountry.code }));
    }
  }, [userCountry, filters.country]);

  const {
    parts,
    loading: partsLoading,
    error: partsError,
  } = useCarParts({ searchTerm, filters });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <PageHeader
        title="Search Parts with Map"
        subtitle="Find car parts near you"
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
            loading={partsLoading}
            error={partsError}
          />
        </div>
      </main>
    </div>
  );
};

export default SearchPartsWithMap;
