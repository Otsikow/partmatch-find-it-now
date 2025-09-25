
import { useState } from "react";
import AuthHeroSection from "@/components/AuthHeroSection";
import AuthForm from "@/components/AuthForm";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted font-roboto">
      <AuthHeroSection isLogin={isLogin} />
      <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
      <Footer />
    </div>
  );
};

export default Auth;
