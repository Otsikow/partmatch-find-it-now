
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
      <Card className="w-full max-w-md p-8 sm:p-12 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
          <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Oops! Page not found</h2>
        <p className="text-gray-600 text-base sm:text-lg mb-8 font-crimson leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </Button>
        </a>
      </Card>
    </div>
  );
};

export default NotFound;
