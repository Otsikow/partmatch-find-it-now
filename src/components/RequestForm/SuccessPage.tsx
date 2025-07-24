
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 font-inter">
      <Card className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 text-center bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-3 sm:mb-4">Request Sent!</h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 font-crimson leading-relaxed">
          We've automatically notified sellers in your area. You'll receive offers via WhatsApp soon.
        </p>
        <Link to="/">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default SuccessPage;
