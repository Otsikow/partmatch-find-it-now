
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ShoppingCart, Store, ArrowLeft, Home, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const AuthTypeSelector = () => {
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleDashboard = () => {
    if (user) {
      // Route to the appropriate dashboard based on user type
      if (userType === 'supplier') {
        navigate('/seller-dashboard');
      } else if (userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/buyer-dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <header className="relative bg-primary text-primary-foreground shadow-lg border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
        <div className="relative p-4 sm:p-6 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary-foreground/20 text-primary-foreground hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link to="/" className="bg-primary-foreground/20 backdrop-blur-sm rounded-xl p-2 shadow-lg hover:bg-primary-foreground/30 transition-colors">
              <img 
                src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
                alt="PartMatch Logo" 
                className="h-6 w-auto sm:h-8 object-contain bg-primary-foreground rounded-lg p-1"
              />
            </Link>
            <div className="min-w-0 flex-1">
              {/* Header text removed to fix layout issues */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleDashboard}
              variant="ghost" 
              size="sm" 
              className="hover:bg-primary-foreground/20 text-primary-foreground hover:text-primary-foreground"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            {user && (
              <Button 
                onClick={handleSignOut}
                variant="ghost" 
                size="sm" 
                className="hover:bg-primary-foreground/20 text-primary-foreground hover:text-primary-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="page-header text-2xl sm:text-3xl lg:text-4xl mb-4 text-primary">
            Choose your role to get started
          </h2>
          <p className="section-subtitle text-lg sm:text-xl max-w-2xl mx-auto mb-4">
            Buyer or seller? Select the account type that fits you best so we can tailor your PartMatch experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Buyer Card */}
          <Link to="/buyer-auth" className="block group">
            <Card className="h-full p-6 sm:p-8 text-center bg-card hover:bg-card/80 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-secondary/30 group-hover:border-secondary/50 flex flex-col">
              <div className="flex-grow">
                <div className="bg-primary rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
                </div>
                <h3 className="section-title text-xl sm:text-2xl mb-3 text-secondary">
                  Buyer
                </h3>
                <p className="card-description text-sm sm:text-base mb-6">
                  Find and purchase car parts from verified sellers.
                </p>
              </div>
              <div className="mt-auto">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground ui-button-text py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm leading-tight mb-6">
                  <span className="hidden md:inline">Sign In / Register as Buyer</span>
                  <span className="md:hidden">Buyer Sign In</span>
                </Button>
                <div className="bg-secondary/10 rounded-lg p-4 text-sm text-secondary font-medium text-left">
                  ✓ Browse available parts<br/>
                  ✓ Request specific parts<br/>
                  ✓ Connect with sellers<br/>
                  ✓ Secure payments
                </div>
              </div>
            </Card>
          </Link>

          {/* Seller Card */}
          <Link to="/seller-auth" className="block group">
            <Card className="h-full p-6 sm:p-8 text-center bg-card hover:bg-card/80 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-secondary/30 group-hover:border-secondary/50 flex flex-col">
              <div className="flex-grow">
                <div className="bg-secondary rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Store className="h-10 w-10 sm:h-12 sm:w-12 text-secondary-foreground" />
                </div>
                <h3 className="section-title text-xl sm:text-2xl mb-3 text-secondary">
                  Seller
                </h3>
                <p className="card-description text-sm sm:text-base mb-6">
                  Sell and supply car parts to a wide audience of buyers.
                </p>
              </div>
              <div className="mt-auto">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground ui-button-text py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm leading-tight mb-6">
                  <span className="hidden md:inline">Sign In / Register as Seller</span>
                  <span className="md:hidden">Seller Sign In</span>
                </Button>
                <div className="bg-secondary/10 rounded-lg p-4 text-sm text-secondary font-medium text-left">
                  ✓ List your inventory<br/>
                  ✓ Respond to requests<br/>
                  ✓ Manage offers<br/>
                  ✓ Grow your business
                </div>
              </div>
            </Card>
          </Link>

          {/* Guest Card */}
          <Link to="/guest-dashboard" className="block group">
            <Card className="h-full p-6 sm:p-8 text-center bg-card hover:bg-card/80 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border-2 border-accent/30 group-hover:border-accent/50 flex flex-col">
              <div className="flex-grow">
                <div className="bg-accent rounded-full p-4 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10-4.5 4.5M14 14l6-6m-4-3-1-1-4 4-1-1-4 4 1 1 4-4 1 1 4-4Z"/><path d="M20.5 16.5 18 14l-4 4h6v-1.5Z"/><path d="m3.5 3.5 1 1"/><path d="m14 18 4-4"/><path d="m21 21-6-6"/></svg>
                </div>
                <h3 className="section-title text-xl sm:text-2xl mb-3 text-secondary">
                  Guest
                </h3>
                <p className="card-description text-sm sm:text-base mb-6">
                  Browse the marketplace and see what’s available.
                </p>
              </div>
              <div className="mt-auto">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground ui-button-text py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm leading-tight mb-6">
                  Continue as Guest
                </Button>
                <div className="bg-accent/10 rounded-lg p-4 text-sm text-accent-foreground font-medium text-left">
                  ✓ Explore car parts<br/>
                  ✓ View seller profiles<br/>
                  ✓ No account needed to browse<br/>
                  ✓ Sign up when you're ready
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8 sm:mt-12 space-y-4">
          <div className="bg-card rounded-lg border p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-lg mb-3 text-foreground">Quick Phone Sign-up</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign up or sign in instantly using your phone number with OTP verification
            </p>
            <Link to="/phone-auth">
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Sign In/Up with Phone
              </Button>
            </Link>
          </div>
          <p className="body-text-small text-sm sm:text-base">
            Already have an account? Use the specific login page for your account type above.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthTypeSelector;
