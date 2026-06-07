import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Rocket,
  Boxes,
  Radio,
  Cat,
  Webhook,
  Settings2,
  Languages,
  Gauge,
  Shield,
  Sparkles,
  ArrowRight,
  Github,
  BookOpen,
  Activity,
  Server,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBstatsLatest } from "@/lib/bstats";
import { fetchLatestVersion, fetchDownloadStats } from "@/lib/versions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Advanced Delivery Drones — Minecraft Paper Plugin" },
      {
        name: "description",
        content:
          "Physical drone deliveries for Minecraft Paper servers — visible flight, package inventories, sockets, animal transport, Discord webhooks and configurable GUIs.",
      },
      { property: "og:title", content: "Advanced Delivery Drones" },
      {
        property: "og:description",
        content:
          "Physical drone deliveries for Minecraft Paper servers — visible flight, sockets, animal transport, GUIs.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const features = [
  {
    icon: Rocket,
    title: "Physical drone flight",
    desc: "Real armor-stand drones with launch animations, cruise speed, smooth landing and cross-dimension routing.",
  },
  {
    icon: Boxes,
    title: "Package inventories",
    desc: "9–54 slot compose GUIs. Recipients open the package after landing. Auto-return on expiry.",
  },
  {
    icon: Radio,
    title: "Delivery sockets",
    desc: "Place personal delivery points with trust lists, blacklists and chest/hopper auto-unload.",
  },
  {
    icon: Cat,
    title: "Animal transport",
    desc: "Send animals via GUI. Radius-based selection with full NBT persistence. Invulnerable in transit.",
  },
  {
    icon: Webhook,
    title: "Discord webhooks",
    desc: "Rich embeds for sent, delivered, declined, cancelled and expired drones.",
  },
  {
    icon: Settings2,
    title: "Fully configurable GUIs",
    desc: "Customize every menu via gui.yml. Live reload with /drone reload.",
  },
  {
    icon: Languages,
    title: "6 languages built-in",
    desc: "de_DE, en_EN, es_ES, fr_FR, ru_RU, zh_CN with MiniMessage formatting.",
  },
  {
    icon: Gauge,
    title: "Performance tuned",
    desc: "Cached landing spots, precomputed flight paths and throttled rendering for busy servers.",
  },
  {
    icon: Shield,
    title: "Hierarchical permissions",
    desc: "Fine-grained nodes for every command — send, sockets, blacklist, admin.",
  },
];

function Home() {
  const stats = useQuery({
    queryKey: ["bstats-home"],
    queryFn: fetchBstatsLatest,
    staleTime: 1000 * 60 * 5,
  });

  const version = useQuery({
    queryKey: ["version-latest"],
    queryFn: fetchLatestVersion,
    staleTime: 1000 * 60 * 60, // cache for 1 hour
  });

  const allDownloads = useQuery({
    queryKey: ["downloads-total"],
    queryFn: fetchDownloadStats,
    staleTime: 1000 * 60 * 60,
  });

  const downloads = allDownloads.data?.total || 0;
  
  const showConfettiRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (downloads <= 0 || showConfettiRef.current) return;

    showConfettiRef.current = true;
    
    // Clean up any existing animation
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const colors = ['#4682b4', '#5f9ea0', '#87ceeb', '#87cefa', '#b0c4de', '#add8e6'];
    
    let iterations = 0;
    const maxIterations = 30; // More iterations for better effect
    
    const frame = () => {
      if (iterations >= maxIterations) {
        animationFrameIdRef.current = null;
        return;
      }

      confetti({
        particleCount: 5,
        startVelocity: 5,
        ticks: 200,
        gravity: 0.5,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.3 - 0.3
        },
        colors: colors,
        shapes: ['circle'],
        scalar: Math.random() * 0.8 + 0.5,
        zIndex: 9999,
        disableForReducedMotion: true
      });

      iterations++;
      animationFrameIdRef.current = requestAnimationFrame(frame);
    };

    // Small delay for visual polish
    setTimeout(frame, 500);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [downloads]);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="container-page py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {downloads > 0 && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="card-surface mx-auto inline-flex items-center gap-3 border border-[var(--color-border)] px-6 py-3 shadow-sm transition-all">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                    <Rocket className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium tracking-wide text-foreground">
                    Thank you for <span className="font-bold">{downloads.toLocaleString()}</span> downloads!
                  </span>
                </div>
              </div>
            )}
            <span className="badge-soft">
              <Sparkles className="h-3.5 w-3.5" /> Version {version.data?.latestVersion || "1.0.7"} · Paper 1.20+
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
              Physical drone deliveries for{" "}
              <span className="text-gradient-brand">Minecraft Paper</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Visible flight, package inventories, sockets, animal transport, Discord webhooks
              and fully configurable GUIs — built for production servers.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/docs" className="btn-brand">
                <BookOpen className="h-4 w-4" /> Read the docs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/EinfachJan7/AdvancedDeliveryDrones"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <Github className="h-4 w-4" /> View on GitHub
              </a>
            </div>
          </div>

          {/* Live stats strip */}
          <div className="mx-auto mt-16 grid max-w-3xl gap-3 sm:grid-cols-3">
            <StatChip
              icon={Server}
              label="Servers"
              value={stats.data?.servers}
              loading={stats.isLoading}
            />
            <StatChip
              icon={Users}
              label="Players"
              value={stats.data?.players}
              loading={stats.isLoading}
            />
            <Link to="/stats" className="card-surface flex items-center justify-between gap-3 px-5 py-4 transition hover:border-[var(--color-ring)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                  <Activity className="h-4 w-4 text-[var(--brand-glow)]" />
                </div>
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Live data
                  </div>
                  <div className="text-sm font-semibold">View dashboard</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to ship deliveries
          </h2>
          <p className="mt-4 text-muted-foreground">
            From flight physics to admin commands — every system is built for real servers,
            with persistence, performance and configurability in mind.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                <f.icon className="h-5 w-5 text-[var(--brand-glow)]" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quickstart CTA */}
      <section className="container-page py-20">
        <div className="card-surface relative overflow-hidden p-10 md:p-14">
          <div
            className="absolute inset-0 -z-10 opacity-50"
            style={{ background: "var(--gradient-hero)" }}
            aria-hidden
          />
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Get your first drone in the air
              </h2>
              <p className="mt-3 text-muted-foreground">
                Drop the jar into your <code className="code-inline">plugins/</code> folder,
                restart, and run <code className="code-inline">/drone</code>. The compose GUI
                walks players through the rest.
              </p>
              <Link to="/docs" className="btn-brand mt-6">
                View documentation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <pre className="code-block text-xs leading-relaxed md:text-sm">
{`# 1. Drop into plugins/
plugins/AdvancedDeliveryDrones-1.0.7.jar

# 2. Start the server
[INFO] [AdvancedDeliveryDrones] Enabled (Paper 1.20+)

# 3. Send your first drone
/drone send Notch

# Optional
/drone socket place HomeBase
/drone reload`}
            </pre>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function StatChip({
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
    <div className="card-surface flex items-center gap-3 px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]">
        <Icon className="h-4 w-4 text-[var(--brand-glow)]" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold tabular-nums">
          {loading ? "—" : value?.toLocaleString() ?? "0"}
        </div>
      </div>
    </div>
  );
}
