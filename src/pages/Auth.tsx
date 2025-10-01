
import { useState } from "react";
import AuthHeader from "@/components/AuthHeader";
import AuthForm from "@/components/AuthForm";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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
