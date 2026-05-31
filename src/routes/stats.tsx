import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchBstatsLatest, fetchBstatsBreakdowns } from "@/lib/bstats";
import { fetchDownloadStats } from "@/lib/versions";
import {
  Activity,
  Server,
  Users,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Live Stats — Advanced Delivery Drones" },
      {
        name: "description",
        content:
          "Real-time bStats statistics for Advanced Delivery Drones: server count, players, Minecraft versions and platform breakdown.",
      },
      { property: "og:title", content: "Live Stats — Advanced Delivery Drones" },
      {
        property: "og:description",
        content:
          "Live bStats statistics for Advanced Delivery Drones plugin — server count, players and platform breakdowns.",
      },
      { property: "og:url", content: "/stats" },
    ],
    links: [{ rel: "canonical", href: "/stats" }],
  }),
  component: StatsPage,
});

const PIE_COLORS = [
  "oklch(0.78 0.16 215)",
  "oklch(0.7 0.18 160)",
  "oklch(0.75 0.18 80)",
  "oklch(0.7 0.2 320)",
  "oklch(0.72 0.2 30)",
  "oklch(0.68 0.16 260)",
  "oklch(0.75 0.14 195)",
];

function StatsPage() {
  const latest = useQuery({
    queryKey: ["bstats-latest"],
    queryFn: fetchBstatsLatest,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
  });

  const breakdowns = useQuery({
    queryKey: ["bstats-breakdowns"],
    queryFn: fetchBstatsBreakdowns,
    staleTime: 1000 * 60 * 5,
  });

  const downloads = useQuery({
    queryKey: ["download-stats"],
    queryFn: fetchDownloadStats,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 30,
  });

  return (
    <SiteLayout>
      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="badge-soft">
              <Activity className="h-3.5 w-3.5" /> Live data
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Plugin statistics
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Real-time data pulled from{" "}
              <a
                href="https://bstats.org/plugin/bukkit/AdvancedDeliveryDrones"
                className="text-foreground underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                bStats
              </a>
              ,{" "}
              <a
                href="https://modrinth.com/plugin/advanceddeliverydrones"
                className="text-foreground underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Modrinth
              </a>
              ,{" "}
              <a
                href="https://hangar.papermc.io/Baumkrieger69/AdvancedDeliveryDrones"
                className="text-foreground underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Hangar
              </a>
              , and{" "}
              <a
                href="https://www.spigotmc.org/resources/advanced-delivery-drones.135544/"
                className="text-foreground underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Spigot
              </a>
              . Usage metrics update every couple of minutes.
            </p>
          </div>
          <button
            onClick={() => {
              latest.refetch();
              breakdowns.refetch();
              downloads.refetch();
            }}
            className="btn-ghost"
          >
            <RefreshCw className={`h-4 w-4 ${latest.isFetching || downloads.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {latest.isError && (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
            <div>
              <div className="font-medium">Using demo data</div>
              <div className="text-muted-foreground">
                The bStats API is not available right now. Showing example statistics.
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            icon={Server}
            label="Active servers"
            value={latest.data?.servers}
            loading={latest.isLoading}
          />
          <Kpi
            icon={Users}
            label="Active players"
            value={latest.data?.players}
            loading={latest.isLoading}
          />
          <Kpi
            icon={Download}
            label="Total downloads"
            value={downloads.data?.total}
            loading={downloads.isLoading}
          />
          <a
            href="https://bstats.org/plugin/bukkit/AdvancedDeliveryDrones"
            target="_blank"
            rel="noreferrer"
            className="card-surface flex items-center justify-between gap-3 p-6 transition hover:border-[var(--color-ring)]"
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Source
              </div>
              <div className="mt-1 text-lg font-semibold">bStats dashboard</div>
              <div className="text-xs text-muted-foreground">Advanced Delivery Drones</div>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground" />
          </a>
        </div>

        {/* Time series */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <SeriesCard
            title="Servers (last 24h)"
            data={latest.data?.serversSeries}
            loading={latest.isLoading}
            color="oklch(0.78 0.16 215)"
          />
          <SeriesCard
            title="Players (last 24h)"
            data={latest.data?.playersSeries}
            loading={latest.isLoading}
            color="oklch(0.7 0.18 160)"
          />
        </div>

        {/* Breakdowns */}
        <h2 className="mt-14 text-2xl font-bold tracking-tight">Platform breakdown</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          What the community is running Advanced Delivery Drones on.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <PieCard
            title="Minecraft version"
            data={breakdowns.data?.minecraftVersion}
            loading={breakdowns.isLoading}
          />
          <PieCard
            title="Server software"
            data={breakdowns.data?.serverSoftware}
            loading={breakdowns.isLoading}
          />
          <PieCard
            title="Java version"
            data={breakdowns.data?.javaVersion}
            loading={breakdowns.isLoading}
          />
          <PieCard
            title="CPU cores"
            data={breakdowns.data?.coreCount}
            loading={breakdowns.isLoading}
          />
          <PieCard
            title="OS architecture"
            data={breakdowns.data?.osArch}
            loading={breakdowns.isLoading}
          />
        </div>

        {/* Download statistics */}
        <h2 className="mt-14 text-2xl font-bold tracking-tight">Download statistics</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Total downloads across all distribution platforms.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="card-surface p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Modrinth</div>
            <div className="mt-4 text-3xl font-bold tabular-nums">
              {downloads.isLoading ? "—" : (downloads.data?.modrinth ?? 0).toLocaleString()}
            </div>
            <a
              href="https://modrinth.com/plugin/advanceddeliverydrones"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm text-blue-500 hover:underline"
            >
              View on Modrinth →
            </a>
          </div>
          <div className="card-surface p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Hangar</div>
            <div className="mt-4 text-3xl font-bold tabular-nums">
              {downloads.isLoading ? "—" : (downloads.data?.hangar ?? 0).toLocaleString()}
            </div>
            <a
              href="https://hangar.papermc.io/Baumkrieger69/AdvancedDeliveryDrones"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm text-blue-500 hover:underline"
            >
              View on Hangar →
            </a>
          </div>
          <div className="card-surface p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Spigot</div>
            <div className="mt-4 text-3xl font-bold tabular-nums">
              {downloads.isLoading ? "—" : (downloads.data?.spigot ?? 0).toLocaleString()}
            </div>
            <a
              href="https://www.spigotmc.org/resources/advanced-delivery-drones.135544/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm text-blue-500 hover:underline"
            >
              View on Spigot →
            </a>
          </div>
          <div className="card-surface p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="mt-4 text-3xl font-bold tabular-nums">
              {downloads.isLoading ? "—" : (downloads.data?.total ?? 0).toLocaleString()}
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              All platforms combined
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof Server;
  label: string;
  value?: number;
  loading: boolean;
}) {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]">
          <Icon className="h-4 w-4 text-[var(--brand-glow)]" />
        </div>
      </div>
      <div className="mt-4 text-4xl font-bold tabular-nums">
        {loading ? "—" : (value ?? 0).toLocaleString()}
      </div>
    </div>
  );
}

function SeriesCard({
  title,
  data,
  loading,
  color,
}: {
  title: string;
  data?: Array<[number, number]>;
  loading: boolean;
  color: string;
}) {
  const formatted = useMemo(
    () =>
      (data ?? []).map(([t, v]) => ({
        t,
        label: new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        v,
      })),
    [data]
  );

  return (
    <div className="card-surface p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 h-56">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatted} margin={{ left: -10, right: 6, top: 6, bottom: 0 }}>
              <defs>
                <linearGradient id={`g-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="oklch(0.7 0.025 250)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis
                stroke="oklch(0.7 0.025 250)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.025 256)",
                  border: "1px solid oklch(0.3 0.025 256)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "oklch(0.97 0.005 250)",
                }}
                labelStyle={{ color: "oklch(0.97 0.005 250)" }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2}
                fill={`url(#g-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function PieCard({
  title,
  data,
  loading,
}: {
  title: string;
  data?: Array<{ name: string; y: number }>;
  loading: boolean;
}) {
  const empty = !loading && (!data || data.length === 0);
  return (
    <div className="card-surface p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-2 h-60">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : empty ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="y"
                nameKey="name"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={2}
                stroke="oklch(0.16 0.025 255)"
              >
                {data!.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.025 256)",
                  border: "1px solid oklch(0.3 0.025 256)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "oklch(0.97 0.005 250)",
                }}
                labelStyle={{ color: "oklch(0.97 0.005 250)" }}
                itemStyle={{ color: "oklch(0.97 0.005 250)" }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, color: "oklch(0.7 0.025 250)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
