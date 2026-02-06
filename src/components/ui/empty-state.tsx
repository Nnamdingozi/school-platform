"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type EmptyStateProps = {
  /** When true, shows loading skeleton instead of empty state */
  loading?: boolean;
  /** Optional icon (e.g. Lucide icon) shown above title when not loading */
  icon?: React.ReactNode;
  /** Main heading when not loading */
  title?: string;
  /** Supporting text when not loading */
  description?: string;
  /** Optional action button/link when not loading */
  action?: React.ReactNode;
  /** Extra class for the container */
  className?: string;
  /** Optional size: "sm" | "default" | "lg" */
  size?: "sm" | "default" | "lg";
};

export function EmptyState({
  loading = true,
  icon,
  title,
  description,
  action,
  className,
  size = "default",
}: EmptyStateProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-lg border border-border/50 bg-card/50 p-8 text-center",
          size === "sm" && "p-6",
          size === "lg" && "p-12",
          className
        )}
        aria-busy="true"
        aria-label="Loading"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Skeleton className="mx-auto h-5 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
          <Skeleton className="mx-auto h-4 w-56" />
        </div>
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-border/50 bg-card/50 p-8 text-center",
        size === "sm" && "p-6",
        size === "lg" && "p-12",
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:h-6 [&_svg]:w-6">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
      )}
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
