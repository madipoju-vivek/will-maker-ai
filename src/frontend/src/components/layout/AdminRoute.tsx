import { FullPageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { ShieldOff } from "lucide-react";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading, isInitializing } = useAuth();

  if (isInitializing || isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    window.location.replace("/signin");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
          <div className="rounded-full bg-destructive/10 p-4">
            <ShieldOff className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to view this page. Admin access is
            required.
          </p>
          <a
            href="/dashboard"
            className="text-sm text-primary hover:underline"
            data-ocid="admin_denied.dashboard_link"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
