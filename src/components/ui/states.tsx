import { Loader2, type LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("size-5 animate-spin text-ink-secondary", className)}
      aria-hidden
    />
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 text-ink-secondary"
      role="status"
      aria-live="polite"
    >
      <Spinner />
      <span className="text-sm">{label}</span>
    </div>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-workspace text-ink-secondary">
          <Icon className="size-6" aria-hidden />
        </div>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-ink-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Button size="sm" variant="accent" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete this request. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface px-6 py-14 text-center"
      role="alert"
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-ink-secondary">
          {description}
        </p>
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
