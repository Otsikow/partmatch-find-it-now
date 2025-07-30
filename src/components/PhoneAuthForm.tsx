import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
];

interface PhoneAuthFormProps {
  onBack: () => void;
  onOTPSent: (phone: string, action: 'signup' | 'signin', userData?: any) => void;
}

const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({ onBack, onOTPSent }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [countryCode, setCountryCode] = useState('+233');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<'owner' | 'supplier'>('owner');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (isSignUp && (!firstName.trim() || !lastName.trim())) {
      toast.error('Please enter your full name');
      return;
    }

    const fullPhone = countryCode + phoneNumber.replace(/\s/g, '');
    
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('send-otp', {
        body: {
          phone: fullPhone,
          action: isSignUp ? 'signup' : 'signin',
        },
      });

      if (response.error) {
        throw response.error;
      }

      const data = response.data;

      if (data.success) {
        toast.success('OTP sent successfully!');
        const formUserData = isSignUp ? {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        } : undefined;
        onOTPSent(fullPhone, isSignUp ? 'signup' : 'signin', formUserData);
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Sign up with Phone' : 'Sign in with Phone'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Create your PartMatch account using your phone number'
              : 'Sign in to your PartMatch account using your phone number'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userType">Account Type</Label>
                  <Select value={userType} onValueChange={(value: 'owner' | 'supplier') => setUserType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Car Owner (Buyer)</SelectItem>
                      <SelectItem value="supplier">Parts Supplier (Seller)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  placeholder="24 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneAuthForm;