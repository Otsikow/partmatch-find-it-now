
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SetNewPasswordProps {
  onSuccess: () => void;
  borderColor?: string;
  focusColor?: string;
  buttonGradient?: string;
  buttonHoverGradient?: string;
}

const SetNewPassword = ({ 
  onSuccess,
  borderColor = "border-blue-200", 
  focusColor = "focus:border-blue-400",
  buttonGradient = "from-blue-600 to-indigo-700",
  buttonHoverGradient = "hover:from-blue-700 hover:to-indigo-800"
}: SetNewPasswordProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        toast({
          title: "Password Update Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password Updated Successfully",
          description: "Your password has been updated. You can now sign in with your new password.",
        });
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Set Your New Password</h3>
        <p className="text-gray-600 text-sm">
          Enter your new password below to complete the reset process.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="new-password" className="text-sm font-inter">New Password *</Label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-1 pl-10 pr-10 text-base ${borderColor} ${focusColor}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <div>
          <Label htmlFor="confirm-password" className="text-sm font-inter">Confirm New Password *</Label>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`mt-1 pl-10 pr-10 text-base ${borderColor} ${focusColor}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          className={`w-full bg-gradient-to-r ${buttonGradient} ${buttonHoverGradient} py-3 text-base rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
          disabled={loading}
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default SetNewPassword;
