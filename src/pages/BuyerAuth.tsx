
import { useState } from "react";
import BuyerAuthHeader from "@/components/BuyerAuthHeader";
import BuyerAuthForm from "@/components/BuyerAuthForm";
import Footer from "@/components/Footer";

const BuyerAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      <BuyerAuthHeader isLogin={isLogin} showPasswordReset={showPasswordReset} />
      <BuyerAuthForm 
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        showPasswordReset={showPasswordReset}
        setShowPasswordReset={setShowPasswordReset}
      />
      <Footer />
    </div>
  );
};

export default BuyerAuth;
