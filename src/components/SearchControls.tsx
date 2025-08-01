
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockParts } from "@/data/mockParts";
import { getUniqueMakes, getUniqueModels, getUniqueYears } from "@/utils/partFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { RotateCcw, Search } from "lucide-react";
import { DistanceFilter } from "./filters/DistanceFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { MakeFilter } from "./filters/MakeFilter";
import { ModelYearFilters } from "./filters/ModelYearFilters";

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    make: string;
    model: string;
    year: string;
    category: string;
    location: string;
    priceRange: [number, number];
    maxDistance?: number;
  };
  onFiltersChange: (filters: {
    make: string;
    model: string;
    year: string;
    category: string;
    location: string;
    priceRange: [number, number];
    maxDistance?: number;
  }) => void;
  showLocationFilters?: boolean;
}

const SearchControls = ({ 
  searchTerm, 
  onSearchChange, 
  filters,
  onFiltersChange,
  showLocationFilters = false
}: SearchControlsProps) => {
  const isMobile = useIsMobile();
  
  // Popular car brands in Ghana
  const popularMakesInGhana = [
    'Acura', 'Alfa Romeo', 'Audi', 'Bentley', 'BMW', 'Buick', 'BYD', 
    'Cadillac', 'Chevrolet', 'Chery', 'Chrysler', 'Citroen', 'Dacia', 
    'Dodge', 'DS', 'Ferrari', 'Fiat', 'Ford', 'Geely', 'GMC', 
    'Great Wall', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 
    'Kia', 'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 
    'Lincoln', 'Mahindra', 'Maruti', 'Maserati', 'Mazda', 'Mercedes-Benz', 
    'MG', 'Mitsubishi', 'Nissan', 'Opel', 'Perodua', 'Peugeot', 
    'Porsche', 'Proton', 'Ram', 'Renault', 'Rolls-Royce', 'Seat', 
    'Skoda', 'Subaru', 'Suzuki', 'Tata', 'Toyota', 'Vauxhall', 
    'Volkswagen', 'Volvo'
  ];

  const uniqueMakes = getUniqueMakes(mockParts);
  const uniqueModels = getUniqueModels(mockParts, filters.make);
  const uniqueYears = getUniqueYears(mockParts, filters.make, filters.model);

  // Combine database makes with popular makes, removing duplicates and sorting alphabetically
  const allMakes = Array.from(new Set([...uniqueMakes, ...popularMakesInGhana])).sort();

  const handleMakeChange = (make: string) => {
    onFiltersChange({
      ...filters,
      make,
      model: '', // Reset model when make changes
      year: '' // Reset year when make changes
    });
  };

  const handleModelChange = (model: string) => {
    onFiltersChange({
      ...filters,
      model,
      year: '' // Reset year when model changes
    });
  };

  const handleYearChange = (year: string) => {
    onFiltersChange({
      ...filters,
      year
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category
    });
  };

  const handleDistanceChange = (distance: number) => {
    onFiltersChange({
      ...filters,
      maxDistance: distance
    });
  };

  const handleResetFilters = () => {
    onSearchChange('');
    onFiltersChange({
      make: '',
      model: '',
      year: '',
      category: '',
      location: '',
      priceRange: [0, 10000],
      maxDistance: undefined
    });
  };

  const hasActiveFilters = searchTerm || filters.make || filters.model || filters.year || 
    filters.category || filters.maxDistance || filters.priceRange[0] > 0 || filters.priceRange[1] < 10000;
  
  return (  
    <div className="space-y-4 mb-4 sm:mb-6">
      {/* Sticky Search Bar */}
      <Card className="sticky top-0 z-10 p-4 bg-gradient-to-br from-card/95 to-muted/50 backdrop-blur-md shadow-lg border-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parts (e.g. alternator, brake pads)"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full border-border focus:border-primary focus:ring-primary/20 h-11 text-sm"
            />
          </div>
          
          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="flex items-center gap-2 text-xs sm:text-sm border-border hover:bg-accent hover:border-primary/30 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* Filter Sections */}
      <div className="space-y-4">
        {/* Distance Filter - Only show if showLocationFilters is true */}
        {showLocationFilters && (
          <DistanceFilter
            maxDistance={filters.maxDistance}
            onChange={handleDistanceChange}
          />
        )}
        
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={filters.category}
          onChange={handleCategoryChange}
        />

        {/* Make Filter */}
        <MakeFilter
          selectedMake={filters.make}
          allMakes={allMakes}
          onChange={handleMakeChange}
        />

        {/* Model and Year Filters */}
        <ModelYearFilters
          selectedMake={filters.make}
          selectedModel={filters.model}
          selectedYear={filters.year}
          uniqueModels={uniqueModels}
          uniqueYears={uniqueYears}
          onModelChange={handleModelChange}
          onYearChange={handleYearChange}
        />
      </div>
    </div>
  );
};

export default SearchControls;
