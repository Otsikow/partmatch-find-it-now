import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

const GuestDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      <PageHeader
        title="Welcome, Guest"
        subtitle="Browse and discover parts"
        backTo="/"
      >
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-700 hover:bg-green-50/50 font-medium">
            Sign In / Register
          </Button>
        </Link>
      </PageHeader>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
            <User className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            What would you like to do?
          </h2>
          <p className="text-gray-600 text-lg font-crimson">
            Choose an option below to get started
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-6 sm:gap-8">
          {/* Browse Car Parts */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 text-emerald-700">
                Browse Car Parts
              </h3>
              <p className="text-gray-600 mb-6 font-crimson">
                Search through available car parts from verified sellers
              </p>
              <Link to="/search-parts">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Browsing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GuestDashboard;
