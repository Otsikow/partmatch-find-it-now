import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Store,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import PasswordReset from "@/components/PasswordReset";
import SetNewPassword from "@/components/SetNewPassword";
import Footer from "@/components/Footer";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate("/supplier");
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
            description:
              "Please check your email to verify your account, then sign in below.",
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
    navigate("/supplier");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-100 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-red-900/20 font-inter">
      <header className="relative bg-gradient-to-r from-primary via-primary/95 to-primary-foreground text-white shadow-lg border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-red-600/5 to-indigo-600/10"></div>
        <div className="relative p-4 sm:p-6 flex items-center gap-3">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/20 text-white hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <img
                src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png"
                alt="PartMatch Logo"
                className="h-6 w-auto sm:h-8 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight break-words">
                Seller{" "}
                {isPasswordReset
                  ? "Password Reset"
                  : showPasswordReset
                  ? "Password Reset"
                  : isLogin
                  ? "Sign In"
                  : "Registration"}
              </h1>
              <p className="text-sm sm:text-base text-white/90 leading-tight break-words mt-1">
                {isPasswordReset || showPasswordReset 
                  ? "Reset your seller password to continue" 
                  : isLogin 
                  ? "Welcome back to your seller account" 
                  : "Join our marketplace as a seller"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-md">
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-orange-50/50 dark:from-gray-800/90 dark:to-orange-900/20 backdrop-blur-sm shadow-2xl border-0">
          {isPasswordReset ? (
            <SetNewPassword
              onSuccess={handlePasswordResetSuccess}
              borderColor="border-orange-200"
              focusColor="focus:border-orange-400"
              buttonGradient="from-orange-600 to-red-700"
              buttonHoverGradient="hover:from-orange-700 hover:to-red-800"
            />
          ) : showPasswordReset ? (
            <PasswordReset
              onBack={handleBackToLogin}
              borderColor="border-orange-200"
              focusColor="focus:border-orange-400"
              buttonGradient="from-orange-600 to-red-700"
              buttonHoverGradient="hover:from-orange-700 hover:to-red-800"
            />
          ) : (
            <>
              <div className="text-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Store className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                  {isLogin ? "Welcome Back Seller" : "Join as a Seller"}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base font-crimson">
                  {isLogin
                    ? "Sign in to manage your inventory"
                    : "Register to sell and supply car parts"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-sm sm:text-base font-inter"
                        >
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                          className="mt-1 text-base border-orange-200 focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-sm sm:text-base font-inter"
                        >
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                          className="mt-1 text-base border-orange-200 focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm sm:text-base font-inter"
                      >
                        Phone/WhatsApp *
                      </Label>
                      <div className="relative">
                        <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+233 20 123 4567"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          required
                          className="mt-1 pl-10 text-base border-orange-200 focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="location"
                        className="text-sm sm:text-base font-inter"
                      >
                        Location *
                      </Label>
                      <div className="relative">
                        <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="e.g. Accra, Kumasi"
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          required
                          className="mt-1 pl-10 text-base border-orange-200 focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm sm:text-base font-inter"
                  >
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seller@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="mt-1 pl-10 text-base border-orange-200 focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm sm:text-base font-inter"
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="mt-1 pl-10 pr-10 text-base border-orange-200 focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : isLogin
                    ? "Sign In as Seller"
                    : "Create Seller Account"}
                </Button>
              </form>

              <div className="text-center mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 hover:text-orange-800 hover:underline text-sm sm:text-base font-crimson transition-colors duration-300"
                >
                  {isLogin
                    ? "Need a seller account? Register here"
                    : "Already have an account? Sign in"}
                </button>
              </div>

              {isLogin && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-orange-600 hover:text-orange-800 hover:underline text-sm font-crimson transition-colors duration-300"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SellerAuth;
