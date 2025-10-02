
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AdminAuthHeader from "@/components/AdminAuthHeader";
import AdminAuthForm from "@/components/AdminAuthForm";
import AdminSecurityAlert from "@/components/AdminSecurityAlert";
import PasswordReset from "@/components/PasswordReset";
import SetNewPassword from "@/components/SetNewPassword";
import Footer from "@/components/Footer";

const AdminAuth = () => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { isPasswordReset } = useAuth();
  const navigate = useNavigate();
  
  // Check if we're in password reset mode on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlType = urlParams.get("type");
    const inResetMode = urlType === "recovery" || sessionStorage.getItem("password_reset_mode") === "true";
    
    if (inResetMode && !isPasswordReset) {
      sessionStorage.setItem("password_reset_mode", "true");
    }
  }, [isPasswordReset]);

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
  };

  const handlePasswordResetSuccess = () => {
    // After password reset, show login form
    setShowPasswordReset(false);
    toast({
      title: "Password Updated",
      description: "Please sign in with your new password.",
    });
  };

  const handlePasswordResetClick = () => {
    setShowPasswordReset(true);
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <AdminAuthHeader 
        isPasswordReset={isPasswordReset}
        showPasswordReset={showPasswordReset}
      />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-md">
        <Card className="p-6 sm:p-8 bg-card backdrop-blur-sm shadow-2xl border">
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
              <AdminSecurityAlert />
              <AdminAuthForm onPasswordResetClick={handlePasswordResetClick} />
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAuth;
