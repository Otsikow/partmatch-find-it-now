
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ShoppingCart, Store, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AuthTypeSelector = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-inter">
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-gray-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="PartMatch Logo" 
            className="h-6 w-auto sm:h-8"
          />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-gray-700 to-blue-700 bg-clip-text text-transparent">
            Choose Your Account Type
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold mb-4 text-gray-800">
            How would you like to join PartMatch Ghana?
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl font-crimson max-w-2xl mx-auto">
            Select the type of account that best describes your role in our car parts marketplace
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <Link to="/buyer-auth" className="block group">
            <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-blue-200 group-hover:border-blue-400">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-bold mb-3 text-blue-800">
                Buyer
              </h3>
              <p className="text-gray-600 text-sm sm:text-base font-crimson mb-6">
                Find and purchase car parts from verified sellers across Ghana
              </p>
              <div className="bg-blue-100 rounded-lg p-4 text-sm text-blue-800 font-medium">
                ✓ Browse available parts<br/>
                ✓ Request specific parts<br/>
                ✓ Connect with sellers<br/>
                ✓ Secure payments
              </div>
            </Card>
          </Link>

          <Link to="/seller-auth" className="block group">
            <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-orange-200 group-hover:border-orange-400">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Store className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-bold mb-3 text-orange-800">
                Seller
              </h3>
              <p className="text-gray-600 text-sm sm:text-base font-crimson mb-6">
                Sell and supply car parts to buyers across Ghana
              </p>
              <div className="bg-orange-100 rounded-lg p-4 text-sm text-orange-800 font-medium">
                ✓ List your inventory<br/>
                ✓ Respond to requests<br/>
                ✓ Manage offers<br/>
                ✓ Grow your business
              </div>
            </Card>
          </Link>

          <Link to="/admin-auth" className="block group">
            <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-purple-200 group-hover:border-purple-400">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-bold mb-3 text-purple-800">
                Administrator
              </h3>
              <p className="text-gray-600 text-sm sm:text-base font-crimson mb-6">
                Manage and oversee the PartMatch Ghana platform
              </p>
              <div className="bg-purple-100 rounded-lg p-4 text-sm text-purple-800 font-medium">
                ✓ Platform oversight<br/>
                ✓ User management<br/>
                ✓ Content moderation<br/>
                ✓ System analytics
              </div>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-500 text-sm sm:text-base font-crimson">
            Already have an account? Use the specific login page for your account type above.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthTypeSelector;
