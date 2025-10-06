
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRedirect } from "@/hooks/useUserRedirect";
import AuthFormFields from "./AuthFormFields";
import PasswordReset from "./PasswordReset";
import SetNewPassword from "./SetNewPassword";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

const AuthForm = ({ isLogin, setIsLogin }: AuthFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    userType: 'owner',
    country: '',
    city: '',
    language: 'en',
    currency: 'GHS'
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  
  const { signUp, signIn, isPasswordReset } = useAuth();
  const navigate = useNavigate();
  
  // Use the redirect hook to handle post-authentication routing
  useUserRedirect();

  // Check for email verification success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      setShowVerificationSuccess(true);
      setIsLogin(true); // Switch to login mode
      // Clear the URL parameter
      window.history.replaceState({}, '', '/auth');
    }
  }, [setIsLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error && error.message.includes("EMAIL_NOT_VERIFIED")) {
          // Extract email from error message
          const email = error.message.split("|")[1] || formData.email;
          toast({
            title: "Verification Email Sent",
            description: "We've sent you a new verification link. Please check your email (including spam folder) and click the link to verify your account.",
            duration: 7000,
          });
        }
      } else {
        console.log('AuthForm: Signing up with user_type:', formData.userType);
        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          user_type: formData.userType,
          country: formData.country,
          city: formData.city,
          language: formData.language,
          currency: formData.currency
        });
        
        if (!error) {
          toast({
            title: t('registrationSuccessful'),
            description: "Please check your email and click the verification link before signing in.",
          });
          setIsLogin(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
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
        toast({
          title: "Google Sign-In Failed",
          description: error.message || "Unable to sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Google Sign-In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (userType: string) => {
    switch (userType) {
      case 'owner': return 'Buyer';
      case 'supplier': return 'Seller';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
    setIsLogin(true);
  };

  const handlePasswordResetSuccess = () => {
    // Redirect based on user type or to a default page
    navigate('/');
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-md">
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-gray-800/90 dark:to-gray-700/50 backdrop-blur-sm shadow-2xl border-0 dark:border-gray-700">
        {isPasswordReset ? (
          <SetNewPassword onSuccess={handlePasswordResetSuccess} />
        ) : showPasswordReset ? (
          <PasswordReset onBack={handleBackToLogin} />
        ) : (
          <>
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Join Ghana'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-crimson">
                {isLogin 
                  ? 'Sign in to access your dashboard' 
                  : `Create your ${getRoleDisplayName(formData.userType)} account`
                }
              </p>
              
              {showVerificationSuccess && (
                <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    ✅ Email verified successfully! Please sign in with your credentials.
                  </AlertDescription>
                </Alert>
              )}
              {!isLogin && (
                <>
                  <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-xs font-medium inline-block">
                    Registering as: {getRoleDisplayName(formData.userType)}
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      📧 You'll need to verify your email before you can sign in
                    </p>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <AuthFormFields 
                isLogin={isLogin}
                formData={formData}
                onInputChange={handleInputChange}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : `Create ${getRoleDisplayName(formData.userType)} Account`)}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-crimson">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full py-3 sm:py-4 text-base rounded-xl font-inter font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-3"
                disabled={loading}
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
                <span>Continue with Google</span>
              </Button>
            </form>

            {isLogin && (
              <>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-sm font-crimson transition-colors duration-300"
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-300 text-center mb-2">
                    💡 If you just registered, check your email for a verification link before signing in
                  </p>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/email-verification')}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-300"
                    >
                      Didn't receive verification email? Get help →
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-sm sm:text-base font-crimson transition-colors duration-300"
              >
                {isLogin 
                  ? "Don't have an account? Join now" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </>
        )}
      </Card>
    </main>
  );
};

export default AuthForm;
