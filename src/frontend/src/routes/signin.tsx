import { ProfileSetup } from "@/components/auth/ProfileSetup";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/signin")({ component: SignInPage });

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

function SignInPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, signIn, profile } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && isAuthenticated && profile !== null) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isInitializing, profile, navigate]);

  if (isInitializing || isLoggingIn) return <FullPageSpinner />;

  if (isAuthenticated && profile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <ProfileSetup onComplete={() => navigate({ to: "/dashboard" })} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        data-ocid="signin.card"
        className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-2">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            Sign in securely with Internet Identity to access your documents.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            data-ocid="signin.submit_button"
            className="w-full h-12 font-semibold"
            size="lg"
            onClick={signIn}
          >
            Sign In with Internet Identity
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            New to Will Maker AI?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Create an account
            </a>
          </p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground/60 text-center">
          This platform does not replace licensed legal advice.
        </p>
      </div>
    </div>
  );
}
