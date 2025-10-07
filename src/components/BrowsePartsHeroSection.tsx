import { Search, Filter, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface BrowsePartsHeroSectionProps {
  onQuickSearch?: (term: string) => void;
}

const BrowsePartsHeroSection = ({ onQuickSearch }: BrowsePartsHeroSectionProps) => {
  const navigate = useNavigate();
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
      <img 
        src="/brake-hero-image.png" 
        alt="Browse car parts"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
      
      {/* Back Arrow */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-20 p-2 hover:bg-white/20 rounded-full text-white hover:text-white flex-shrink-0 bg-white/10 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair text-white drop-shadow-lg">
              Browse Premium Car Parts
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Discover high-quality automotive parts from verified sellers. Find exactly what you need with our advanced search and filtering system.
            </p>
          </div>
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Package className="h-4 w-4 text-white" />
              <span className="font-medium">10,000+ Parts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Filter className="h-4 w-4 text-white" />
              <span className="font-medium">Advanced Filters</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Search className="h-4 w-4 text-white" />
              <span className="font-medium">Smart Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePartsHeroSection;