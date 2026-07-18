import { ShieldCheck, ShieldAlert, TriangleAlert } from "lucide-react";
import type { CounterfeitPrediction, RiskLevel, ScamPrediction } from "../types";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "danger" | "warning" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-surface-sunken text-ink-muted border-border",
    success: "bg-success-light text-[#14532D] border-success/30",
    danger: "bg-danger-light text-[#7F1D1D] border-danger/30",
    warning: "bg-warning-light text-[#78350F] border-warning/30",
    info: "bg-teal-light text-[#134E4A] border-teal/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono-data ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PredictionChip({
  prediction,
}: {
  prediction: CounterfeitPrediction | ScamPrediction;
}) {
  const isPositive = prediction === "REAL" || prediction === "SAFE";
  const Icon = isPositive ? ShieldCheck : ShieldAlert;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm font-bold tracking-wide font-mono-data ${
        isPositive
          ? "border-success/40 bg-success-light text-[#14532D]"
          : "border-danger/40 bg-danger-light text-[#7F1D1D]"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={2.5} />
      {prediction}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, string> = {
    LOW: "border-success/40 bg-success-light text-[#14532D]",
    MEDIUM: "border-warning/40 bg-warning-light text-[#78350F]",
    HIGH: "border-danger/40 bg-danger-light text-[#7F1D1D]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-bold font-mono-data ${map[risk]}`}
    >
      <TriangleAlert className="h-3.5 w-3.5" strokeWidth={2.5} />
      {risk} RISK
    </span>
  );
}
