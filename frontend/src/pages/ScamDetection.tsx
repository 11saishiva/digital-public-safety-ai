import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eraser, ScanSearch, Clock, Cpu, CalendarClock, Percent } from "lucide-react";
import { Textarea } from "../components/Textarea";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Loader } from "../components/Loader";
import { PredictionChip, RiskBadge, Badge } from "../components/Badge";
import { ErrorState } from "../components/StateViews";
import { useScamPredict } from "../hooks/useScam";
import { formatConfidence, formatDate, formatMs } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import type { ScamPredictRequest } from "../types";

export function ScamDetection() {
  const { register, handleSubmit, reset: resetForm, watch } = useForm<ScamPredictRequest>({
    defaultValues: { message: "" },
  });
  const [lastMessage, setLastMessage] = useState("");
  const { mutate, data, isPending, isError, error, reset } = useScamPredict();
  const { showToast } = useToast();
  const message = watch("message");

  const onSubmit = (values: ScamPredictRequest) => {
    if (!values.message.trim()) return;
    setLastMessage(values.message);
    mutate(values, {
      onError: (err) => showToast("error", err instanceof ApiError ? err.message : "Prediction failed."),
      onSuccess: () => showToast("success", "Analysis complete."),
    });
  };

  const handleClear = () => {
    resetForm({ message: "" });
    reset();
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Scam Detection</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Paste a suspicious SMS, email, or chat message to check it for scam patterns.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Textarea
            label="Message"
            placeholder="Congratulations! You have won ₹10,00,000. Claim now by clicking…"
            {...register("message", { required: true })}
          />
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleClear} className="flex-1">
              <Eraser className="h-4 w-4" /> Clear
            </Button>
            <Button type="submit" loading={isPending} disabled={!message?.trim()} className="flex-1">
              <ScanSearch className="h-4 w-4" /> Analyze
            </Button>
          </div>
        </form>
      </Card>

      {isPending && (
        <Card>
          <Loader label="Analyzing message…" />
        </Card>
      )}

      {isError && (
        <ErrorState
          message={error instanceof ApiError ? error.message : "Prediction failed."}
          onRetry={() => onSubmit({ message: lastMessage })}
        />
      )}

      {data && !isPending && (
        <Card className="animate-fade-up flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-ink">Result</h2>
            <div className="flex items-center gap-2">
              <PredictionChip prediction={data.prediction} />
              <RiskBadge risk={data.risk_level} />
            </div>
          </div>

          {data.detected_patterns.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Detected patterns</p>
              <div className="flex flex-wrap gap-1.5">
                {data.detected_patterns.map((p) => (
                  <Badge key={p} tone="warning">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <Stat icon={Percent} label="Confidence" value={formatConfidence(data.confidence)} />
            <Stat icon={Clock} label="Processing time" value={formatMs(data.processing_time_ms)} />
            <Stat icon={Cpu} label="Model version" value={data.model_version} />
            <Stat icon={CalendarClock} label="Timestamp" value={formatDate(data.created_at)} />
          </dl>
        </Card>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 text-teal" strokeWidth={1.9} />
      <div>
        <dt className="text-xs text-ink-muted">{label}</dt>
        <dd className="font-mono-data text-sm font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
