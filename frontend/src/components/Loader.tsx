import { ScanLine } from "lucide-react";

export function Loader({ label = "Analyzing..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-ink-muted">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal/30" />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-navy">
          <ScanLine className="h-5 w-5 text-teal" strokeWidth={2} />
        </span>
      </div>
      <p className="font-mono-data text-sm font-medium tracking-wide">{label}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-sunken ${className}`} />;
}

export function ReportCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex gap-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}
