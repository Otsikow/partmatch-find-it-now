import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Car, ChevronDown, ChevronUp } from "lucide-react";
import { FilterSection } from "./FilterSection";
import { LogoProcessor } from "@/components/LogoProcessor";

interface MakeFilterProps {
  selectedMake: string;
  allMakes: string[];
  onChange: (make: string) => void;
}

// Get car logo with processed background removal support
const getCarLogo = (make: string, processedLogos: Record<string, string>): string | null => {
  const makeKey = make.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  // Return processed logo if available
  if (processedLogos[makeKey]) {
    return processedLogos[makeKey];
  }
  
  // Fallback to original logo mapping
  const logoMap: Record<string, string> = {
    // Asian brands
    'Toyota': `/car-logos/toyota.png?v=${Date.now()}`,
    'Honda': '/car-logos/honda.png',
    'Nissan': `/car-logos/nissan.png?v=${Date.now()}`,
    'Hyundai': '/car-logos/hyundai.png',
    'Kia': '/car-logos/kia.png',
    'Mazda': '/car-logos/mazda.png',
    'Mitsubishi': '/car-logos/mitsubishi.png',
    'Subaru': '/car-logos/subaru.png',
    'Suzuki': '/car-logos/suzuki.png',
    'Infiniti': '/car-logos/infiniti.png',
    'Lexus': '/car-logos/lexus.png',
    'Acura': '/car-logos/acura.png',
    'Genesis': '/car-logos/genesis.png',
    'Isuzu': '/car-logos/isuzu.png',
    'Daewoo': '/car-logos/daewoo.png',
    'SsangYong': '/car-logos/ssangyong.png',
    'Mahindra': '/car-logos/mahindra.png',
    'Tata': '/car-logos/tata.png',
    // European brands
    'BMW': `/car-logos/bmw.png?v=${Date.now()}`,
    'Mercedes-Benz': '/car-logos/mercedes-benz.png',
    'Audi': '/car-logos/audi.png',
    'Volkswagen': '/car-logos/volkswagen.png',
    'Porsche': '/car-logos/porsche.png',
    'Jaguar': '/car-logos/jaguar.png',
    'Land Rover': '/car-logos/land-rover.png',
    'Volvo': '/car-logos/volvo.png',
    'Peugeot': '/car-logos/peugeot.png',
    'Renault': `/car-logos/renault.png?v=${Date.now()}`,
    'Citroen': '/car-logos/citroen.png',
    'Skoda': '/car-logos/skoda.png',
    'Seat': '/car-logos/seat.png',
    'Fiat': '/car-logos/fiat.png',
    'Alfa Romeo': '/car-logos/alfa-romeo.png',
    'Lancia': '/car-logos/lancia.png',
    'Ferrari': '/car-logos/ferrari.png',
    'Lamborghini': '/car-logos/lamborghini.png',
    'Maserati': '/car-logos/maserati.png',
    'Bentley': '/car-logos/bentley.png',
    'Rolls-Royce': '/car-logos/rolls-royce.png',
    'Vauxhall': '/car-logos/vauxhall.png',
    'Opel': '/car-logos/opel.png',
    'Mini': '/car-logos/mini.png',
    'Smart': '/car-logos/smart.png',
    'Saab': '/car-logos/saab.png',
    'Dacia': '/car-logos/dacia.png',
    'Tesla': '/car-logos/tesla.png',
    // American brands
    'Ford': '/car-logos/ford.png',
    'Chevrolet': '/car-logos/chevrolet.png',
    'Cadillac': '/car-logos/cadillac.png',
    'GMC': '/car-logos/gmc.png',
    'Dodge': '/car-logos/dodge.png',
    'Chrysler': '/car-logos/chrysler.png',
    'Jeep': '/car-logos/jeep.png',
    'Ram': '/car-logos/ram.png',
    'Buick': '/car-logos/buick.png',
    'Lincoln': '/car-logos/lincoln.png'
  };
  return logoMap[make] || null;
};

// Group makes by region for better organization
const makeGroups = {
  Asian: ['Honda', 'Toyota', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Mitsubishi', 'Subaru', 'Suzuki', 'Infiniti', 'Lexus', 'Acura'],
  European: ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Jaguar', 'Land Rover', 'Volvo', 'Peugeot', 'Renault', 'Citroen', 'Skoda', 'Seat', 'Fiat', 'Alfa Romeo', 'Lancia', 'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce', 'Vauxhall', 'Opel'],
  American: ['Ford', 'Chevrolet', 'Cadillac', 'GMC', 'Dodge', 'Chrysler', 'Jeep', 'Ram', 'Buick', 'Lincoln'],
  Others: []
};

export const MakeFilter = ({ selectedMake, allMakes, onChange }: MakeFilterProps) => {
  const [showAllMakes, setShowAllMakes] = useState(false);
  const [processedLogos, setProcessedLogos] = useState<Record<string, string>>({});
  const [showProcessor, setShowProcessor] = useState(false);
  
  // Categorize makes into groups
  const categorizedMakes = { ...makeGroups, Others: [] };
  allMakes.forEach(make => {
    let assigned = false;
    Object.entries(makeGroups).forEach(([group, makes]) => {
      if (makes.includes(make)) {
        assigned = true;
      }
    });
    if (!assigned) {
      categorizedMakes.Others.push(make);
    }
  });

  // Show only popular makes initially, then all when expanded
  const popularMakes = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 
    'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Peugeot', 'Renault'
  ].filter(make => allMakes.includes(make));

  const displayMakes = showAllMakes ? allMakes : popularMakes;

  return (
    <FilterSection title="Make" icon={<Car className="h-4 w-4" />}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          <Button
            variant={selectedMake === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange('')}
            className={`text-xs sm:text-sm col-span-2 sm:col-span-1 transition-all duration-200 ${
              selectedMake === '' 
                ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
            }`}
          >
            All Makes
          </Button>
          {displayMakes.map(make => {
            const logo = getCarLogo(make, processedLogos);
            return (
              <Button
                key={make}
                variant={selectedMake === make ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange(make)}
                className={`text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                  selectedMake === make 
                    ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                    : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                {logo && (
                  <img
                    src={logo}
                    alt={`${make} logo`}
                    className="w-4 h-4 object-contain flex-shrink-0 filter drop-shadow-sm"
                    style={{ 
                      imageRendering: 'crisp-edges',
                      WebkitFontSmoothing: 'antialiased'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span className="truncate">{make}</span>
              </Button>
            );
          })}
        </div>
        
        {!showAllMakes && allMakes.length > popularMakes.length && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllMakes(true)}
            className="w-full text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Show More Makes ({allMakes.length - popularMakes.length} more)
          </Button>
        )}
        
        {showAllMakes && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllMakes(false)}
            className="w-full text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronUp className="h-4 w-4 mr-1" />
            Show Less
          </Button>
        )}
        
        {/* Professional Logo Processor */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowProcessor(!showProcessor)}
          className="w-full text-xs text-muted-foreground hover:text-foreground"
        >
          {showProcessor ? 'Hide' : 'Show'} Logo Processor
        </Button>
        
        {showProcessor && (
          <LogoProcessor 
            onProcessingComplete={(logos) => {
              setProcessedLogos(logos);
              setShowProcessor(false);
            }}
          />
        )}
      </div>
    </FilterSection>
  );
};