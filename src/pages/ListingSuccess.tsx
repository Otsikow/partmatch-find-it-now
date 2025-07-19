import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";

const ListingSuccess = () => {
  const navigate = useNavigate();

  // Clean up localStorage on mount
  useEffect(() => {
    localStorage.removeItem('draftPart');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-accent to-gradient-secondary">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary-foreground text-white shadow-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  Listing Posted Successfully!
                </h1>
                <p className="text-sm sm:text-base text-white/90">
                  Your car part is now live on our marketplace
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Success! Your Part is Live
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Your car part has been successfully posted to our marketplace. 
              Buyers can now discover and contact you about this listing.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-green-800">
                    What happens next?
                  </p>
                  <ul className="text-sm text-green-700 mt-1 space-y-1">
                    <li>• Buyers can find your part through search</li>
                    <li>• You'll get notifications for inquiries</li>
                    <li>• Manage your listings from your dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/seller-dashboard')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                View My Listings
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/post-part')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Post Another Part
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                Return to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ListingSuccess;