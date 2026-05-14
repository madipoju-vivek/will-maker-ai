import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; up: boolean };
  isLoading?: boolean;
  className?: string;
  "data-ocid"?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  isLoading,
  className,
  "data-ocid": dataOcid,
}: StatsCardProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "glass rounded-xl p-5 flex flex-col gap-4 transition-smooth hover:border-primary/30",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-3xl font-display font-bold text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {trend && !isLoading && (
        <div
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit",
            trend.up
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive",
          )}
        >
          <span>{trend.up ? "↑" : "↓"}</span>
          <span>{trend.value} this month</span>
        </div>
      )}
    </div>
  );
}
