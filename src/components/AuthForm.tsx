
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
