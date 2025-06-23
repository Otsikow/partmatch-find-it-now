
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  uniqueMakes: string[];
}

const SearchControls = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedMake, 
  setSelectedMake, 
  uniqueMakes 
}: SearchControlsProps) => {
  return (
    <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Search parts (e.g. alternator, brake pads)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base sm:text-lg border-emerald-200 focus:border-emerald-400"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedMake === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMake('')}
            className={selectedMake === '' ? "bg-gradient-to-r from-emerald-600 to-green-700 text-base" : "text-base border-emerald-200 hover:bg-emerald-50"}
          >
            All Makes
          </Button>
          {uniqueMakes.map(make => (
            <Button
              key={make}
              variant={selectedMake === make ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMake(make)}
              className={selectedMake === make ? "bg-gradient-to-r from-emerald-600 to-green-700 text-base" : "text-base border-emerald-200 hover:bg-emerald-50"}
            >
              {make}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SearchControls;
