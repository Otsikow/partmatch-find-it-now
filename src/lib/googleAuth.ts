import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type GoogleAccountType = "owner" | "supplier";

const PENDING_GOOGLE_ROLE_KEY = "partmatch_pending_google_role";
const PENDING_ROLE_TTL_MS = 10 * 60 * 1000;
const NEW_ACCOUNT_WINDOW_MS = 5 * 60 * 1000;

interface PendingGoogleRole {
  role: GoogleAccountType;
  startedAt: number;
}

const readPendingRole = (): PendingGoogleRole | null => {
  try {
    const rawValue = localStorage.getItem(PENDING_GOOGLE_ROLE_KEY);
    if (!rawValue) return null;

    const value = JSON.parse(rawValue) as PendingGoogleRole;
    const isValidRole = value.role === "owner" || value.role === "supplier";
    const isFresh = Date.now() - value.startedAt <= PENDING_ROLE_TTL_MS;

    if (!isValidRole || !isFresh) {
      localStorage.removeItem(PENDING_GOOGLE_ROLE_KEY);
      return null;
    }

    return value;
  } catch {
    localStorage.removeItem(PENDING_GOOGLE_ROLE_KEY);
    return null;
  }
};

export const clearPendingGoogleRole = () => {
  localStorage.removeItem(PENDING_GOOGLE_ROLE_KEY);
};

export const beginGoogleSignIn = async (role: GoogleAccountType) => {
  const pendingRole: PendingGoogleRole = { role, startedAt: Date.now() };
  localStorage.setItem(PENDING_GOOGLE_ROLE_KEY, JSON.stringify(pendingRole));

  const result = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "online",
        prompt: "select_account",
      },
    },
  });

  if (result.error) clearPendingGoogleRole();
  return result;
};

const isNewGoogleAccount = (user: User) => {
  if (user.app_metadata?.provider !== "google") return false;

  const createdAt = Date.parse(user.created_at);
  const lastSignInAt = user.last_sign_in_at
    ? Date.parse(user.last_sign_in_at)
    : createdAt;

  if (!Number.isFinite(createdAt) || !Number.isFinite(lastSignInAt)) return false;

  return (
    Date.now() - createdAt <= NEW_ACCOUNT_WINDOW_MS &&
    Math.abs(lastSignInAt - createdAt) <= NEW_ACCOUNT_WINDOW_MS
  );
};

export const finaliseGoogleSignIn = async (user: User) => {
  const pendingRole = readPendingRole();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  let resolvedRole = profile?.user_type ?? "owner";

  // Existing accounts keep their established role. Only a just-created Google
  // account may receive the role selected immediately before OAuth started.
  if (pendingRole && isNewGoogleAccount(user) && pendingRole.role !== resolvedRole) {
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ user_type: pendingRole.role })
      .eq("id", user.id)
      .select("user_type")
      .single();

    if (updateError) throw updateError;
    resolvedRole = updatedProfile.user_type;
  }

  clearPendingGoogleRole();
  localStorage.setItem("userType", resolvedRole);
  return resolvedRole;
};

export const dashboardForRole = (role: string | null | undefined) => {
  if (role === "admin") return "/admin";
  if (role === "supplier") return "/seller-dashboard";
  return "/buyer-dashboard";
};
