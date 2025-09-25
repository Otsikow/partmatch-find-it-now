import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import EmailVerificationHelper from '@/components/EmailVerificationHelper';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'verified' | 'error' | 'help'>('loading');
  const [message, setMessage] = useState('');

  const verified = searchParams.get('verified');
  const error = searchParams.get('error');
  const email = searchParams.get('email');

  useEffect(() => {
    if (verified === 'true') {
      setStatus('verified');
      setMessage('Your email has been successfully verified! You can now sign in to your account.');
    } else if (error) {
      setStatus('error');
      setMessage(decodeURIComponent(error));
    } else {
      setStatus('help');
    }
  }, [verified, error]);

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  const handleGetHelp = () => {
    setStatus('help');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Processing verification...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'help') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToLogin}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <EmailVerificationHelper 
            defaultEmail={email || ''}
            onSuccess={() => {
              setTimeout(() => {
                navigate('/auth');
              }, 3000);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button
          variant="ghost"
          onClick={handleBackToLogin}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'verified' ? (
                <div className="animate-in fade-in duration-500">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
              ) : status === 'error' ? (
                <div className="animate-in fade-in duration-500">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
              ) : (
                <Mail className="h-16 w-16 text-primary" />
              )}
            </div>
            
            <CardTitle className="text-2xl">
              {status === 'verified' ? 'Email Verified!' : 
               status === 'error' ? 'Verification Failed' : 
               'Email Verification'}
            </CardTitle>
            
            <CardDescription>
              {status === 'verified' ? 'Your account is now ready to use' :
               status === 'error' ? 'There was a problem verifying your email' :
               'Verify your email to complete registration'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleBackToLogin}
                className="w-full"
                variant={status === 'verified' ? 'default' : 'outline'}
              >
                {status === 'verified' ? 'Sign In Now' : 'Back to Login'}
              </Button>
              
              {status === 'error' && (
                <Button
                  onClick={handleGetHelp}
                  variant="default"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;