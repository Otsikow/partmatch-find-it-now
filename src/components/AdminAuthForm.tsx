
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { validateAdminPassword } from "@/utils/adminSecurity";

interface AdminAuthFormProps {
  onPasswordResetClick: () => void;
}

const AdminAuthForm = ({ onPasswordResetClick }: AdminAuthFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{valid: boolean; errors: string[]}>({valid: true, errors: []});
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    if (password) {
      const validation = validateAdminPassword(password);
      setPasswordValidation(validation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    console.log('AdminAuthForm: Starting admin sign in for:', formData.email);
    
    try {
      console.log('AdminAuthForm: Attempting admin sign in...');
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        console.error('AdminAuthForm: Sign in error:', error);
      } else {
        console.log('AdminAuthForm: Sign in successful, navigating to admin dashboard');
        toast({
          title: "Sign In Successful",
          description: "Welcome back! Redirecting to admin dashboard...",
        });
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error('AdminAuthForm: Unexpected error:', error);
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

  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-4 w-fit mx-auto mb-4 sm:mb-6 shadow-lg">
          <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold mb-2 sm:mb-3 text-primary">
          Admin Access
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base font-crimson">
          Secure admin portal access
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <Label htmlFor="email" className="text-sm sm:text-base font-inter text-foreground">Admin Email *</Label>
          <div className="relative">
            <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="admin@partmatchgh.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="mt-1 pl-10 text-base border-input focus:border-primary"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Only pre-authorized admin emails are allowed
          </p>
        </div>

        <div>
          <Label htmlFor="password" className="text-sm sm:text-base font-inter text-foreground">Password *</Label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className="mt-1 pl-10 pr-10 text-base border-input focus:border-primary"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 py-3 sm:py-4 text-base sm:text-lg rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-white"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Signing In...
            </div>
          ) : (
            'Sign In to Admin Portal'
          )}
        </Button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onPasswordResetClick}
          className="text-primary hover:text-primary/80 hover:underline text-sm font-crimson transition-colors duration-300"
          disabled={loading}
        >
          Forgot your password?
        </button>
      </div>
    </>
  );
};

export default AdminAuthForm;
