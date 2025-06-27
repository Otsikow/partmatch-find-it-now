
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRedirect } from "@/hooks/useUserRedirect";
import AuthFormFields from "./AuthFormFields";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

const AuthForm = ({ isLogin, setIsLogin }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    userType: 'buyer'
  });
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn } = useAuth();
  
  // Use the redirect hook to handle post-authentication routing
  useUserRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          user_type: formData.userType
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-md">
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm shadow-2xl border-0">
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
            <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join PartMatch Ghana'}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-crimson">
            {isLogin 
              ? 'Sign in to your account' 
              : 'Create an account as a Buyer or Seller'
            }
          </p>
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
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="text-center mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base font-crimson transition-colors duration-300"
          >
            {isLogin 
              ? "Don't have an account? Join now" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </Card>
    </main>
  );
};

export default AuthForm;
