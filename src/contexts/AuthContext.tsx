import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  isAuthorizedAdminEmail,
  logAdminSecurityEvent,
} from "@/utils/adminSecurity";


interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileLoading: boolean; // New state for profile loading
  isPasswordReset: boolean;
  userType: string | null;
  firstName: string | null;
  signUp: (
    email: string,
    password: string,
    userData: any
  ) => Promise<{ error: any }>;
  signIn: (
    email: string,
    password: string,
    userType?: "owner" | "supplier"
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  // Initialize userType from localStorage if available
  const [userType, setUserType] = useState<string | null>(() => {
    try {
      return localStorage.getItem("userType");
    } catch {
      return null;
    }
  });
  const [firstName, setFirstName] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type, first_name")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (profile) {
        const profileUserType = profile.user_type;
        setUserType(profileUserType);
        setFirstName(profile.first_name);
        
        // Persist user type to localStorage for refresh persistence
        if (profileUserType) {
          localStorage.setItem("userType", profileUserType);
          console.log("AuthProvider: Stored userType in localStorage:", profileUserType);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");

    // Check URL for password reset
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken && refreshToken) {
      setIsPasswordReset(true);
      // Set the session from URL params
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed:", event, {
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userMetadata: session?.user?.user_metadata,
        emailConfirmed: session?.user?.email_confirmed_at,
      });
      
      // Debug: Check for auth errors
      if (!session && event === 'SIGNED_OUT') {
        console.log("AuthProvider: User signed out");
      } else if (!session && event === 'TOKEN_REFRESHED') {
        console.error("AuthProvider: Token refresh failed - session is null");
      } else if (!session) {
        console.warn("AuthProvider: No session available for event:", event);
      }

      // Check if this is a password recovery session
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordReset(true);
      } else if (event === "SIGNED_IN" && isPasswordReset) {
        // Keep password reset mode active during password reset flow
        setIsPasswordReset(true);
      } else if (event === "SIGNED_OUT") {
        setIsPasswordReset(false);
        setUserType(null);
        setFirstName(null);
        // Clear localStorage on sign out
        localStorage.removeItem("userType");
      }

      // Update session and user state
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch user profile if user is logged in
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }

      setLoading(false);
    });

    // Get initial session with domain-specific debugging
    const currentDomain = window.location.hostname;
    console.log("AuthProvider: Getting initial session for domain:", currentDomain);
    console.log("AuthProvider: localStorage check:", {
      hasAuthToken: !!localStorage.getItem('sb-ytgmzhevgcmvevuwkocz-auth-token'),
      hasUserType: !!localStorage.getItem('userType'),
      domain: currentDomain,
      localStorageKeys: Object.keys(localStorage).filter(key => key.includes('sb-ytgmzhevgcmvevuwkocz'))
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("AuthProvider: Initial session check:", {
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userMetadata: session?.user?.user_metadata,
        emailConfirmed: session?.user?.email_confirmed_at,
        domain: currentDomain,
        hasAccessToken: !!session?.access_token,
        tokenExpiry: session?.expires_at ? new Date(session.expires_at * 1000) : null,
        error
      });

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else if (currentDomain.includes('partmatch.app')) {
        // For production domain, try to recover session from localStorage
        console.log("AuthProvider: No session on production, checking localStorage recovery options");
        const storedAuth = localStorage.getItem('sb-ytgmzhevgcmvevuwkocz-auth-token');
        if (storedAuth) {
          console.log("AuthProvider: Found stored auth token, attempting recovery");
          try {
            const authData = JSON.parse(storedAuth);
            if (authData.access_token && authData.refresh_token) {
              supabase.auth.setSession({
                access_token: authData.access_token,
                refresh_token: authData.refresh_token
              }).then(({ data, error }) => {
                console.log("AuthProvider: Session recovery result:", { success: !!data.session, error });
              });
            }
          } catch (e) {
            console.error("AuthProvider: Error parsing stored auth:", e);
          }
        }
      }

      setLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [isPasswordReset]);

  const signUp = async (email: string, password: string, userData: any) => {
    // Validate required fields
    const requiredFields = ["first_name", "last_name", "phone", "location"];
    const missingFields = requiredFields.filter(
      (field) => !userData[field] || userData[field].trim() === ""
    );

    if (!email || email.trim() === "") {
      const error = new Error("Email is required");
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return { error };
    }

    if (!password || password.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return { error };
    }

    if (missingFields.length > 0) {
      const error = new Error(
        `Required fields missing: ${missingFields.join(", ")}`
      );
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return { error };
    }

    // Prevent admin registration from public forms
    if (userData.user_type === "admin") {
      console.log(
        "AuthProvider: Admin signup attempt blocked - not allowed from public form"
      );

      const error = new Error(
        "Admin registration is not allowed from this form. Contact system administrator."
      );
      toast({
        title: "Access Denied",
        description:
          "Admin registration is not allowed from this form. Contact system administrator.",
        variant: "destructive",
      });

      logAdminSecurityEvent({
        type: "UNAUTHORIZED_ACCESS",
        email: email,
        details: "Attempted admin registration from public form",
      });

      return { error };
    }

    // Ensure user_type is included in metadata
    const finalUserData = {
      ...userData,
      user_type: userData.user_type || "owner", // Default to 'owner'
    };

    const redirectUrl = `${window.location.origin}/`;

    try {
      // Test Supabase connectivity first
      console.log("AuthProvider: Testing Supabase connectivity...");
      const { data: testData, error: testError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);

      console.log("AuthProvider: Attempting Supabase signup...");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: finalUserData,
        },
      });

      console.log("AuthProvider: SignUp result:", { error });
      console.log(
        "AuthProvider: Full error details:",
        JSON.stringify(error, null, 2)
      );

      if (error) {
        let errorMessage = error.message;

        // Handle specific error cases with user-friendly messages
        if (error.message.includes("User already registered")) {
          errorMessage =
            "This email is already registered. Please use another email or try signing in.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage =
            "Please verify your email address before signing in. Check your inbox for a confirmation email.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message.includes("Weak password")) {
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
        } else if (error.message.includes("Database error saving new user")) {
          console.error(
            "AuthProvider: Database error during signup. Full error:",
            error
          );
          errorMessage =
            "Unable to create account due to a server error. Please try again in a moment.";
        }

        toast({
          title: "Sign Up Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful!",
          description:
            "Please check your email and click the verification link before signing in.",
        });
      }

      return { error };
    } catch (error: any) {
      console.error("AuthProvider: SignUp unexpected error:", error);
      console.error(
        "AuthProvider: Error details:",
        JSON.stringify(error, null, 2)
      );

      let errorMessage = "An unexpected error occurred during sign up.";

      // Handle network/connectivity errors specifically
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Network connection error. Please check your internet connection and try again.";
      } else if (error.message.includes("CORS")) {
        errorMessage =
          "Connection error due to browser security settings. Please try refreshing the page.";
      } else if (error.message.includes("duplicate key value")) {
        errorMessage =
          "This email is already registered. Please use another email.";
      }

      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (
    email: string,
    password: string,
    userType?: "owner" | "supplier"
  ) => {
    console.log("AuthProvider: SignIn attempt:", { email, userType });

    // For admin login attempts, validate email authorization first
    const urlPath = window.location.pathname;
    const isAdminLogin = urlPath.includes("admin");

    if (isAdminLogin) {
      console.log("AuthProvider: Admin signin attempt for email:", email);

      if (!isAuthorizedAdminEmail(email)) {
        const error = new Error(
          "Access denied. This email is not authorized for admin access."
        );
        toast({
          title: "Access Denied",
          description: "This email is not authorized for admin access.",
          variant: "destructive",
        });

        logAdminSecurityEvent({
          type: "UNAUTHORIZED_ACCESS",
          email: email,
          details: "Attempted admin signin with unauthorized email",
        });

        return { error };
      }
    }

    try {
      console.log("AuthProvider: Making Supabase auth request...");
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      await localStorage.setItem("profiles", JSON.stringify(data?.user));
      console.log("AuthProvider: SignIn result:", {
        error,
        userData: data?.user?.id ? "User found" : "No user",
        emailConfirmed: data?.user?.email_confirmed_at,
      });

      if (error) {
        console.error("AuthProvider: Supabase auth error:", error);

        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes("Invalid login credentials")) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage =
            "Please verify your email address before signing in. Check your inbox for a confirmation email.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage =
            "Too many login attempts. Please wait a few minutes and try again.";
        }

        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });

        // Log failed login attempts for admin routes
        if (isAdminLogin) {
          logAdminSecurityEvent({
            type: "LOGIN_FAILED",
            email: email,
            details: `Failed admin login attempt: ${error.message}`,
          });
        }

        return { error };
      }

      // Check if email is confirmed
      if (data?.user && !data.user.email_confirmed_at) {
        console.log("AuthProvider: Email not confirmed, signing out user");

        // Sign out the user immediately
        await supabase.auth.signOut();

        const emailError = new Error(
          "Please verify your email address before signing in. Check your inbox for a confirmation email."
        );

        toast({
          title: "Email Verification Required",
          description:
            "Please verify your email address before signing in. Check your inbox for a confirmation email.",
          variant: "destructive",
        });

        return { error: emailError };
      }
      if (userType && data?.user) {
        console.log("AuthProvider: Verifying user type for:", userType);

        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", data.user.id)
            .maybeSingle();

          console.log("AuthProvider: Profile lookup result:", { profile, profileError });

          // Get user type from both sources
          const profileUserType = profile?.user_type;
          const metadataUserType = data.user.user_metadata?.user_type;
          
          console.log("AuthProvider: User types found:", { 
            profileUserType, 
            metadataUserType, 
            expectedType: userType 
          });

          // For seller login, check if user is supplier in metadata or profile
          // Also allow if they're trying to login as supplier but currently marked as owner
          if (userType === "supplier") {
            const isSupplierInMetadata = metadataUserType === "supplier";
            const isSupplierInProfile = profileUserType === "supplier";
            const isOwnerButSigningUpAsSupplier = profileUserType === "owner" && metadataUserType === "supplier";
            
            if (!isSupplierInMetadata && !isSupplierInProfile && !isOwnerButSigningUpAsSupplier) {
              console.log("AuthProvider: User is not a supplier, signing out");

              await supabase.auth.signOut();

              const accessError = new Error(
                "Access denied. You are not registered as a seller."
              );

              toast({
                title: "Access Denied",
                description: "Only registered sellers can access this dashboard. Please register as a seller first.",
                variant: "destructive",
              });

              return { error: accessError };
            }
            
            // If user has supplier in metadata but owner in profile, update the profile
            if (metadataUserType === "supplier" && profileUserType === "owner") {
              console.log("AuthProvider: Updating profile user_type from owner to supplier");
              
              try {
                await supabase
                  .from("profiles")
                  .update({ user_type: "supplier" })
                  .eq("id", data.user.id);
                  
                console.log("AuthProvider: Profile updated successfully");
              } catch (updateError) {
                console.error("AuthProvider: Failed to update profile:", updateError);
                // Don't fail the login for this, just log it
              }
            }
          } else if (userType === "owner") {
            // For buyer login, verify they are actually an owner/buyer
            const userTypeToCheck = profileUserType || metadataUserType;
            
            console.log("AuthProvider: Verifying buyer access:", { 
              profileUserType, 
              metadataUserType, 
              userTypeToCheck 
            });
            
            if (userTypeToCheck === "admin") {
              console.log("AuthProvider: Admin trying to access buyer login");

              await supabase.auth.signOut();

              const accessError = new Error(
                "Access denied. Admins cannot access buyer accounts."
              );

              toast({
                title: "Access Denied",
                description: "Admins cannot access buyer accounts.",
                variant: "destructive",
              });

              return { error: accessError };
            }
            
            // Block suppliers from accessing buyer accounts
            if (userTypeToCheck === "supplier") {
              console.log("AuthProvider: Supplier trying to access buyer login");

              await supabase.auth.signOut();

              const accessError = new Error(
                "Access denied. Sellers cannot access buyer accounts. Please use the seller login."
              );

              toast({
                title: "Access Denied",
                description: "Sellers cannot access buyer accounts. Please use the seller login.",
                variant: "destructive",
              });

              return { error: accessError };
            }
            
            // If no user type found, default to owner (for new users)
            if (!userTypeToCheck) {
              console.log("AuthProvider: No user type found, defaulting to owner for buyer login");
            }
          }

          console.log("AuthProvider: User type verification successful");
        } catch (verificationError) {
          console.error(
            "AuthProvider: Error verifying user type:",
            verificationError
          );

          // Don't sign out for verification errors, just log them
          console.log("AuthProvider: Continuing login despite verification error");
        }
      }

      // Additional admin verification after successful login
      if (isAdminLogin && data?.user) {
        console.log(
          "AuthProvider: Verifying admin access after successful login"
        );

        try {
          // Check user profile for admin role
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", data.user.id)
            .maybeSingle();

          console.log("AuthProvider: Profile check result:", {
            profile,
            profileError,
          });

          // Check both profile and user metadata for admin role
          const userMetadataType = data.user.user_metadata?.user_type;
          const profileType = profile?.user_type;

          const isAdminUser =
            userMetadataType === "admin" || profileType === "admin";

          if (!isAdminUser) {
            console.log("AuthProvider: User is not admin, signing out");

            // Sign out the user immediately
            await supabase.auth.signOut();

            const accessError = new Error(
              "Access denied. Your account does not have admin privileges."
            );

            toast({
              title: "Access Denied",
              description: "Your account does not have admin privileges.",
              variant: "destructive",
            });

            logAdminSecurityEvent({
              type: "UNAUTHORIZED_ACCESS",
              email: email,
              userId: data.user.id,
              details: "User logged in but does not have admin role",
            });

            return { error: accessError };
          }

          console.log("AuthProvider: Admin access verified");
        } catch (verificationError) {
          console.error(
            "AuthProvider: Error verifying admin access:",
            verificationError
          );

          // Sign out on verification error
          await supabase.auth.signOut();

          const error = new Error(
            "Unable to verify admin access. Please try again."
          );
          toast({
            title: "Verification Error",
            description: "Unable to verify admin access. Please try again.",
            variant: "destructive",
          });

          return { error };
        }
      }

      console.log("AuthProvider: Sign in successful");

      // Log successful admin logins
      if (isAdminLogin) {
        logAdminSecurityEvent({
          type: "LOGIN_SUCCESS",
          email: email,
          details: "Successful admin login",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error("AuthProvider: SignIn unexpected error:", error);

      // More detailed error logging
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      toast({
        title: "Sign In Error",
        description: `Connection error: ${
          error.message ||
          "Please check your internet connection and try again."
        }`,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    console.log("🔐 AuthProvider: SignOut attempt started");

    try {
      // Use signOut with scope 'global' to sign out from all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });

      console.log("AuthProvider: SignOut result:", { error });

      // Clear ALL local state and storage immediately
      setSession(null);
      setUser(null);
      setIsPasswordReset(false);
      setUserType(null);
      setFirstName(null);
      
      // Clear all relevant localStorage items
      localStorage.removeItem("userType");
      localStorage.removeItem("profiles");
      
      // Clear Supabase auth tokens from localStorage
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('sb-ytgmzhevgcmvevuwkocz') || 
        key.includes('auth-token') ||
        key.includes('supabase')
      );
      authKeys.forEach(key => localStorage.removeItem(key));
      
      console.log("AuthProvider: Cleared localStorage keys:", authKeys);

      if (error) {
        // Log the error but don't throw it - handle gracefully
        console.error(
          "AuthProvider: Sign out error (handled gracefully):",
          error
        );

        // For session missing errors, don't show error toast
        if (error.message && error.message.includes("session")) {
          console.log(
            "AuthProvider: Session already cleared, sign out completed"
          );
        } else {
          // Only show toast for unexpected errors
          toast({
            title: "Sign Out Notice",
            description: "You have been signed out.",
          });
        }
      } else {
        console.log("AuthProvider: Sign out successful");
        toast({
          title: "Signed Out",
          description: "You have been signed out successfully.",
        });
      }

      // Force redirect to auth page to prevent automatic re-login
      window.location.href = "/auth";
    } catch (error) {
      console.error("AuthProvider: Sign out unexpected error:", error);

      // Always clear local state even on unexpected errors
      setSession(null);
      setUser(null);
      setIsPasswordReset(false);
      setUserType(null);
      setFirstName(null);
      
      // Clear all relevant localStorage items
      localStorage.removeItem("userType");
      localStorage.removeItem("profiles");
      
      // Clear Supabase auth tokens from localStorage
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('sb-ytgmzhevgcmvevuwkocz') || 
        key.includes('auth-token') ||
        key.includes('supabase')
      );
      authKeys.forEach(key => localStorage.removeItem(key));

      // Don't throw the error - handle gracefully
      toast({
        title: "Signed Out",
        description: "You have been signed out.",
      });

      // Redirect to auth page even on error
      window.location.href = "/auth";
    }
  };

  const resetPassword = async (email: string) => {
    console.log("AuthProvider: Password reset attempt:", { email });

    // Determine redirect URL based on current path
    const isSellerAuth = window.location.pathname.includes("seller");
    const isBuyerAuth = window.location.pathname.includes("buyer");
    const redirectPath = isSellerAuth
      ? "/seller-auth"
      : isBuyerAuth
      ? "/buyer-auth"
      : "/buyer-auth";

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${redirectPath}`,
      });

      console.log("AuthProvider: Password reset result:", { error });

      if (error) {
        toast({
          title: "Password Reset Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Reset Email Sent",
          description:
            "Please check your email for password reset instructions.",
        });
      }

      return { error };
    } catch (error: any) {
      console.error("AuthProvider: Password reset unexpected error:", error);
      toast({
        title: "Password Reset Error",
        description: "An unexpected error occurred during password reset.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    console.log("AuthProvider: Password update attempt");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      console.log("AuthProvider: Password update result:", { error });

      if (error) {
        toast({
          title: "Password Update Error",
          description: error.message,
          variant: "destructive",
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
      console.error("AuthProvider: Password update unexpected error:", error);
      toast({
        title: "Password Update Error",
        description: "An unexpected error occurred during password update.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    profileLoading,
    isPasswordReset,
    userType,
    firstName,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  console.log("AuthProvider: Current auth state:", {
    userId: user?.id,
    userEmail: user?.email,
    loading,
    hasSession: !!session,
    isPasswordReset,
    userType,
    firstName,
    emailConfirmed: user?.email_confirmed_at,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
