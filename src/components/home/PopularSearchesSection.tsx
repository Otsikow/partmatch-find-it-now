import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Wrench, Lightbulb, Settings, Car, Cog, ShoppingCart } from "lucide-react";

const PopularSearchesSection = () => {
  const popularSearches = [
    { icon: Wrench, label: "Toyota Brake Pads", searchQuery: "toyota brake pads" },
    { icon: Lightbulb, label: "Honda Headlights", searchQuery: "honda headlights" },
    { icon: Settings, label: "Nissan Gearbox", searchQuery: "nissan gearbox" },
    { icon: Car, label: "BMW Bumpers", searchQuery: "bmw bumpers" },
    { icon: Cog, label: "Used Engines", searchQuery: "used engines" },
    { icon: ShoppingCart, label: "All Listings", searchQuery: "" }
  ];

  return (
    <div 
      className="py-16 relative overflow-hidden"
      style={{
        backgroundImage: "url('/car-parts-bg1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Professional overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Popular Searches
          </h2>
          <p className="text-xl text-muted-foreground">
            Find what you're looking for faster
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popularSearches.map((search, index) => (
            <Link
              key={index}
              to={search.searchQuery ? `/search-parts?q=${encodeURIComponent(search.searchQuery)}` : "/search-parts"}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 group-hover:scale-105 bg-card border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <search.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {search.label}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularSearchesSection;