import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border bg-card/50 p-8",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex size-10 items-center justify-center rounded-full border bg-muted">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>

      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">Please wait a moment...</p>
      </div>

      <span className="sr-only">{message}</span>
    </div>
  );
}
