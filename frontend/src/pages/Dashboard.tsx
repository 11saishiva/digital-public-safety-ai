import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ScanEye,
  MessageSquareWarning,
  ShieldAlert,
  TriangleAlert,
  ArrowRight,
  ImageOff,
  MessageSquareText,
} from "lucide-react";
import { Card } from "../components/Card";
import { PredictionChip, RiskBadge } from "../components/Badge";
import { ErrorState } from "../components/StateViews";
import { Skeleton } from "../components/Loader";
import { EmptyState } from "../components/StateViews";
import { useCounterfeitReports } from "../hooks/useCounterfeit";
import { useScamReports } from "../hooks/useScam";
import { formatConfidence, formatDate, truncate } from "../utils/format";
import { ApiError } from "../api/client";
import type { CounterfeitReport, ScamReport } from "../types";

// Dashboard aggregates client-side from the existing list endpoints.
// Swap SAMPLE_SIZE / these hooks for a dedicated /analytics endpoint if the
// backend adds one later — the page only needs { items, total } shaped data.
const SAMPLE_SIZE = 100;

const CHART_COLORS = {
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  teal: "#0D9488",
  navy: "#0F2A47",
  muted: "#CBD5E1",
};

export function Dashboard() {
  const counterfeitQuery = useCounterfeitReports({ page: 1, page_size: SAMPLE_SIZE });
  const scamQuery = useScamReports({ page: 1, page_size: SAMPLE_SIZE });
  const navigate = useNavigate();

  const isLoading = counterfeitQuery.isLoading || scamQuery.isLoading;
  const isError = counterfeitQuery.isError || scamQuery.isError;

  const counterfeitItems = counterfeitQuery.data?.items ?? [];
  const scamItems = scamQuery.data?.items ?? [];

  const stats = useMemo(() => {
    const counterfeitCount = counterfeitItems.filter((r) => r.prediction === "FAKE" || r.prediction === "COUNTERFEIT").length;
    const genuineCount = counterfeitItems.length - counterfeitCount;
    const scamCount = scamItems.filter((r) => r.prediction === "SCAM").length;
    const highRiskCount = scamItems.filter((r) => r.risk_level === "HIGH").length;

    const totalScans = counterfeitQuery.data?.total ?? counterfeitItems.length;
    const totalMessages = scamQuery.data?.total ?? scamItems.length;

    return {
      totalScans,
      totalMessages,
      counterfeitRate: counterfeitItems.length ? counterfeitCount / counterfeitItems.length : 0,
      scamRate: scamItems.length ? scamCount / scamItems.length : 0,
      highRiskCount,
      currencyPie: [
        { name: "Genuine", value: genuineCount, color: CHART_COLORS.success },
        { name: "Counterfeit", value: counterfeitCount, color: CHART_COLORS.danger },
      ],
      riskBars: [
        { name: "Low", value: scamItems.filter((r) => r.risk_level === "LOW").length, color: CHART_COLORS.success },
        { name: "Medium", value: scamItems.filter((r) => r.risk_level === "MEDIUM").length, color: CHART_COLORS.warning },
        { name: "High", value: scamItems.filter((r) => r.risk_level === "HIGH").length, color: CHART_COLORS.danger },
      ],
    };
  }, [counterfeitItems, scamItems, counterfeitQuery.data?.total, scamQuery.data?.total]);

  const recentActivity = useMemo(() => {
    type Row =
      | { kind: "counterfeit"; report: CounterfeitReport }
      | { kind: "scam"; report: ScamReport };
    const rows: Row[] = [
      ...counterfeitItems.map((report): Row => ({ kind: "counterfeit", report })),
      ...scamItems.map((report): Row => ({ kind: "scam", report })),
    ];
    return rows
      .sort((a, b) => new Date(b.report.created_at).getTime() - new Date(a.report.created_at).getTime())
      .slice(0, 6);
  }, [counterfeitItems, scamItems]);

  if (isError) {
    return (
      <ErrorState
        message={
          counterfeitQuery.error instanceof ApiError
            ? counterfeitQuery.error.message
            : scamQuery.error instanceof ApiError
            ? scamQuery.error.message
            : "Failed to load dashboard data."
        }
        onRetry={() => {
          counterfeitQuery.refetch();
          scamQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">
          A live snapshot across counterfeit currency and scam message detection.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={ScanEye}
            label="Currency notes scanned"
            value={stats.totalScans.toLocaleString()}
            tone="navy"
          />
          <StatCard
            icon={ShieldAlert}
            label="Counterfeit rate"
            value={formatConfidence(stats.counterfeitRate)}
            tone="danger"
          />
          <StatCard
            icon={MessageSquareWarning}
            label="Messages analyzed"
            value={stats.totalMessages.toLocaleString()}
            tone="navy"
          />
          <StatCard
            icon={TriangleAlert}
            label="High-risk messages"
            value={stats.highRiskCount.toLocaleString()}
            tone="warning"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-base font-semibold text-ink">Currency verdicts</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Genuine vs. counterfeit across sampled scans</p>
          {isLoading ? (
            <Skeleton className="mt-4 h-56 w-full" />
          ) : counterfeitItems.length === 0 ? (
            <EmptyState
              title="No counterfeit scans yet"
              icon={<ImageOff className="h-6 w-6" strokeWidth={1.75} />}
            />
          ) : (
            <div className="mt-2 flex items-center gap-4">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.currencyPie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {stats.currencyPie.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #E1E7EC",
                        fontSize: 12,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex shrink-0 flex-col gap-2 pr-2">
                {stats.currencyPie.map((entry) => (
                  <li key={entry.name} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-ink-muted">{entry.name}</span>
                    <span className="font-mono-data font-semibold text-ink">{entry.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-base font-semibold text-ink">Message risk levels</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Distribution of risk across analyzed messages</p>
          {isLoading ? (
            <Skeleton className="mt-4 h-56 w-full" />
          ) : scamItems.length === 0 ? (
            <EmptyState
              title="No scam scans yet"
              icon={<MessageSquareText className="h-6 w-6" strokeWidth={1.75} />}
            />
          ) : (
            <div className="mt-2 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.riskBars} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E1E7EC" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#5B6472", fontFamily: "JetBrains Mono, monospace" }}
                    axisLine={{ stroke: "#E1E7EC" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#5B6472", fontFamily: "JetBrains Mono, monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#EEF2F5" }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E1E7EC",
                      fontSize: 12,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {stats.riskBars.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Recent activity</h2>
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-1 text-xs font-semibold text-action hover:text-action-hover"
          >
            View all reports <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <EmptyState title="No activity yet" description="Predictions from either module will appear here." />
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {recentActivity.map((row) => (
              <li
                key={`${row.kind}-${row.report.id}`}
                className="flex cursor-pointer items-center gap-3 py-3 hover:bg-surface-sunken/50"
                onClick={() => navigate(`/reports/${row.kind}/${row.report.id}`)}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy text-teal">
                  {row.kind === "counterfeit" ? (
                    <ScanEye className="h-4 w-4" strokeWidth={1.9} />
                  ) : (
                    <MessageSquareWarning className="h-4 w-4" strokeWidth={1.9} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">
                    {row.kind === "counterfeit" ? "Currency note scan" : truncate(row.report.message, 60)}
                  </p>
                  <p className="text-xs text-ink-muted">{formatDate(row.report.created_at)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PredictionChip prediction={row.report.prediction} />
                  {row.kind === "scam" && <RiskBadge risk={row.report.risk_level} />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  tone: "navy" | "danger" | "warning";
}) {
  const toneStyles = {
    navy: "bg-navy text-teal",
    danger: "bg-danger-light text-danger",
    warning: "bg-warning-light text-warning",
  };
  return (
    <Card className="flex flex-col gap-3">
      <span className={`flex h-9 w-9 items-center justify-center rounded-md ${toneStyles[tone]}`}>
        <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
      </span>
      <div>
        <p className="font-mono-data text-xl font-bold text-ink">{value}</p>
        <p className="text-xs text-ink-muted">{label}</p>
      </div>
    </Card>
  );
}
