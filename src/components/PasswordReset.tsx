
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PasswordResetProps {
  onBack: () => void;
  borderColor?: string;
  focusColor?: string;
  buttonGradient?: string;
  buttonHoverGradient?: string;
}

const PasswordReset = ({ 
  onBack, 
  borderColor = "border-blue-200", 
  focusColor = "focus:border-blue-400",
  buttonGradient = "from-blue-600 to-indigo-700",
  buttonHoverGradient = "hover:from-blue-700 hover:to-indigo-800"
}: PasswordResetProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await resetPassword(email);
      // Reset form after successful submission
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Reset Your Password</h3>
        <p className="text-gray-600 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="reset-email" className="text-sm font-inter">Email Address *</Label>
          <div className="relative">
            <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 pl-10 text-base ${borderColor} ${focusColor}`}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className={`w-full bg-gradient-to-r ${buttonGradient} ${buttonHoverGradient} py-3 text-base rounded-xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 hover:underline text-sm font-crimson transition-colors duration-300 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
