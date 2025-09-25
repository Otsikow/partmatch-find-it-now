import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EmailVerificationHelperProps {
  defaultEmail?: string;
  onSuccess?: () => void;
}

const EmailVerificationHelper: React.FC<EmailVerificationHelperProps> = ({ 
  defaultEmail = '', 
  onSuccess 
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);
  const [canResend, setCanResend] = useState(true);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    // Check if enough time has passed since last send (60 seconds)
    const now = Date.now();
    if (lastSentTime && (now - lastSentTime) < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastSentTime)) / 1000);
      toast({
        title: 'Please Wait',
        description: `Please wait ${remainingTime} seconds before requesting another email`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setCanResend(false);

    try {
      console.log('🔄 Resending verification email for:', email);
      
      // Call our custom resend function
      const { error } = await supabase.functions.invoke('resend-verification', {
        body: { email }
      });

      if (error) {
        console.error('❌ Resend verification error:', error);
        throw new Error(error.message);
      }

      setLastSentTime(now);
      
      toast({
        title: 'Verification Email Sent!',
        description: 'Please check your inbox and spam folder for the verification email.',
      });

      if (onSuccess) {
        onSuccess();
      }

      // Re-enable after 60 seconds
      setTimeout(() => {
        setCanResend(true);
      }, 60000);

    } catch (error: any) {
      console.error('❌ Error resending verification:', error);
      
      let errorMessage = 'Failed to resend verification email. Please try again.';
      
      if (error.message.includes('not found')) {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.message.includes('already confirmed')) {
        errorMessage = 'Your email is already verified! You can sign in directly.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
      }

      toast({
        title: 'Resend Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-xl">Email Verification</CardTitle>
        <CardDescription>
          Didn't receive the verification email? We can send it again.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Check your spam/junk folder if you don't see the email in your inbox.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="resend-email">Email Address</Label>
          <Input
            id="resend-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleResendVerification}
          disabled={isLoading || !canResend || !email}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Resend Verification Email
            </>
          )}
        </Button>

        {lastSentTime && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Verification email sent! Please check your inbox and spam folder.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>Still having trouble? Contact support at:</p>
          <a 
            href="mailto:support@partmatch.app" 
            className="text-primary hover:underline"
          >
            support@partmatch.app
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationHelper;