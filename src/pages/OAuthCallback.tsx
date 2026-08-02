import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { dashboardForRole, finaliseGoogleSignIn } from "@/lib/googleAuth";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const completeSignIn = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!data.session?.user) throw new Error("Google did not return a valid session.");

      const role = await finaliseGoogleSignIn(data.session.user);
      if (active) navigate(dashboardForRole(role), { replace: true });
    };

    completeSignIn().catch((callbackError: unknown) => {
      if (!active) return;
      setError(
        callbackError instanceof Error
          ? callbackError.message
          : "Google sign-in could not be completed."
      );
    });

    return () => {
      active = false;
    };
  }, [navigate]);

  if (error) {
    return <Navigate to={`/auth?oauth_error=${encodeURIComponent(error)}`} replace />;
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <section className="apple-surface w-full max-w-sm p-8 text-center" aria-live="polite">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Finishing sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Securing your PartMatch account and opening your dashboard.
        </p>
        <Loader2 className="mx-auto mt-6 h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      </section>
    </main>
  );
};

export default OAuthCallback;
