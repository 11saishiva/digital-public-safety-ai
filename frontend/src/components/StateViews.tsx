import type { ReactNode } from "react";
import { Inbox, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/60 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken text-ink-muted">
        {icon ?? <Inbox className="h-6 w-6" strokeWidth={1.75} />}
      </div>
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/25 bg-danger-light px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-danger">
        <WifiOff className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <p className="max-w-sm text-sm font-medium text-[#7F1D1D]">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </Button>
      )}
    </div>
  );
}
