import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface RootLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
  className?: string;
}

export function RootLayout({
  children,
  fullWidth = false,
  noPadding = false,
  className,
}: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main
        className={cn(
          "flex-1",
          !noPadding &&
            !fullWidth &&
            "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6",
          !noPadding && fullWidth && "w-full",
          className,
        )}
      >
        {children}
      </main>
      <footer className="border-t border-border bg-card/60 px-4 py-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Will Maker AI. All rights
            reserved.
          </p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
