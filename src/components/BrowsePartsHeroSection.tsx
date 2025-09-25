import { Search, Filter, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BrowsePartsHeroSectionProps {
  onQuickSearch?: (term: string) => void;
}

const BrowsePartsHeroSection = ({ onQuickSearch }: BrowsePartsHeroSectionProps) => {
  const handleQuickSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;
    if (onQuickSearch && searchTerm.trim()) {
      onQuickSearch(searchTerm.trim());
    }
  };

  return (
    <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Hero Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/brake-hero-image.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
              Browse Premium Car Parts
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover high-quality automotive parts from verified sellers. Find exactly what you need with our advanced search and filtering system.
            </p>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleQuickSearch} className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground z-10" />
              <Input
                name="search"
                placeholder="Search for brake pads, engine parts, suspension..."
                className="pl-12 pr-24 h-14 text-lg bg-card/90 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 shadow-lg"
              />
              <Button 
                type="submit"
                size="lg" 
                className="absolute right-2 h-10 px-6 bg-primary hover:bg-primary/90 shadow-md"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-medium">10,000+ Parts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-medium">Advanced Filters</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4 text-primary" />
              <span className="font-medium">Smart Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePartsHeroSection;