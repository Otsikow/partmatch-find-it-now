import { Button } from "@/components/ui/button";
import { Tag, Settings, Car, Zap, Wrench, Thermometer, Fuel, PaintBucket, Lightbulb, Armchair, Disc, Gauge, Camera, Square } from "lucide-react";
import { CAR_PART_CATEGORIES } from "@/constants/carPartCategories";
import { FilterSection } from "./FilterSection";

interface CategoryFilterProps {
  selectedCategory: string;
  onChange: (category: string) => void;
}

const categoryIcons: Record<string, any> = {
  'Body Panels & Bumpers': PaintBucket,
  'Brakes & Brake System': Disc,
  'Car Accessories': Camera,
  'Clutch & Gearbox': Settings,
  'Cooling System': Thermometer,
  'ECU & Sensors': Gauge,
  'Electrical & Ignition': Zap,
  'Engine & Transmission': Car,
  'Exhaust System': Wrench,
  'Fuel System': Fuel,
  'Interior Parts': Armchair,
  'Lighting': Lightbulb,
  'Mirrors & Glass': Square,
  'Suspension & Steering': Settings,
  'Wheels & Tyres': Disc
};

export const CategoryFilter = ({ selectedCategory, onChange }: CategoryFilterProps) => {
  const availableCategories = Array.from(CAR_PART_CATEGORIES);

  return (
    <FilterSection title="Category" icon={<Tag className="h-4 w-4" />}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('')}
          className={`text-xs sm:text-sm justify-start transition-all duration-200 ${
            selectedCategory === '' 
              ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
              : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
          }`}
        >
          <Tag className="h-3 w-3 mr-1.5" />
          All Categories
        </Button>
        {availableCategories.map(category => {
          const IconComponent = categoryIcons[category] || Tag;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(category)}
              className={`text-xs sm:text-sm justify-start transition-all duration-200 ${
                selectedCategory === category 
                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                  : "border-border hover:bg-accent hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              <IconComponent className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{category}</span>
            </Button>
          );
        })}
      </div>
    </FilterSection>
  );
};