
import { Button } from "@/components/ui/button";
import { Search, Package, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";

const WelcomeSection = () => {
  const { user } = useAuth();
  const displayName = useUserDisplayName('User');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome to PartMatch</h1>
            <p className="text-xl text-gray-600">Hello, Guest</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">What would you like to do?</h2>
            <p className="text-lg text-gray-600">Choose an option below to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Browse Car Parts */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-4">Browse Car Parts</h3>
              <p className="text-gray-600 mb-6">Search through available car parts from verified suppliers</p>
              <Link to="/search-parts">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3">
                  Start Browsing
                </Button>
              </Link>
            </div>

            {/* Request Car Parts */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Request Car Parts</h3>
              <p className="text-gray-600 mb-6">Can't find what you need? Request it and suppliers will reach out</p>
              <Link to="/request-part">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3">
                  Make Request
                </Button>
              </Link>
            </div>

            {/* Become a Supplier */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">Become a Supplier</h3>
              <p className="text-gray-600 mb-6">Join as a supplier to sell car parts and grow your business</p>
              <Link to="/seller-auth">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="mr-4">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // For authenticated users, show the buyer options
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome to PartMatch</h1>
          <p className="text-xl text-gray-600">Hello, {displayName}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">What would you like to do?</h2>
          <p className="text-lg text-gray-600">Choose an option below to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Browse Car Parts */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">Browse Car Parts</h3>
            <p className="text-gray-600 mb-6">Search through available car parts from verified suppliers</p>
            <Link to="/search-parts">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3">
                Start Browsing
              </Button>
            </Link>
          </div>

          {/* Request Car Parts */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Request Car Parts</h3>
            <p className="text-gray-600 mb-6">Can't find what you need? Request it and suppliers will reach out</p>
            <Link to="/request-part">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3">
                Make Request
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <Link to="/buyer-dashboard">
            <Button variant="outline" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
