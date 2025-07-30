import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  phone: string;
  action: 'signup' | 'signin';
  onBack: () => void;
  onVerified: (user: any, profile: any) => void;
  userData?: {
    first_name?: string;
    last_name?: string;
    user_type?: 'owner' | 'supplier';
  };
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  phone, 
  action, 
  onBack, 
  onVerified,
  userData 
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Start countdown when component mounts
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('verify-otp', {
        body: {
          phone,
          otp,
          userData: action === 'signup' ? userData : undefined,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const data = response.data;

      if (data.success) {
        toast.success(action === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
        onVerified(data.user, data.profile);
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 seconds countdown

    try {
      const response = await supabase.functions.invoke('send-otp', {
        body: {
          phone,
          action,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const data = response.data;

      if (data.success) {
        toast.success('OTP sent again!');
      } else {
        toast.error(data.error || 'Failed to resend OTP');
        setResendDisabled(false);
        setCountdown(0);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP');
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="w-8 h-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verify your phone
          </CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to{' '}
            <span className="font-medium">{formatPhoneNumber(phone)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button
              variant="link"
              onClick={handleResend}
              disabled={resendDisabled}
              className="text-sm"
            >
              {resendDisabled 
                ? `Resend in ${countdown}s` 
                : 'Resend code'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;