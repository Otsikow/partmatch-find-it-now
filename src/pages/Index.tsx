
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, Search, Package, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="p-4 text-center border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Car className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">PartMatch</h1>
        </div>
        <p className="text-gray-600">Connect with trusted local car part suppliers</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Need a car part? We'll find it for you!
          </h2>
          <p className="text-gray-600">
            Connect with verified local suppliers or browse available parts
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          {/* Customer Actions */}
          <Card className="p-6 hover:shadow-lg transition-shadow border-blue-100">
            <div className="text-center">
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Need a Part?</h3>
              <p className="text-gray-600 mb-4">
                Tell us what you need and we'll find it for you
              </p>
              <Link to="/request">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl">
                  Request a Part
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-green-100">
            <div className="text-center">
              <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Browse Parts</h3>
              <p className="text-gray-600 mb-4">
                Search available parts from local suppliers
              </p>
              <Link to="/search">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl">
                  Search Parts
                </Button>
              </Link>
            </div>
          </Card>

          {/* Supplier Actions */}
          <Card className="p-6 hover:shadow-lg transition-shadow border-orange-100">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Are you a Supplier?</h3>
              <p className="text-gray-600 mb-4">
                Manage your parts inventory and fulfill requests
              </p>
              <Link to="/supplier">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg rounded-xl">
                  Supplier Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Admin Access */}
        <div className="mt-8 text-center">
          <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-700">
            Admin Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
