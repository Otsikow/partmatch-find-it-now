import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";

const CallToActionSection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="w-16 h-16 mr-4 text-white" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Got a Part to Sell?
            </h2>
          </div>
          
          <p className="text-2xl md:text-3xl mb-12 text-white/90 font-medium">
            List it in 2 minutes – It's FREE!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto mb-16">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 dark:bg-white dark:text-primary dark:hover:bg-white/90 font-semibold text-lg px-8 py-4 h-auto shadow-lg"
            >
              <Link to="/post-part">
                <Package className="mr-2 h-6 w-6" />
                Post Your Part
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto bg-white/20 border-2 border-white text-white hover:bg-white hover:text-primary dark:bg-white/10 dark:border-white/50 dark:text-white dark:hover:bg-white dark:hover:text-primary font-semibold text-lg px-8 py-4 h-auto backdrop-blur-sm"
            >
              <Link to="/seller-auth">
                Join as Seller
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
              <div className="text-white font-semibold text-lg mb-2">✓ No listing fees</div>
              <p className="text-white/80 dark:text-white/70">Post unlimited parts for free</p>
            </div>
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
              <div className="text-white font-semibold text-lg mb-2">✓ Reach thousands</div>
              <p className="text-white/80 dark:text-white/70">Connect with buyers in your region</p>
            </div>
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
              <div className="text-white font-semibold text-lg mb-2">✓ Secure payments</div>
              <p className="text-white/80 dark:text-white/70">Safe and reliable transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;