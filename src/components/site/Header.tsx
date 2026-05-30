import { Link, useRouterState } from "@tanstack/react-router";
import { Package, Github, MessageCircle } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/docs", label: "Docs" },
  { to: "/versions", label: "Versions" },
  { to: "/stats", label: "Live Stats" },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gradient-brand)] shadow-[var(--shadow-glow)]">
            <Package className="h-4 w-4 text-[var(--brand-foreground)]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Advanced Delivery Drones</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Paper Plugin · Docs
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              data-active={pathname === item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://discord.gg/rRMtZhhgDQ"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost h-9 px-3 text-xs"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Discord</span>
          </a>
          <a
            href="https://github.com/EinfachJan7/AdvancedDeliveryDrones"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost h-9 px-3 text-xs"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
