import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  FilePlus,
  LayoutDashboard,
  LogIn,
  Menu,
  Scale,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_LINKS_PUBLIC = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
];

const NAV_LINKS_AUTH = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "New Document", href: "/generator", icon: FilePlus },
];

function Logo() {
  return (
    <a
      href="/"
      className="flex items-center gap-2 group"
      data-ocid="nav.logo_link"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary glow-primary group-hover:scale-105 transition-smooth">
        <Scale className="h-4 w-4 text-white" />
      </div>
      <span className="font-display font-bold text-lg text-foreground">
        Will Maker <span className="text-primary">AI</span>
      </span>
    </a>
  );
}

export function Navbar() {
  const {
    isAuthenticated,
    isAdmin,
    isInitializing,
    isLoggingIn,
    signIn,
    signOut,
    profile,
  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCurrentPath = (href: string) =>
    typeof window !== "undefined" && window.location.pathname === href;

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md shadow-sm"
      data-ocid="nav.header"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {!isAuthenticated &&
            NAV_LINKS_PUBLIC.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                {link.label}
              </a>
            ))}

          {isAuthenticated &&
            NAV_LINKS_AUTH.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors",
                  isCurrentPath(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}_link`}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </a>
            ))}

          {isAuthenticated && isAdmin && (
            <a
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors",
                isCurrentPath("/admin")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              data-ocid="nav.admin_link"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </a>
          )}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {profile?.name ?? "User"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                data-ocid="nav.signout_button"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={signIn}
                disabled={isInitializing || isLoggingIn}
                data-ocid="nav.signin_button"
              >
                <LogIn className="h-4 w-4 mr-1.5" />
                {isInitializing ? "Loading…" : "Log In"}
              </Button>
              <Button
                size="sm"
                onClick={signIn}
                disabled={isInitializing || isLoggingIn}
                className="gradient-primary glow-primary border-0"
                data-ocid="nav.get_started_button"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              data-ocid="nav.mobile_menu_button"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 bg-card/95 backdrop-blur-lg border-border p-0"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
                {!isAuthenticated &&
                  NAV_LINKS_PUBLIC.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}

                {isAuthenticated &&
                  NAV_LINKS_AUTH.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  ))}

                {isAuthenticated && isAdmin && (
                  <a
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    data-ocid="nav.mobile_admin_link"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </a>
                )}
              </nav>

              <Separator />
              <div className="px-4 py-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground px-1">
                      Signed in as{" "}
                      <span className="font-medium text-foreground">
                        {profile?.name ?? "User"}
                      </span>
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      data-ocid="nav.mobile_signout_button"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full gradient-primary border-0"
                    onClick={() => {
                      signIn();
                      setMobileOpen(false);
                    }}
                    disabled={isInitializing || isLoggingIn}
                    data-ocid="nav.mobile_signin_button"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {isInitializing ? "Loading…" : "Get Started"}
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
