
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import * as RadixSlider from '@radix-ui/react-slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockParts } from "@/data/mockParts";
import { getUniqueMakes, getUniqueModels, getUniqueYears } from "@/utils/partFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, DollarSign, Settings, Filter } from "lucide-react";

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
    condition: string;
    locationRadius: number;
  };
  onFiltersChange: (filters: {
    make: string;
    model: string;
    year: string;
    category: string;
    location: string;
    priceRange: [number, number];
    condition: string;
    locationRadius: number;
  }) => void;
}

// Custom Price Range Slider Component
const PriceRangeSlider = ({ priceRange, onPriceChange }: { priceRange: [number, number]; onPriceChange: (value: [number, number]) => void }) => {
  const MIN_PRICE = 0;
  const MAX_PRICE = 50000;

  // Handle slider value changes
  const handleSliderChange = (value: number[]) => {
    onPriceChange(value as [number, number]);
  };

  // Handle input changes
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(MIN_PRICE, Math.min(parseInt(e.target.value) || 0, priceRange[1]));
    const newRange: [number, number] = [value, priceRange[1]];
    onPriceChange(newRange);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(MAX_PRICE, Math.max(parseInt(e.target.value) || 0, priceRange[0]));
    const newRange: [number, number] = [priceRange[0], value];
    onPriceChange(newRange);
  };

  return (
    <div className="space-y-4">
      {/* Price Range Display */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Price Range: GHS {priceRange[0].toLocaleString()} - GHS {priceRange[1].toLocaleString()}</span>
      </div>

      {/* Slider Component */}
      <RadixSlider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={priceRange}
        onValueChange={handleSliderChange}
        max={MAX_PRICE}
        min={MIN_PRICE}
        step={1000}
      >
        <RadixSlider.Track className="slider-track bg-muted relative grow rounded-full h-2">
          <RadixSlider.Range className="slider-range absolute bg-primary rounded-full h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="slider-thumb block w-5 h-5 bg-primary shadow-lg rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer" />
        <RadixSlider.Thumb className="slider-thumb block w-5 h-5 bg-primary shadow-lg rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer" />
      </RadixSlider.Root>

      {/* Input Fields */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Min Price</label>
          <Input
            type="number"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-full"
            placeholder="0"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Max Price</label>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-full"
            placeholder="50000"
          />
        </div>
      </div>
    </div>
  );
};

// Custom Location Radius Slider Component
const LocationRadiusSlider = ({ 
  location, 
  radius, 
  onLocationChange, 
  onRadiusChange 
}: { 
  location: string; 
  radius: number; 
  onLocationChange: (location: string) => void; 
  onRadiusChange: (radius: number) => void; 
}) => {
  const MIN_RADIUS = 5;
  const MAX_RADIUS = 500;

  const handleRadiusChange = (value: number[]) => {
    onRadiusChange(value[0]);
  };

  const getRadiusLabel = (radius: number) => {
    if (radius < 25) return 'Local';
    if (radius < 100) return 'Regional';
    return 'Nationwide';
  };

  return (
    <div className="space-y-4">
      {/* Location Input */}
      <div>
        <Input
          placeholder="Enter location (e.g., Accra, Kumasi)"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full text-sm sm:text-base"
        />
      </div>

      {/* Radius Display and Badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Search radius: {radius} km</span>
        <Badge variant="outline" className="text-xs font-medium">
          {getRadiusLabel(radius)}
        </Badge>
      </div>

      {/* Slider Component */}
      <RadixSlider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[radius]}
        onValueChange={handleRadiusChange}
        max={MAX_RADIUS}
        min={MIN_RADIUS}
        step={5}
      >
        <RadixSlider.Track className="slider-track bg-muted relative grow rounded-full h-2">
          <RadixSlider.Range className="slider-range absolute bg-primary rounded-full h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="slider-thumb block w-5 h-5 bg-primary shadow-lg rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer" />
      </RadixSlider.Root>

      {/* Range Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{MIN_RADIUS} km</span>
        <span>{MAX_RADIUS} km</span>
      </div>
    </div>
  );
};

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

  const buttonSize = isMobile ? "sm" : "sm";
  
  return (  
    <Card className="p-2 sm:p-4 md:p-6 mb-4 sm:mb-6 bg-gradient-to-br from-card/90 to-muted/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Input
            placeholder="Search parts (e.g. alternator, brake pads)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full border-border focus:border-primary focus:ring-primary/20 ${isMobile ? 'h-11 text-sm px-3' : 'h-10 text-sm'}`}
          />
        </div>
        
        {/* Make Filter */}
        <div>
          <p className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Make</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5 sm:gap-2 max-h-32 sm:max-h-40 overflow-y-auto">
            <Button
              variant={filters.make === '' ? 'default' : 'outline'}
              size={buttonSize}
              onClick={() => handleMakeChange('')}
              className={`text-xs sm:text-sm ${filters.make === '' ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
            >
              All Makes
            </Button>
            {allMakes.map(make => (
              <Button
                key={make}
                variant={filters.make === make ? 'default' : 'outline'}
                size={buttonSize}
                onClick={() => handleMakeChange(make)}
                className={`text-xs sm:text-sm ${filters.make === make ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
              >
                {make}
              </Button>
            ))}
          </div>
        </div>

        {/* Model Filter */}
        {filters.make && (
          <div>
            <p className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Model</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5 sm:gap-2">
              <Button
                variant={filters.model === '' ? 'default' : 'outline'}
                size={buttonSize}
                onClick={() => handleModelChange('')}
                className={`text-xs sm:text-sm ${filters.model === '' ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
              >
                All Models
              </Button>
              {uniqueModels.map(model => (
                <Button
                  key={model}
                  variant={filters.model === model ? 'default' : 'outline'}
                  size={buttonSize}
                  onClick={() => handleModelChange(model)}
                  className={`text-xs sm:text-sm ${filters.model === model ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
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
            <p className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Year</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 sm:gap-2">
              <Button
                variant={filters.year === '' ? 'default' : 'outline'}
                size={buttonSize}
                onClick={() => handleYearChange('')}
                className={`text-xs sm:text-sm ${filters.year === '' ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
              >
                All Years
              </Button>
              {uniqueYears.map(year => (
                <Button
                  key={year}
                  variant={filters.year === year ? 'default' : 'outline'}
                  size={buttonSize}
                  onClick={() => handleYearChange(year)}
                  className={`text-xs sm:text-sm ${filters.year === year ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <DollarSign className="w-4 h-4 text-primary" />
            <p className="text-xs sm:text-sm font-semibold text-foreground">Price Range</p>
          </div>
          <div className="px-2">
            <PriceRangeSlider
              priceRange={filters.priceRange}
              onPriceChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
            />
          </div>
        </div>

        {/* Part Condition Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Settings className="w-4 h-4 text-primary" />
            <p className="text-xs sm:text-sm font-semibold text-foreground">Condition</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {['', 'New', 'Used', 'Refurbished'].map((cond) => (
              <Button
                key={cond || 'all'}
                variant={filters.condition === cond ? 'default' : 'outline'}
                size={buttonSize}
                onClick={() => onFiltersChange({ ...filters, condition: cond })}
                className={`text-xs sm:text-sm ${filters.condition === cond ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" : "border-border hover:bg-accent hover:border-primary/30"}`}
              >
                {cond || 'All Conditions'}
              </Button>
            ))}
          </div>
        </div>

        {/* Category/Part Type Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Filter className="w-4 h-4 text-primary" />
            <p className="text-xs sm:text-sm font-semibold text-foreground">Category</p>
          </div>
          <Select value={filters.category || "all"} onValueChange={(value) => onFiltersChange({ ...filters, category: value === "all" ? "" : value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Engine">Engine Parts</SelectItem>
              <SelectItem value="Brake">Brake System</SelectItem>
              <SelectItem value="Suspension">Suspension</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Body">Body Parts</SelectItem>
              <SelectItem value="Interior">Interior</SelectItem>
              <SelectItem value="Transmission">Transmission</SelectItem>
              <SelectItem value="Exhaust">Exhaust System</SelectItem>
              <SelectItem value="Cooling">Cooling System</SelectItem>
              <SelectItem value="Fuel">Fuel System</SelectItem>
              <SelectItem value="Lighting">Lighting</SelectItem>
              <SelectItem value="Tires">Tires & Wheels</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <p className="text-xs sm:text-sm font-semibold text-foreground">Location & Radius</p>
          </div>
          <div className="px-2">
            <LocationRadiusSlider
              location={filters.location}
              radius={filters.locationRadius}
              onLocationChange={(location) => onFiltersChange({ ...filters, location })}
              onRadiusChange={(radius) => onFiltersChange({ ...filters, locationRadius: radius })}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onFiltersChange({
              make: "",
              model: "",
              year: "",
              category: "",
              location: "",
              priceRange: [0, 10000],
              condition: "",
              locationRadius: 50,
            })}
            className="w-full text-sm"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchControls;
