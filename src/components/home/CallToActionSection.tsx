import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";

const CallToActionSection = () => {
  return (
    <div 
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: "url('/car-parts-bg3.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/85 to-background/80 dark:from-background/90 dark:via-background/85 dark:to-background/90"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="w-16 h-16 mr-4 text-foreground drop-shadow-lg" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-lg">
              Got a Part to Sell?
            </h2>
          </div>
          
          <p className="text-2xl md:text-3xl mb-12 text-muted-foreground font-medium drop-shadow-md">
            List it in 2 minutes – It's FREE!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto mb-16">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-4 h-auto shadow-lg"
            >
              <Link to="/post-part">
                <Package className="mr-2 h-6 w-6" />
                Post Your Part
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 py-4 h-auto"
            >
              <Link to="/seller-auth">
                Join as Seller
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 border border-border">
              <div className="text-foreground font-semibold text-lg mb-2">✓ No listing fees</div>
              <p className="text-muted-foreground">Post unlimited parts for free</p>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 border border-border">
              <div className="text-foreground font-semibold text-lg mb-2">✓ Reach thousands</div>
              <p className="text-muted-foreground">Connect with buyers in your region</p>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 border border-border">
              <div className="text-foreground font-semibold text-lg mb-2">✓ Secure payments</div>
              <p className="text-muted-foreground">Safe and reliable transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;