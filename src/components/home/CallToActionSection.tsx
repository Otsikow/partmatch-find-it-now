import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";

const CallToActionSection = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-primary via-secondary to-accent text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Got a Part to Sell?
            </h2>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            List it in 2 minutes – It's FREE!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 font-semibold"
            >
              <Link to="/post-part">
                <Package className="mr-2 h-5 w-5" />
                Post Your Part
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary"
            >
              <Link to="/seller-auth">
                Join as Seller
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
            <div>
              <strong>✓ No listing fees</strong>
              <p>Post unlimited parts for free</p>
            </div>
            <div>
              <strong>✓ Reach thousands</strong>
              <p>Connect with buyers across Ghana</p>
            </div>
            <div>
              <strong>✓ Secure payments</strong>
              <p>Safe and reliable transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;