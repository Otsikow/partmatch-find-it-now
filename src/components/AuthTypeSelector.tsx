import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ShoppingCart, Store, ArrowLeft, Home, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const AuthTypeSelector = () => {
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showUserTypeDialog, setShowUserTypeDialog] = useState(false);

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

  const handleGoogleSignIn = async (selectedUserType: 'owner' | 'supplier') => {
    try {
      setLoading(true);
      
      // Store the user type in localStorage to retrieve after OAuth redirect
      localStorage.setItem('pending_google_user_type', selectedUserType);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign-in error:', error);
        toast.error("Google Sign-In Failed: " + (error.message || "Unable to sign in with Google"));
        localStorage.removeItem('pending_google_user_type');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error("An unexpected error occurred. Please try again.");
      localStorage.removeItem('pending_google_user_type');
    } finally {
      setLoading(false);
      setShowUserTypeDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted font-roboto">
      {/* Back Arrow and Logo - No Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-accent text-foreground bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <img 
            src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
            alt="PartMatch Logo" 
            className="h-6 w-auto sm:h-8 object-contain brightness-0 invert"
          />
        </Link>
      </div>

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
            {/* Google Sign-In */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-0 shadow-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-3 text-foreground dark:text-gray-100">Quick Google Sign-In</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300 mb-4">
                Sign in or create an account instantly with your Google account
              </p>
              <Button 
                onClick={() => setShowUserTypeDialog(true)}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border-2 border-gray-300 dark:border-gray-600 py-3 rounded-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{loading ? "Signing in..." : "Continue with Google"}</span>
              </Button>
            </div>

            {/* Phone Sign-In */}
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

        {/* User Type Selection Dialog */}
        <Dialog open={showUserTypeDialog} onOpenChange={setShowUserTypeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Choose Your Account Type</DialogTitle>
              <DialogDescription className="text-center pt-2">
                Select how you want to use PartMatch with your Google account
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Buyer Option */}
              <button
                onClick={() => handleGoogleSignIn('owner')}
                disabled={loading}
                className="group relative p-6 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-blue-500 dark:bg-blue-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-blue-700 dark:text-blue-400">Buyer</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                    Browse & buy car parts
                  </p>
                </div>
              </button>

              {/* Seller Option */}
              <button
                onClick={() => handleGoogleSignIn('supplier')}
                disabled={loading}
                className="group relative p-6 border-2 border-orange-200 dark:border-orange-800 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-orange-500 dark:bg-orange-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Store className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-orange-700 dark:text-orange-400">Seller</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                    Sell your car parts
                  </p>
                </div>
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              You can change this later in your profile settings
            </p>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default AuthTypeSelector;