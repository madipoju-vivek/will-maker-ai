import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface LegalDisclaimerProps {
  variant?: "banner" | "inline";
  className?: string;
}

export function LegalDisclaimer({
  variant = "banner",
  className,
}: LegalDisclaimerProps) {
  if (variant === "inline") {
    return (
      <p
        className={cn(
          "text-xs text-muted-foreground italic flex items-start gap-1.5",
          className,
        )}
      >
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" />
        This platform does not replace licensed legal advice. Please consult a
        qualified attorney for your specific situation.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3",
        className,
      )}
      role="note"
      aria-label="Legal disclaimer"
      data-ocid="legal_disclaimer.banner"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
      <div className="text-sm">
        <span className="font-semibold text-accent">Disclaimer: </span>
        <span className="text-muted-foreground">
          This platform does not replace licensed legal advice. The documents
          generated here are for informational purposes only. Please consult a
          qualified attorney for your specific legal situation.
        </span>
      </div>
    </div>
  );
}
