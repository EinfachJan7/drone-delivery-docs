import {
  Check,
  Circle,
  Map,
  Rocket,
  Sparkles,
  Wrench,
  CalendarClock,
} from "lucide-react";
import {
  ROADMAP_ITEMS,
  getRoadmapProgress,
  type RoadmapItem,
  type RoadmapStatus,
} from "@/data/roadmap";

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  completed: "Shipped",
  "in-progress": "In progress",
  planned: "Planned",
};

const STATUS_GROUPS: {
  status: RoadmapStatus;
  title: string;
  description: string;
  icon: typeof Check;
}[] = [
  {
    status: "completed",
    title: "Shipped",
    description: "Features available in current releases.",
    icon: Check,
  },
  {
    status: "in-progress",
    title: "In development",
    description: "Actively being built for upcoming releases.",
    icon: Wrench,
  },
  {
    status: "planned",
    title: "Up next",
    description: "On the roadmap for future versions.",
    icon: CalendarClock,
  },
];

function StatusBadge({ status }: { status: RoadmapStatus }) {
  const styles: Record<RoadmapStatus, string> = {
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    "in-progress":
      "border-[var(--color-ring)]/40 bg-[var(--color-accent)] text-[var(--brand-glow)]",
    planned:
      "border-[var(--color-border)] bg-[oklch(1_0_0/0.03)] text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {status === "completed" && <Check className="h-3 w-3" strokeWidth={3} />}
      {status === "in-progress" && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-glow)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-glow)]" />
        </span>
      )}
      {status === "planned" && <Circle className="h-2.5 w-2.5" strokeWidth={2.5} />}
      {STATUS_LABEL[status]}
    </span>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const accent: Record<RoadmapStatus, string> = {
    completed: "roadmap-card--completed",
    "in-progress": "roadmap-card--active",
    planned: "roadmap-card--planned",
  };

  return (
    <article className={`roadmap-card ${accent[item.status]}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
          {item.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge status={item.status} />
          {item.targetVersion && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              v{item.targetVersion}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusGroup({
  title,
  description,
  icon: Icon,
  items,
  status,
}: {
  title: string;
  description: string;
  icon: typeof Check;
  items: RoadmapItem[];
  status: RoadmapStatus;
}) {
  if (items.length === 0) return null;

  const headerAccent: Record<RoadmapStatus, string> = {
    completed: "text-emerald-300",
    "in-progress": "text-[var(--brand-glow)]",
    planned: "text-muted-foreground",
  };

  return (
    <section className="roadmap-group">
      <div className="mb-5 flex items-start gap-3">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            status === "completed" &&
              "border-emerald-500/25 bg-emerald-500/10",
            status === "in-progress" &&
              "border-[var(--color-ring)]/30 bg-[var(--color-accent)]",
            status === "planned" &&
              "border-[var(--color-border)] bg-[oklch(1_0_0/0.03)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Icon className={`h-4 w-4 ${headerAccent[status]}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="ml-auto hidden rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs tabular-nums text-muted-foreground sm:inline">
          {items.length}
        </span>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <RoadmapCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RoadmapSection() {
  const progress = getRoadmapProgress();
  const grouped = STATUS_GROUPS.map((group) => ({
    ...group,
    items: ROADMAP_ITEMS.filter((item) => item.status === group.status),
  }));

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative border-b border-[var(--color-border)]/60">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="absolute top-16 right-[12%] hidden opacity-30 md:block">
          <Rocket className="h-14 w-14 animate-float text-[var(--brand-glow)]" />
        </div>
        <div className="container-page py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge-soft">
              <Map className="h-3.5 w-3.5" /> Development roadmap
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              What we&apos;re building
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A transparent look at shipped features, active development, and what&apos;s
              planned next for Advanced Delivery Drones.
            </p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="container-page py-12 md:py-14">
        <div className="roadmap-progress-panel">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-glow)]" />
                Overall progress
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-5xl font-bold tabular-nums text-gradient-brand">
                  {progress.percent}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress.completed} of {progress.total} features shipped
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard label="Shipped" value={progress.completed} variant="completed" />
              <StatCard label="In progress" value={progress.inProgress} variant="active" />
              <StatCard label="Planned" value={progress.planned} variant="planned" />
            </div>
          </div>

          <div className="roadmap-progress-track mt-8">
            <div
              className="roadmap-progress-fill"
              style={{ width: `${progress.percent}%` }}
              role="progressbar"
              aria-valuenow={progress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progress.percent}% of the roadmap complete`}
            />
          </div>
        </div>
      </section>

      {/* Grouped items */}
      <section className="container-page space-y-14 pb-20">
        {grouped.map((group) => (
          <StatusGroup key={group.status} {...group} />
        ))}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "completed" | "active" | "planned";
}) {
  const styles = {
    completed: "border-emerald-500/20 bg-emerald-500/[0.06]",
    active: "border-[var(--color-ring)]/25 bg-[var(--color-accent)]/40",
    planned: "border-[var(--color-border)] bg-[oklch(1_0_0/0.03)]",
  }[variant];

  const dot = {
    completed: "bg-emerald-400",
    active: "bg-[var(--brand-glow)]",
    planned: "bg-muted-foreground/50",
  }[variant];

  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${styles}`}>
      <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
