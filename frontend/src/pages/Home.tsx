import { NavLink } from "react-router-dom";
import { ScanEye, MessageSquareWarning, FolderClock, LayoutDashboard, ArrowUpRight } from "lucide-react";

const MODULES = [
  {
    to: "/counterfeit",
    title: "Counterfeit Detection",
    description: "Upload an image of an Indian currency note and get an instant genuine-or-counterfeit read.",
    icon: ScanEye,
    tag: "Image classification",
    enabled: true,
  },
  {
    to: "/scam",
    title: "Scam Detection",
    description: "Paste a suspicious message to flag scam language, risk level, and the exact patterns behind it.",
    icon: MessageSquareWarning,
    tag: "NLP · DistilBERT",
    enabled: true,
  },
  {
    to: "/reports",
    title: "Reports",
    description: "Browse every past prediction, filter by outcome, and open full detection detail on demand.",
    icon: FolderClock,
    tag: "History & audit",
    enabled: true,
  },
  {
    to: "/dashboard",
    title: "Dashboard",
    description: "Fraud network analysis and detection analytics across both models, in one operational view.",
    icon: LayoutDashboard,
    tag: "Analytics",
    enabled: true,
  },
];

export function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="animate-fade-up relative overflow-hidden rounded-2xl border border-border bg-navy px-6 py-12 sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 font-mono-data text-xs font-medium text-teal">
            Public Safety AI · Live Detection
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Verify currency and messages before fraud verifies you.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
            Two purpose-built AI models — one for counterfeit currency, one for scam messages — screening
            submissions in real time and logging every result for review.
          </p>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const content = (
              <>
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-teal">
                    <Icon className="h-5.5 w-5.5" strokeWidth={1.85} />
                  </span>
                  {mod.enabled ? (
                    <ArrowUpRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-action" />
                  ) : (
                    <span className="rounded-full bg-surface-sunken px-2 py-0.5 font-mono-data text-[10px] font-semibold text-ink-muted">
                      SOON
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{mod.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{mod.description}</p>
                <p className="mt-4 font-mono-data text-[11px] font-medium uppercase tracking-wide text-teal">
                  {mod.tag}
                </p>
              </>
            );

            return mod.enabled ? (
              <NavLink
                key={mod.to}
                to={mod.to}
                className="group rounded-xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-action/40 hover:shadow-md"
              >
                {content}
              </NavLink>
            ) : (
              <div
                key={mod.to}
                className="cursor-not-allowed rounded-xl border border-dashed border-border bg-surface/60 p-6 opacity-70"
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
