import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ImageOff, MessageSquareText, Trash2, Eye, ScanEye, MessageSquareWarning } from "lucide-react";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { PredictionChip, RiskBadge } from "../components/Badge";
import { Pagination } from "../components/Pagination";
import { EmptyState, ErrorState } from "../components/StateViews";
import { ReportCardSkeleton } from "../components/Loader";
import { ConfirmDialog } from "../components/Modal";
import { useCounterfeitReports, useDeleteCounterfeitReport } from "../hooks/useCounterfeit";
import { useScamReports, useDeleteScamReport } from "../hooks/useScam";
import { formatConfidence, formatDate, truncate } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import type { ReportKind } from "../types";
import { getImageUrl } from "../utils/image";

const PAGE_SIZE = 8;

export function Reports() {
  const [tab, setTab] = useState<ReportKind>("counterfeit");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const switchTab = (t: ReportKind) => {
    setTab(t);
    setSearch("");
    setPage(1);
  };

  const counterfeitQuery = useCounterfeitReports({ page, page_size: PAGE_SIZE, search });
  const scamQuery = useScamReports({ page, page_size: PAGE_SIZE, search });
  const query = tab === "counterfeit" ? counterfeitQuery : scamQuery;

  const deleteCounterfeit = useDeleteCounterfeitReport();
  const deleteScam = useDeleteScamReport();
  const deleteMutation = tab === "counterfeit" ? deleteCounterfeit : deleteScam;

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete, {
      onSuccess: () => {
        showToast("success", "Report deleted.");
        setPendingDelete(null);
      },
      onError: (err) => {
        showToast("error", err instanceof ApiError ? err.message : "Failed to delete report.");
        setPendingDelete(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Reports</h1>
        <p className="mt-1 text-sm text-ink-muted">Every prediction the platform has recorded, in one place.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <TabButton active={tab === "counterfeit"} onClick={() => switchTab("counterfeit")} icon={ScanEye}>
            Counterfeit
          </TabButton>
          <TabButton active={tab === "scam"} onClick={() => switchTab("scam")} icon={MessageSquareWarning}>
            Scam
          </TabButton>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <Input
            placeholder="Search reports…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {query.isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))}
        </div>
      )}

      {query.isError && (
        <ErrorState
          message={query.error instanceof ApiError ? query.error.message : "Failed to load reports."}
          onRetry={() => query.refetch()}
        />
      )}

      {query.isSuccess && query.data.items.length === 0 && (
        <EmptyState
          title="No reports yet"
          description={
            tab === "counterfeit"
              ? "Predictions from the Counterfeit Detection module will show up here."
              : "Predictions from the Scam Detection module will show up here."
          }
        />
      )}

      {query.isSuccess && query.data.items.length > 0 && (
        <div className="flex flex-col gap-3">
          {tab === "counterfeit"
            ? counterfeitQuery.data?.items.map((r) => (
                <Card key={r.id} className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-sunken">
                    {r.image_path ? (
                      <img src={getImageUrl(r.image_path)} alt={r.filename} className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <PredictionChip prediction={r.prediction} />
                      <span className="font-mono-data text-xs text-ink-muted">
                        {formatConfidence(r.confidence)} confidence
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-ink-muted">{formatDate(r.created_at)}</p>
                  </div>
                  <RowActions
                    onView={() => navigate(`/reports/counterfeit/${r.id}`)}
                    onDelete={() => setPendingDelete(r.id)}
                  />
                </Card>
              ))
            : scamQuery.data?.items.map((r) => (
                <Card key={r.id} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-sunken text-ink-muted">
                    <MessageSquareText className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{truncate(r.message, 100)}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <PredictionChip prediction={r.prediction} />
                      <RiskBadge risk={r.risk_level} />
                      <span className="font-mono-data text-xs text-ink-muted">{formatConfidence(r.confidence)}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-ink-muted">{formatDate(r.created_at)}</p>
                  </div>
                  <RowActions
                    onView={() => navigate(`/reports/scam/${r.id}`)}
                    onDelete={() => setPendingDelete(r.id)}
                  />
                </Card>
              ))}

          <Pagination page={page} pageSize={PAGE_SIZE} total={query.data.total} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete report"
        description="This report will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-navy text-white" : "text-ink-muted hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.9} />
      {children}
    </button>
  );
}

function RowActions({ onView, onDelete }: { onView: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <Button variant="ghost" size="sm" onClick={onView} aria-label="View details">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Delete report" className="hover:text-danger">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
