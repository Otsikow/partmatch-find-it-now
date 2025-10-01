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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted font-roboto">
      {/* Header */}
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
                  className="h-6 w-auto sm:h-8 object-contain bg-primary-foreground dark:bg-white rounded-lg p-1"
                />
              </Link>
            </div>
            <div className="flex items-center gap-2">
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

        {/* Hero Section with Image */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src="/auth-hero-car-parts.png" 
            alt="Security authentication"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 w-fit mx-auto mb-6 shadow-xl">
                <Shield className="h-12 w-12 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Secure Authentication
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Choose your account type to get started securely
              </p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              What would you like to do?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose an option below to get started
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Buyer Card - Blue Theme */}
            <Link to="/buyer-auth" className="block group">
              <Card className="h-full p-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 hover:from-blue-100 hover:to-blue-150 dark:hover:from-blue-900/60 dark:hover:to-blue-800/40 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border-0 shadow-lg rounded-2xl flex flex-col">
                <div className="flex-grow">
                  <div className="bg-blue-500 dark:bg-blue-600 rounded-full p-6 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <ShoppingCart className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">
                    Browse Car Parts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
                    Search through available car parts from verified sellers
                  </p>
                </div>
                <div className="mt-auto">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium mb-6">
                    Start Browsing
                  </Button>
                  <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-lg p-4 text-sm text-blue-600 dark:text-blue-300 font-medium text-left">
                    ✓ Browse available parts<br/>
                    ✓ Request specific parts<br/>
                    ✓ Connect with sellers<br/>
                    ✓ Secure payments
                  </div>
                </div>
              </Card>
            </Link>

            {/* Seller Card - Orange Theme */}
            <Link to="/seller-auth" className="block group">
              <Card className="h-full p-8 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 hover:from-orange-100 hover:to-orange-150 dark:hover:from-orange-900/60 dark:hover:to-orange-800/40 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border-0 shadow-lg rounded-2xl flex flex-col">
                <div className="flex-grow">
                  <div className="bg-orange-500 dark:bg-orange-600 rounded-full p-6 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Store className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-orange-600 dark:text-orange-400">
                    Sell Car Parts
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
                    List and manage your car parts inventory
                  </p>
                </div>
                <div className="mt-auto">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium mb-6">
                    Start Selling
                  </Button>
                  <div className="bg-orange-500/10 dark:bg-orange-500/20 rounded-lg p-4 text-sm text-orange-600 dark:text-orange-300 font-medium text-left">
                    ✓ List your inventory<br/>
                    ✓ Respond to requests<br/>
                    ✓ Manage offers<br/>
                    ✓ Grow your business
                  </div>
                </div>
              </Card>
            </Link>

            {/* Guest Card - Green Theme */}
            <Link to="/guest-dashboard" className="block group">
              <Card className="h-full p-8 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 hover:from-green-100 hover:to-green-150 dark:hover:from-green-900/60 dark:hover:to-green-800/40 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border-0 shadow-lg rounded-2xl flex flex-col">
                <div className="flex-grow">
                  <div className="bg-green-500 dark:bg-green-600 rounded-full p-6 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-green-600 dark:text-green-400">
                    Browse as Guest
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
                    Explore the marketplace without creating an account
                  </p>
                </div>
                <div className="mt-auto">
                  <Button className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium mb-6">
                    Continue as Guest
                  </Button>
                  <div className="bg-green-500/10 dark:bg-green-500/20 rounded-lg p-4 text-sm text-green-600 dark:text-green-300 font-medium text-left">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-0 shadow-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-3 text-foreground dark:text-gray-100">Quick Phone Sign-up</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300 mb-4">
                Sign up or sign in instantly using your phone number with OTP verification
              </p>
              <Link to="/phone-auth">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg">
                  Sign In/Up with Phone
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              Already have an account? Use the specific login page for your account type above.
            </p>
          </div>
        </main>
    </div>
  );
};

export default AuthTypeSelector;