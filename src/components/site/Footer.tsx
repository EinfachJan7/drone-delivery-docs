import { Link } from "@tanstack/react-router";
import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-base font-semibold">Advanced Delivery Drones</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Physical drone deliveries for Minecraft Paper servers — visible flight, package
              inventories, sockets, animal transport and fully configurable GUIs.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Apache-2.0 License · Built by{" "}
              <a
                href="https://github.com/EinfachJan7"
                target="_blank"
                rel="noreferrer"
                className="text-foreground hover:text-[var(--brand-glow)]"
              >
                EinfachJan7
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Documentation
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/docs" hash="commands" className="nav-link">Commands</Link></li>
              <li><Link to="/docs" hash="permissions" className="nav-link">Permissions</Link></li>
              <li><Link to="/docs" hash="placeholders" className="nav-link">PlaceholderAPI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  className="nav-link inline-flex items-center gap-1"
                  href="https://github.com/EinfachJan7/AdvancedDeliveryDrones"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a
                  className="nav-link inline-flex items-center gap-1"
                  href="https://bstats.org/plugin/bukkit/AdvancedDeliveryDrones/31663"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> bStats
                </a>
              </li>
              <li><Link to="/stats" className="nav-link">Live Stats</Link></li>
              <li><Link to="/roadmap" className="nav-link">Roadmap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
