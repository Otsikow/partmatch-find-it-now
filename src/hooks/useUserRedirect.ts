
import { useAuth } from '@/contexts/AuthContext';

export const useUserRedirect = () => {
  const { user } = useAuth();

  // The redirection logic has been moved to DashboardRouter.tsx
  // This hook now primarily serves to provide user context if needed,
  // without performing any redirection side effects.

  return { user };
};
