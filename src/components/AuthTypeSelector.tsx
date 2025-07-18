
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ShoppingCart, Store, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AuthTypeSelector = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 font-inter">
      <header className="relative bg-gradient-to-r from-primary via-primary/95 to-primary-foreground text-white shadow-lg border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-indigo-600/10"></div>
        <div className="relative p-4 sm:p-6 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/20 text-white hover:text-white">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <img 
                src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
                alt="PartMatch Logo" 
                className="h-6 w-auto sm:h-8 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight break-words">
                Choose Your Account Type
              </h1>
              <p className="text-sm sm:text-base text-white/90 leading-tight break-words mt-1">
                Select how you want to join our marketplace
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="page-header text-2xl sm:text-3xl lg:text-4xl mb-4 text-foreground">
            How would you like to join?
          </h2>
          <p className="section-subtitle text-lg sm:text-xl max-w-2xl mx-auto mb-4">
            Select the type of account that best describes your role in our car parts marketplace
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Whether you're looking to buy car parts or sell them, we have the perfect account type for your needs. Choose below to get started with your personalized experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <Link to="/buyer-auth" className="block group">
            <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-card to-accent/10 hover:from-card hover:to-accent/20 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-primary/20 group-hover:border-primary/40">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="section-title text-xl sm:text-2xl mb-3 text-blue-800">
                Buyer
              </h3>
              <p className="card-description text-sm sm:text-base mb-6">
                Find and purchase car parts from verified sellers
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white ui-button-text py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm leading-tight mb-6">
                Sign In / Register as Buyer
              </Button>
              <div className="bg-primary/10 rounded-lg p-4 text-sm text-primary font-medium">
                ✓ Browse available parts<br/>
                ✓ Request specific parts<br/>
                ✓ Connect with sellers<br/>
                ✓ Secure payments
              </div>
            </Card>
          </Link>

          <Link to="/seller-auth" className="block group">
            <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-card to-destructive/10 hover:from-card hover:to-destructive/20 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-destructive/20 group-hover:border-destructive/40">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Store className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="section-title text-xl sm:text-2xl mb-3 text-foreground">
                Seller
              </h3>
              <p className="card-description text-sm sm:text-base mb-6">
                Sell and supply car parts to buyers
              </p>
              <Button className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white ui-button-text py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm leading-tight mb-6">
                Sign In / Register as Seller
              </Button>
              <div className="bg-destructive/10 rounded-lg p-4 text-sm text-destructive font-medium">
                ✓ List your inventory<br/>
                ✓ Respond to requests<br/>
                ✓ Manage offers<br/>
                ✓ Grow your business
              </div>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="body-text-small text-sm sm:text-base">
            Already have an account? Use the specific login page for your account type above.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthTypeSelector;
