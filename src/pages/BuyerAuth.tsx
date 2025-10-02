import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Mail, Lock, Phone, MapPin, Eye, EyeOff, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import PasswordReset from "@/components/PasswordReset";
import SetNewPassword from "@/components/SetNewPassword";

const BuyerAuth = () => {
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
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp, signIn, isPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password, "owner");
        if (!error) {
          navigate('/buyer-dashboard');
        } else if (error.message.includes("EMAIL_NOT_VERIFIED")) {
          // Extract email from error message
          const email = error.message.split("|")[1] || formData.email;
          toast({
            title: "Verification Email Sent",
            description: "We've sent you a new verification link. Please check your email (including spam folder) and click the link to verify your account.",
            duration: 7000,
          });
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          user_type: "owner"
        });
        if (!error) {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account, then sign in below.",
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

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
    setIsLogin(true);
  };

  const handlePasswordResetSuccess = () => {
    // After password reset, show login form
    setIsLogin(true);
    toast({
      title: "Password Updated",
      description: "Please sign in with your new password.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted font-roboto">
      {/* Header */}
      <header className="relative bg-primary text-primary-foreground shadow-lg">
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
          <Link to="/">
            <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/20 text-primary-foreground hover:text-primary-foreground">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="p-8">
              {isPasswordReset ? (
                <SetNewPassword
                  onSuccess={handlePasswordResetSuccess}
                  borderColor="border-primary/20"
                  focusColor="focus:border-primary"
                  buttonGradient="from-primary to-primary/90"
                  buttonHoverGradient="hover:from-primary/90 hover:to-primary"
                />
              ) : showPasswordReset ? (
                <PasswordReset
                  onBack={handleBackToLogin}
                  borderColor="border-primary/20"
                  focusColor="focus:border-primary"
                  buttonGradient="from-primary to-primary/90"
                  buttonHoverGradient="hover:from-primary/90 hover:to-primary"
                />
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="bg-primary rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
                      <ShoppingCart className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Welcome Back Buyer
                    </h2>
                    <p className="text-muted-foreground">
                      Sign in to find car parts
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="firstName" className="text-sm font-medium">
                              First Name *
                            </Label>
                            <Input
                              id="firstName"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              required
                              className="mt-1 border-input bg-muted/30 rounded-lg h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-sm font-medium">
                              Last Name *
                            </Label>
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              required
                              className="mt-1 border-input bg-muted/30 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Phone *
                          </Label>
                          <div className="relative">
                            <Phone className="h-4 w-4 absolute left-3 top-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+233 20 123 4567"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              required
                              className="mt-1 pl-10 border-input bg-muted/30 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="location" className="text-sm font-medium">
                            Location *
                          </Label>
                          <div className="relative">
                            <MapPin className="h-4 w-4 absolute left-3 top-4 text-muted-foreground" />
                            <Input
                              id="location"
                              placeholder="e.g. Accra, Kumasi"
                              value={formData.location}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                              required
                              className="mt-1 pl-10 border-input bg-muted/30 rounded-lg h-12"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="h-4 w-4 absolute left-3 top-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="mt-1 pl-10 border-input bg-muted/30 rounded-lg h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password *
                      </Label>
                      <div className="relative">
                        <Lock className="h-4 w-4 absolute left-3 top-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                          className="mt-1 pl-10 pr-10 border-input bg-muted/30 rounded-lg h-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? "Please wait..." : isLogin ? "Sign In as Buyer" : "Create Buyer Account"}
                    </Button>
                  </form>

                  {/* Links */}
                  <div className="text-center mt-6 space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors duration-300"
                    >
                      {isLogin ? "Need a buyer account? Register here" : "Already have an account? Sign in"}
                    </button>
                    
                    {isLogin && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowPasswordReset(true)}
                          className="text-primary hover:text-primary/80 hover:underline text-sm transition-colors duration-300"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BuyerAuth;