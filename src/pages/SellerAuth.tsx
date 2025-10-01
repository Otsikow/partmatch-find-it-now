import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Mail, Lock, Phone, MapPin, Eye, EyeOff, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import PasswordReset from "@/components/PasswordReset";
import SetNewPassword from "@/components/SetNewPassword";

const SellerAuth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, signIn, isPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password, "supplier");
        if (!error) {
          const redirect = searchParams.get('redirect');
          const autoSubmit = searchParams.get('autoSubmit');
          
          if (redirect && autoSubmit) {
            navigate(`${redirect}?autoSubmit=true`);
          } else if (redirect) {
            navigate(redirect);
          } else {
            navigate("/seller-dashboard");
          }
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
          user_type: "supplier",
        });
        if (!error) {
          toast({
            title: "Seller Account Created!",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
    setIsLogin(true);
  };

  const handlePasswordResetSuccess = () => {
    const redirect = searchParams.get('redirect');
    const autoSubmit = searchParams.get('autoSubmit');
    
    if (redirect && autoSubmit) {
      navigate(`${redirect}?autoSubmit=true`);
    } else if (redirect) {
      navigate(redirect);
    } else {
      navigate("/seller-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted font-roboto">
      {/* Header */}
      <header className="relative bg-secondary text-secondary-foreground shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-secondary/5"></div>
        <div className="relative p-4 sm:p-6 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-secondary-foreground/20 text-secondary-foreground hover:text-secondary-foreground">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link to="/" className="bg-secondary-foreground/20 backdrop-blur-sm rounded-xl p-2 shadow-lg hover:bg-secondary-foreground/30 transition-colors">
              <img 
                src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
                alt="PartMatch Logo" 
                className="h-6 w-auto sm:h-8 object-contain bg-secondary-foreground dark:bg-white rounded-lg p-1"
              />
            </Link>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="hover:bg-secondary-foreground/20 text-secondary-foreground hover:text-secondary-foreground">
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
                  borderColor="border-secondary/20"
                  focusColor="focus:border-secondary"
                  buttonGradient="from-secondary to-secondary/90"
                  buttonHoverGradient="hover:from-secondary/90 hover:to-secondary"
                />
              ) : showPasswordReset ? (
                <PasswordReset
                  onBack={handleBackToLogin}
                  borderColor="border-secondary/20"
                  focusColor="focus:border-secondary"
                  buttonGradient="from-secondary to-secondary/90"
                  buttonHoverGradient="hover:from-secondary/90 hover:to-secondary"
                />
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="bg-secondary rounded-full p-4 w-fit mx-auto mb-6 shadow-lg">
                      <Store className="h-12 w-12 text-secondary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary mb-2">
                      Welcome Back Seller
                    </h2>
                    <p className="text-muted-foreground">
                      Sign in to manage your inventory
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
                            Phone/WhatsApp *
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
                          placeholder="seller@email.com"
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
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-6 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? "Please wait..." : isLogin ? "Sign In as Seller" : "Create Seller Account"}
                    </Button>
                  </form>

                  {/* Links */}
                  <div className="text-center mt-6 space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-secondary hover:text-secondary/80 hover:underline text-sm font-medium transition-colors duration-300"
                    >
                      {isLogin ? "Need a seller account? Register here" : "Already have an account? Sign in"}
                    </button>
                    
                    {isLogin && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowPasswordReset(true)}
                          className="text-secondary hover:text-secondary/80 hover:underline text-sm transition-colors duration-300"
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

export default SellerAuth;