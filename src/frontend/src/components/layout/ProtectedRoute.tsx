import { FullPageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    // Use replaceState to avoid history pollution
    window.location.replace(redirectTo);
    return null;
  }

  return <>{children}</>;
}
