import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Copy, ImageOff, Clock, Cpu, CalendarClock, Percent } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { PredictionChip, RiskBadge, Badge } from "../components/Badge";
import { ErrorState } from "../components/StateViews";
import { Skeleton } from "../components/Loader";
import { ConfirmDialog } from "../components/Modal";
import { useCounterfeitReport, useDeleteCounterfeitReport } from "../hooks/useCounterfeit";
import { useScamReport, useDeleteScamReport } from "../hooks/useScam";
import { formatConfidence, formatDate } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import type { ReportKind } from "../types";
import { getImageUrl } from "../utils/image";

export function ReportDetail({ kind }: { kind: ReportKind }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const counterfeitQuery = useCounterfeitReport(kind === "counterfeit" ? id : undefined);
  const scamQuery = useScamReport(kind === "scam" ? id : undefined);
  const query = kind === "counterfeit" ? counterfeitQuery : scamQuery;

  const deleteCounterfeit = useDeleteCounterfeitReport();
  const deleteScam = useDeleteScamReport();
  const deleteMutation = kind === "counterfeit" ? deleteCounterfeit : deleteScam;

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast("success", "Report deleted.");
        navigate("/reports");
      },
      onError: (err) => {
        showToast("error", err instanceof ApiError ? err.message : "Failed to delete report.");
        setConfirmOpen(false);
      },
    });
  };

  const handleCopy = () => {
    if (!query.data) return;
    navigator.clipboard.writeText(JSON.stringify(query.data, null, 2));
    showToast("info", "Prediction details copied to clipboard.");
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/reports")}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to reports
        </button>
        {query.data && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        )}
      </div>

      {query.isLoading && (
        <Card className="flex flex-col gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </Card>
      )}

      {query.isError && (
        <ErrorState
          message={query.error instanceof ApiError ? query.error.message : "Failed to load report."}
          onRetry={() => query.refetch()}
        />
      )}

      {query.isSuccess && kind === "counterfeit" && counterfeitQuery.data && (
        <Card className="flex flex-col gap-5">
          <div className="scan-corner overflow-hidden rounded-lg border border-border bg-surface-sunken">
            {counterfeitQuery.data.image_path ? (
              
              <img src={getImageUrl(counterfeitQuery.data.image_path)} alt={counterfeitQuery.data.filename} className="max-h-80 w-full object-contain" />

            ) : (
              <div className="flex h-40 items-center justify-center text-ink-muted">
                <ImageOff className="h-8 w-8" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold text-ink">Counterfeit Report</h1>
            <PredictionChip prediction={counterfeitQuery.data.prediction} />
          </div>
          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <Stat icon={Percent} label="Confidence" value={formatConfidence(counterfeitQuery.data.confidence)} />
            <Stat icon={Cpu} label="Model version" value={counterfeitQuery.data.model_version} />
            <Stat icon={CalendarClock} label="Date" value={formatDate(counterfeitQuery.data.created_at)} />
          </dl>
        </Card>
      )}

      {query.isSuccess && kind === "scam" && scamQuery.data && (
        <Card className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold text-ink">Scam Report</h1>
            <div className="flex items-center gap-2">
              <PredictionChip prediction={scamQuery.data.prediction} />
              <RiskBadge risk={scamQuery.data.risk_level} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface-sunken p-4 text-sm leading-relaxed text-ink">
            {scamQuery.data.message}
          </div>
          {scamQuery.data.detected_patterns.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Detected patterns</p>
              <div className="flex flex-wrap gap-1.5">
                {scamQuery.data.detected_patterns.map((p) => (
                  <Badge key={p} tone="warning">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <Stat icon={Percent} label="Confidence" value={formatConfidence(scamQuery.data.confidence)} />
            <Stat icon={Clock} label="Processing time" value={`${scamQuery.data.processing_time_ms} ms`} />
            <Stat icon={Cpu} label="Model version" value={scamQuery.data.model_version} />
            <Stat icon={CalendarClock} label="Date" value={formatDate(scamQuery.data.created_at)} />
          </dl>
        </Card>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete report"
        description="This report will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
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
        <dd className="font-mono-data text-sm font-semibold text-ink break-all">{value}</dd>
      </div>
    </div>
  );
}
