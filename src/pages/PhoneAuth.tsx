import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneAuthForm from "@/components/PhoneAuthForm";
import OTPVerification from "@/components/OTPVerification";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const PhoneAuth = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [action, setAction] = useState<'signup' | 'signin'>('signup');
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  const handleOTPSent = (phone: string, authAction: 'signup' | 'signin', formUserData?: any) => {
    setPhoneNumber(phone);
    setAction(authAction);
    setUserData(formUserData);
    setStep('otp');
  };

  const handleVerified = async (user: any, profile: any) => {
    try {
      // Store user data in localStorage for session management
      localStorage.setItem('phone_auth_user', JSON.stringify({ user, profile }));
      
      // Navigate based on user type
      if (profile.user_type === 'supplier') {
        navigate('/seller-dashboard');
      } else if (profile.user_type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/buyer-dashboard');
      }
    } catch (error) {
      console.error('Post-verification error:', error);
      navigate('/');
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      {step === 'phone' ? (
        <PhoneAuthForm
          onBack={handleBack}
          onOTPSent={handleOTPSent}
        />
      ) : (
        <OTPVerification
          phone={phoneNumber}
          action={action}
          onBack={handleBack}
          onVerified={handleVerified}
          userData={userData}
        />
      )}
      <Footer />
    </>
  );
};

export default PhoneAuth;