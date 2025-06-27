
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockParts } from "@/data/mockParts";
import { getUniqueMakes, getUniqueModels, getUniqueYears } from "@/utils/partFilters";

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

const SearchControls = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedMake, 
  setSelectedMake, 
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear
}: SearchControlsProps) => {
  // Popular car brands in Ghana
  const popularMakesInGhana = [
    'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Ford', 'Chevrolet',
    'Volkswagen', 'Mercedes-Benz', 'BMW', 'Audi', 'Peugeot', 'Renault',
    'Mazda', 'Mitsubishi', 'Suzuki', 'Subaru', 'Lexus', 'Acura', 'Infiniti',
    'Land Rover', 'Jeep', 'Volvo', 'Jaguar', 'Porsche', 'Bentley',
    'Rolls-Royce', 'Ferrari', 'Lamborghini', 'Maserati', 'Cadillac',
    'Lincoln', 'Buick', 'GMC', 'Dodge', 'Chrysler', 'Ram', 'Fiat',
    'Alfa Romeo', 'Lancia', 'Skoda', 'Seat', 'Opel', 'Vauxhall',
    'Citroen', 'DS', 'Dacia', 'Lada', 'Tata', 'Mahindra', 'Maruti',
    'Great Wall', 'Chery', 'BYD', 'Geely', 'MG', 'Proton', 'Perodua'
  ];

  const uniqueMakes = getUniqueMakes(mockParts);
  const uniqueModels = getUniqueModels(  mockParts, selectedMake);
  const uniqueYears = getUniqueYears(mockParts, selectedMake, selectedModel);

  // Combine database makes with popular makes, removing duplicates and sorting
  const allMakes = Array.from(new Set([...uniqueMakes, ...popularMakesInGhana])).sort();

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel(''); // Reset model when make changes
    setSelectedYear(''); // Reset year when make changes
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedYear(''); // Reset year when model changes
  };

  return (
    <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Input
            placeholder="Search parts (e.g. alternator, brake pads)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm sm:text-base md:text-lg border-emerald-200 focus:border-emerald-400"
          />
        </div>
        
        {/* Make Filter */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Make</p>
          <div className="flex gap-1 sm:gap-2 flex-wrap max-h-32 overflow-y-auto">
            <Button
              variant={selectedMake === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleMakeChange('')}
              className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 flex-shrink-0 ${selectedMake === '' ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
            >
              All Makes
            </Button>
            {allMakes.map(make => (
              <Button
                key={make}
                variant={selectedMake === make ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMakeChange(make)}
                className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 flex-shrink-0 ${selectedMake === make ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
              >
                {make}
              </Button>
            ))}
          </div>
        </div>

        {/* Model Filter */}
        {selectedMake && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Model</p>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <Button
                variant={selectedModel === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleModelChange('')}
                className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 ${selectedModel === '' ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
              >
                All Models
              </Button>
              {uniqueModels.map(model => (
                <Button
                  key={model}
                  variant={selectedModel === model ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModelChange(model)}
                  className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 ${selectedModel === model ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
                >
                  {model}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Year Filter */}
        {selectedMake && selectedModel && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Year</p>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <Button
                variant={selectedYear === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedYear('')}
                className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 ${selectedYear === '' ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
              >
                All Years
              </Button>
              {uniqueYears.map(year => (
                <Button
                  key={year}
                  variant={selectedYear === year ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                  className={`text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 ${selectedYear === year ? "bg-gradient-to-r from-emerald-600 to-green-700" : "border-emerald-200 hover:bg-emerald-50"}`}
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
