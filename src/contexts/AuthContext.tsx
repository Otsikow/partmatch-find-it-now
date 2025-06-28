
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logAdminSecurityEvent, isAuthorizedAdminEmail, validateAdminPassword } from '@/utils/adminSecurity';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, {
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          userMetadata: session?.user?.user_metadata
        });
        
        // Log admin-related auth events
        if (session?.user?.email && isAuthorizedAdminEmail(session.user.email)) {
          if (event === 'SIGNED_IN') {
            logAdminSecurityEvent({
              type: 'LOGIN_SUCCESS',
              email: session.user.email,
              userId: session.user.id,
              details: 'Admin user signed in successfully'
            });
          }
        }
        
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
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('AuthProvider: SignUp attempt:', { email, userData });
    
    // Enhanced security for admin signups
    if (userData.user_type === 'admin') {
      // Check if email is authorized
      if (!isAuthorizedAdminEmail(email)) {
        logAdminSecurityEvent({
          type: 'UNAUTHORIZED_ACCESS',
          email,
          details: 'Attempted admin signup with unauthorized email'
        });
        
        const error = new Error('This email is not authorized for admin registration');
        toast({
          title: "Registration Denied",
          description: "This email is not authorized for admin access.",
          variant: "destructive"
        });
        return { error };
      }
      
      // Validate password strength for admin accounts
      const passwordValidation = validateAdminPassword(password);
      if (!passwordValidation.valid) {
        const error = new Error(passwordValidation.errors.join(', '));
        toast({
          title: "Password Requirements Not Met",
          description: passwordValidation.errors.join(' '),
          variant: "destructive"
        });
        return { error };
      }
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
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
      // Log admin signup failures
      if (userData.user_type === 'admin') {
        logAdminSecurityEvent({
          type: 'LOGIN_FAILED',
          email,
          details: `Admin signup failed: ${error.message}`
        });
      }
      
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive"
      });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: SignIn attempt:', { email });
    
    // Log admin login attempts
    if (isAuthorizedAdminEmail(email)) {
      logAdminSecurityEvent({
        type: 'LOGIN_ATTEMPT',
        email,
        details: 'Admin login attempt'
      });
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('AuthProvider: SignIn result:', { error });
    
    if (error) {
      // Log failed admin login attempts
      if (isAuthorizedAdminEmail(email)) {
        logAdminSecurityEvent({
          type: 'LOGIN_FAILED',
          email,
          details: `Admin login failed: ${error.message}`
        });
      }
      
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('AuthProvider: SignOut attempt');
    
    // Log admin signouts
    if (user?.email && isAuthorizedAdminEmail(user.email)) {
      logAdminSecurityEvent({
        type: 'ADMIN_ACTION',
        email: user.email,
        userId: user.id,
        details: 'Admin user signed out'
      });
    }
    
    const { error } = await supabase.auth.signOut();
    
    console.log('AuthProvider: SignOut result:', { error });
    
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  console.log('AuthProvider: Current auth state:', {
    userId: user?.id,
    userEmail: user?.email,
    loading,
    hasSession: !!session
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
