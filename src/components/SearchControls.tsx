
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockParts } from "@/data/mockParts";
import { getUniqueMakes, getUniqueModels, getUniqueYears } from "@/utils/partFilters";
import { useIsMobile } from "@/hooks/use-mobile";

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
  };
  onFiltersChange: (filters: {
    make: string;
    model: string;
    year: string;
    category: string;
    location: string;
    priceRange: [number, number];
  }) => void;
}

const SearchControls = ({ 
  searchTerm, 
  onSearchChange, 
  filters,
  onFiltersChange
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

  const buttonSize = isMobile ? "mobile-sm" : "sm";
  const buttonSpacing = isMobile ? "gap-2" : "gap-1 sm:gap-2";

  return (  
    <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 bg-gradient-to-br from-card/90 to-muted/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Input
            placeholder="Search parts (e.g. alternator, brake pads)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full border-border focus:border-primary focus:ring-primary/20 ${isMobile ? 'h-12 text-base' : 'text-sm'}`}
          />
        </div>
        
        {/* Make Filter */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2 sm:mb-3">Make</p>
          <div className={`flex ${buttonSpacing} flex-wrap ${isMobile ? 'max-h-32' : 'max-h-24 sm:max-h-32'} overflow-y-auto`}>
            <Button
              variant={filters.make === '' ? 'default' : 'outline'}
              size={buttonSize}
              onClick={() => handleMakeChange('')}
              className={`flex-shrink-0 ${filters.make === '' ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
            >
              All Makes
            </Button>
            {allMakes.map(make => (
              <Button
                key={make}
                variant={filters.make === make ? 'default' : 'outline'}
                size={buttonSize}
                onClick={() => handleMakeChange(make)}
                className={`flex-shrink-0 ${filters.make === make ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
              >
                {make}
              </Button>
            ))}
          </div>
        </div>

        {/* Model Filter */}
        {filters.make && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-2 sm:mb-3">Model</p>
            <div className={`flex ${buttonSpacing} flex-wrap`}>
              <Button
                variant={filters.model === '' ? 'default' : 'outline'}
                size={buttonSize}
                onClick={() => handleModelChange('')}
                className={`flex-shrink-0 ${filters.model === '' ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
              >
                All Models
              </Button>
              {uniqueModels.map(model => (
                <Button
                  key={model}
                  variant={filters.model === model ? 'default' : 'outline'}
                  size={buttonSize}
                  onClick={() => handleModelChange(model)}
                  className={`flex-shrink-0 ${filters.model === model ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
                >
                  {model}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Year Filter */}
        {filters.make && filters.model && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-2 sm:mb-3">Year</p>
            <div className={`flex ${buttonSpacing} flex-wrap`}>
              <Button
                variant={filters.year === '' ? 'default' : 'outline'}
                size={buttonSize}
                onClick={() => handleYearChange('')}
                className={`flex-shrink-0 ${filters.year === '' ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
              >
                All Years
              </Button>
              {uniqueYears.map(year => (
                <Button
                  key={year}
                  variant={filters.year === year ? 'default' : 'outline'}
                  size={buttonSize}
                  onClick={() => handleYearChange(year)}
                  className={`flex-shrink-0 ${filters.year === year ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SearchControls;
