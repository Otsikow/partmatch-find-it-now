
import { useState } from "react";
import AuthHeader from "@/components/AuthHeader";
import AuthForm from "@/components/AuthForm";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted font-roboto relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/auth-hero-car-parts.png')" }}
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
