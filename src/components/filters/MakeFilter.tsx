import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, ChevronDown, ChevronUp } from "lucide-react";
import { FilterSection } from "./FilterSection";

interface MakeFilterProps {
  selectedMake: string;
  allMakes: string[];
  onChange: (make: string) => void;
}

// Group makes by region for better organization
const makeGroups = {
  Asian: ['Honda', 'Toyota', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Mitsubishi', 'Subaru', 'Suzuki', 'Infiniti', 'Lexus', 'Acura'],
  European: ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Jaguar', 'Land Rover', 'Volvo', 'Peugeot', 'Renault', 'Citroen', 'Skoda', 'Seat', 'Fiat', 'Alfa Romeo', 'Lancia', 'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce', 'Vauxhall', 'Opel'],
  American: ['Ford', 'Chevrolet', 'Cadillac', 'GMC', 'Dodge', 'Chrysler', 'Jeep', 'Ram', 'Buick', 'Lincoln'],
  Others: []
};

export const MakeFilter = ({ selectedMake, allMakes, onChange }: MakeFilterProps) => {
  const [showAllMakes, setShowAllMakes] = useState(false);
  
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
          {displayMakes.map(make => (
            <Button
              key={make}
              variant={selectedMake === make ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(make)}
              className={`text-xs sm:text-sm transition-all duration-200 ${
                selectedMake === make 
                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                  : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              {make}
            </Button>
          ))}
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
      </div>
    </FilterSection>
  );
};