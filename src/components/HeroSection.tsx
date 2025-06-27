
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-yellow-500/10 to-green-600/10">
        <img 
          src="/lovable-uploads/51b54b15-6e34-4aaf-a27e-c96742783d07.png" 
          alt="PartMatch Background" 
          className="w-full h-full object-cover opacity-5 mix-blend-multiply"
          loading="lazy"
        />
      </div>
      
      <div className="relative container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="mb-4 flex justify-center relative -mt-4">
            <div className="relative">
              <img 
                src="/lovable-uploads/51b54b15-6e34-4aaf-a27e-c96742783d07.png" 
                alt="PartMatch - Car Parts Marketplace" 
                className="max-w-2xl w-full h-auto object-contain opacity-80 mix-blend-multiply filter saturate-110"
                loading="lazy"
                style={{ 
                  backgroundColor: 'transparent',
                  background: 'transparent'
                }}
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent mb-6">
            Ghana's Premier Car Parts Marketplace
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
            Connect with trusted suppliers across Ghana. Find the exact car parts you need or list your inventory to reach thousands of customers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link to="/request" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-gradient-to-r from-red-600 to-green-700 hover:from-red-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Search className="mr-2 h-5 w-5" />
                Find Parts
              </Button>
            </Link>
            
            <Link to="/search-map" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300">
                <MapPin className="mr-2 h-5 w-5" />
                Browse with Map
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
