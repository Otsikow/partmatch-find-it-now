
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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

  const handleBackToLogin = () => {
    setShowPasswordReset(false);
  };

  const handlePasswordResetSuccess = () => {
    navigate('/admin');
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
