import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { isAuthorizedAdminEmail, logAdminSecurityEvent } from '@/utils/adminSecurity';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPasswordReset: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Check URL for password reset
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      setIsPasswordReset(true);
      // Set the session from URL params
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, {
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          userMetadata: session?.user?.user_metadata
        });
        
        // Check if this is a password recovery session
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordReset(true);
        } else if (event === 'SIGNED_IN' && isPasswordReset) {
          // Keep password reset mode active during password reset flow
          setIsPasswordReset(true);
        } else if (event === 'SIGNED_OUT') {
          setIsPasswordReset(false);
        }
        
        // Update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session check:', {
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userMetadata: session?.user?.user_metadata
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [isPasswordReset]);

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('AuthProvider: SignUp attempt:', { email, userData });
    
    // Prevent admin registration from public forms
    if (userData.user_type === 'admin') {
      console.log('AuthProvider: Admin signup attempt blocked - not allowed from public form');
      
      const error = new Error('Admin registration is not allowed from this form. Contact system administrator.');
      toast({
        title: "Access Denied",
        description: "Admin registration is not allowed from this form. Contact system administrator.",
        variant: "destructive"
      });
      
      logAdminSecurityEvent({
        type: 'UNAUTHORIZED_ACCESS',
        email: email,
        details: 'Attempted admin registration from public form'
      });
      
      return { error };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });
      
      console.log('AuthProvider: SignUp result:', { error });
      
      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('AuthProvider: SignUp unexpected error:', error);
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred during sign up.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: SignIn attempt:', { email });
    
    // For admin login attempts, validate email authorization first
    const urlPath = window.location.pathname;
    const isAdminLogin = urlPath.includes('admin');
    
    if (isAdminLogin) {
      console.log('AuthProvider: Admin signin attempt for email:', email);
      
      if (!isAuthorizedAdminEmail(email)) {
        const error = new Error('Access denied. This email is not authorized for admin access.');
        toast({
          title: "Access Denied",
          description: "This email is not authorized for admin access.",
          variant: "destructive"
        });
        
        logAdminSecurityEvent({
          type: 'UNAUTHORIZED_ACCESS',
          email: email,
          details: 'Attempted admin signin with unauthorized email'
        });
        
        return { error };
      }
    }
    
    try {
      console.log('AuthProvider: Making Supabase auth request...');
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('AuthProvider: SignIn result:', { error, userData: data?.user?.id ? 'User found' : 'No user' });
      
      if (error) {
        console.error('AuthProvider: Supabase auth error:', error);
        
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes and try again.';
        }
        
        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        // Log failed login attempts for admin routes
        if (isAdminLogin) {
          logAdminSecurityEvent({
            type: 'LOGIN_FAILED',
            email: email,
            details: `Failed admin login attempt: ${error.message}`
          });
        }
        
        return { error };
      }
      
      // Additional admin verification after successful login
      if (isAdminLogin && data?.user) {
        console.log('AuthProvider: Verifying admin access after successful login');
        
        try {
          // Check user profile for admin role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', data.user.id)
            .maybeSingle();
          
          console.log('AuthProvider: Profile check result:', { profile, profileError });
          
          // Check both profile and user metadata for admin role
          const userMetadataType = data.user.user_metadata?.user_type;
          const profileType = profile?.user_type;
          
          const isAdminUser = userMetadataType === 'admin' || profileType === 'admin';
          
          if (!isAdminUser) {
            console.log('AuthProvider: User is not admin, signing out');
            
            // Sign out the user immediately
            await supabase.auth.signOut();
            
            const accessError = new Error('Access denied. Your account does not have admin privileges.');
            
            toast({
              title: "Access Denied",
              description: "Your account does not have admin privileges.",
              variant: "destructive"
            });
            
            logAdminSecurityEvent({
              type: 'UNAUTHORIZED_ACCESS',
              email: email,
              userId: data.user.id,
              details: 'User logged in but does not have admin role'
            });
            
            return { error: accessError };
          }
          
          console.log('AuthProvider: Admin access verified');
        } catch (verificationError) {
          console.error('AuthProvider: Error verifying admin access:', verificationError);
          
          // Sign out on verification error
          await supabase.auth.signOut();
          
          const error = new Error('Unable to verify admin access. Please try again.');
          toast({
            title: "Verification Error",
            description: "Unable to verify admin access. Please try again.",
            variant: "destructive"
          });
          
          return { error };
        }
      }
      
      console.log('AuthProvider: Sign in successful');
      
      // Log successful admin logins
      if (isAdminLogin) {
        logAdminSecurityEvent({
          type: 'LOGIN_SUCCESS',
          email: email,
          details: 'Successful admin login'
        });
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('AuthProvider: SignIn unexpected error:', error);
      
      // More detailed error logging
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      toast({
        title: "Sign In Error",
        description: `Connection error: ${error.message || 'Please check your internet connection and try again.'}`,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: SignOut attempt');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      console.log('AuthProvider: SignOut result:', { error });
      
      // Clear local state immediately regardless of error
      setSession(null);
      setUser(null);
      setIsPasswordReset(false);
      
      if (error) {
        // Log the error but don't throw it - handle gracefully
        console.error('AuthProvider: Sign out error (handled gracefully):', error);
        
        // For session missing errors, don't show error toast
        if (error.message && error.message.includes('session')) {
          console.log('AuthProvider: Session already cleared, sign out completed');
        } else {
          // Only show toast for unexpected errors
          toast({
            title: "Sign Out Notice",
            description: "You have been signed out.",
          });
        }
      } else {
        console.log('AuthProvider: Sign out successful');
      }
    } catch (error) {
      console.error('AuthProvider: Sign out unexpected error:', error);
      
      // Always clear local state even on unexpected errors
      setSession(null);
      setUser(null);
      setIsPasswordReset(false);
      
      // Don't throw the error - handle gracefully
      toast({
        title: "Signed Out",
        description: "You have been signed out.",
      });
    }
  };

  const resetPassword = async (email: string) => {
    console.log('AuthProvider: Password reset attempt:', { email });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });
      
      console.log('AuthProvider: Password reset result:', { error });
      
      if (error) {
        toast({
          title: "Password Reset Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('AuthProvider: Password reset unexpected error:', error);
      toast({
        title: "Password Reset Error",
        description: "An unexpected error occurred during password reset.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    console.log('AuthProvider: Password update attempt');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      console.log('AuthProvider: Password update result:', { error });
      
      if (error) {
        toast({
          title: "Password Update Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password Updated Successfully",
          description: "Your password has been updated successfully.",
        });
        setIsPasswordReset(false);
      }
      
      return { error };
    } catch (error: any) {
      console.error('AuthProvider: Password update unexpected error:', error);
      toast({
        title: "Password Update Error",
        description: "An unexpected error occurred during password update.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    isPasswordReset,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };

  console.log('AuthProvider: Current auth state:', {
    userId: user?.id,
    userEmail: user?.email,
    loading,
    hasSession: !!session,
    isPasswordReset
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
