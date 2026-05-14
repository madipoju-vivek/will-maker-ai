import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  badge?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  badge,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        {badge && (
          <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-primary/80 bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl truncate">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 mt-3 sm:mt-0 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
