
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "@/components/AuthHeader";
import AuthForm from "@/components/AuthForm";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle email verification callback
    const handleEmailVerification = async () => {
      const verified = searchParams.get('verified');
      const error = searchParams.get('error');
      
      if (verified === 'true') {
        toast({
          title: "Email Verified Successfully!",
          description: "Your email has been confirmed. You can now sign in to your account.",
          duration: 5000,
        });
        // Clean up URL
        navigate('/auth', { replace: true });
      } else if (error) {
        toast({
          title: "Verification Failed",
          description: decodeURIComponent(error),
          variant: "destructive",
          duration: 7000,
        });
        // Clean up URL
        navigate('/auth', { replace: true });
      }

      // Check if this is a token-based verification (from email link)
      const token_hash = searchParams.get('token_hash') || searchParams.get('token');
      const type = searchParams.get('type');
      
      if (token_hash && type) {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (verifyError) {
            toast({
              title: "Verification Failed",
              description: verifyError.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Email Verified!",
              description: "You can now sign in to your account.",
            });
          }
        } catch (err: any) {
          toast({
            title: "Verification Error",
            description: err.message || "Failed to verify email",
            variant: "destructive",
          });
        }
        // Clean up URL
        navigate('/auth', { replace: true });
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted font-roboto relative overflow-hidden">
      {/* Hero Background Image */}
      <img 
        src="/auth-hero-car-parts.png" 
        alt="Authentication background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-muted/80" />
      <div className="relative z-10">
        <AuthHeader isLogin={isLogin} />
        <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
        <Footer />
      </div>
    </div>
  );
};

export default Auth;
