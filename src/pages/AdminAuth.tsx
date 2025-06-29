import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, Mail, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PasswordReset from "@/components/PasswordReset";
import SetNewPassword from "@/components/SetNewPassword";
import { ADMIN_SECURITY_CONFIG, validateAdminPassword } from "@/utils/adminSecurity";

const AdminAuth = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{valid: boolean; errors: string[]}>({valid: true, errors: []});
  
  const { signUp, signIn, isPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    if (!isLogin && password) {
      const validation = validateAdminPassword(password);
      setPasswordValidation(validation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;

    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    // Validate password strength for registration
    if (!isLogin) {
      const validation = validateAdminPassword(formData.password);
      if (!validation.valid) {
        toast({
          title: "Password Requirements Not Met",
          description: validation.errors.join(' '),
          variant: "destructive"
        });
        return;
      }
    }
    
    setLoading(true);
    console.log('AdminAuth: Starting', isLogin ? 'sign in' : 'sign up', 'for:', formData.email);
    
    try {
      if (isLogin) {
        console.log('AdminAuth: Attempting sign in...');
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error('AdminAuth: Sign in error:', error);
          // The AuthContext already shows the toast, so we don't need to show another one here
        } else {
          console.log('AdminAuth: Sign in successful, navigating to admin dashboard');
          toast({
            title: "Sign In Successful",
            description: "Welcome back! Redirecting to admin dashboard...",
          });
          // Small delay to ensure state is updated before navigation
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 100);
        }
      } else {
        console.log('AdminAuth: Attempting sign up...');
        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          user_type: 'admin'
        });
        if (error) {
          console.error('AdminAuth: Sign up error:', error);
          // The AuthContext already shows the toast, so we don't need to show another one here
        } else {
          toast({
            title: "Admin Account Created!",
            description: "Please check your email to verify your account, then sign in below.",
          });
          setIsLogin(true);
          setShowRegistration(false);
          // Clear form data except email
          setFormData(prev => ({
            ...prev,
            password: '',
            firstName: '',
            lastName: '',
            phone: '',
            location: ''
          }));
        }
      }
    } catch (error) {
      console.error('AdminAuth: Unexpected error:', error);
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'password') {
      handlePasswordChange(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
    setIsLogin(true);
    setShowRegistration(false);
  };

  const handlePasswordResetSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 font-inter">
      <header className="p-4 sm:p-6 flex items-center gap-3 bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
            alt="PartMatch Logo" 
            className="h-6 w-auto sm:h-8"
          />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
            Admin {isPasswordReset ? 'Password Reset' : showPasswordReset ? 'Password Reset' : (isLogin ? 'Sign In' : 'Registration')}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-md">
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm shadow-2xl border-0">
          {isPasswordReset ? (
            <SetNewPassword 
              onSuccess={handlePasswordResetSuccess}
              borderColor="border-purple-200"
              focusColor="focus:border-purple-400"
              buttonGradient="from-purple-600 to-indigo-700"
              buttonHoverGradient="hover:from-purple-700 hover:to-indigo-800"
            />
          ) : showPasswordReset ? (
            <PasswordReset 
              onBack={handleBackToLogin}
              borderColor="border-purple-200"
              focusColor="focus:border-purple-400"
              buttonGradient="from-purple-600 to-indigo-700"
              buttonHoverGradient="hover:from-purple-700 hover:to-indigo-800"
            />
          ) : (
            <>
              <div className="text-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                  {isLogin ? 'Admin Access' : 'Admin Registration'}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base font-crimson">
                  {isLogin 
                    ? 'Secure admin portal access' 
                    : 'Create your admin account'
                  }
                </p>
              </div>

              {ADMIN_SECURITY_CONFIG.DEVELOPMENT_MODE && (
                <Alert className="mb-6 border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>⚠️ DEV MODE:</strong> Security checks are relaxed for testing. This will be disabled in production.
                  </AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <Alert className="mb-6 border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Only pre-authorized emails can create admin accounts. Contact the system administrator if you need access.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {!isLogin && showRegistration && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-sm sm:text-base font-inter">First Name *</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="mt-1 text-base border-purple-200 focus:border-purple-400"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm sm:text-base font-inter">Last Name *</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="mt-1 text-base border-purple-200 focus:border-purple-400"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm sm:text-base font-inter">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+233 20 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="mt-1 text-base border-purple-200 focus:border-purple-400"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm sm:text-base font-inter">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g. Accra, Kumasi"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                        className="mt-1 text-base border-purple-200 focus:border-purple-400"
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base font-inter">Email *</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@partmatchgh.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1 pl-10 text-base border-purple-200 focus:border-purple-400"
                      disabled={loading}
                    />
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Only pre-authorized admin emails are allowed
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm sm:text-base font-inter">Password *</Label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="mt-1 pl-10 pr-10 text-base border-purple-200 focus:border-purple-400"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {!isLogin && !passwordValidation.valid && passwordValidation.errors.length > 0 && (
                    <div className="mt-2">
                      {passwordValidation.errors.map((error, index) => (
                        <p key={index} className="text-xs text-red-600">
                          • {error}
                        </p>
                      ))}
                    </div>
                  )}
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 12 characters with uppercase, lowercase, numbers, and special characters
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading || (!isLogin && !passwordValidation.valid)}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Admin Account'
                  )}
                </Button>
              </form>

              {isLogin && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-purple-600 hover:text-purple-800 hover:underline text-sm font-crimson transition-colors duration-300"
                    disabled={loading}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {isLogin && (
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setShowRegistration(true);
                    }}
                    className="text-purple-600 hover:text-purple-800 hover:underline text-sm sm:text-base font-crimson transition-colors duration-300"
                    disabled={loading}
                  >
                    Need to create an admin account?
                  </button>
                </div>
              )}

              {showRegistration && !isLogin && (
                <div className="text-center mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setShowRegistration(false);
                    }}
                    className="text-purple-600 hover:text-purple-800 hover:underline text-sm sm:text-base font-crimson transition-colors duration-300"
                    disabled={loading}
                  >
                    Back to sign in
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminAuth;
