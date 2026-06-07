import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useQuery } from "@tanstack/react-query";
import { getAllVersions } from "@/lib/versions";
import {
  Package,
  Calendar,
  Download,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ModrinthVersion } from "@/lib/versions";

export const Route = createFileRoute("/versions")({
  head: () => ({
    meta: [
      { title: "Version History — Advanced Delivery Drones" },
      {
        name: "description",
        content:
          "Complete version history for Advanced Delivery Drones. Browse all releases with changelogs, compatibility information, and download links.",
      },
      {
        property: "og:title",
        content: "Version History — Advanced Delivery Drones",
      },
      {
        property: "og:description",
        content:
          "Complete version history for Advanced Delivery Drones. Browse all releases with changelogs and compatibility information.",
      },
      { property: "og:url", content: "/versions" },
    ],
    links: [{ rel: "canonical", href: "/versions" }],
  }),
  component: VersionsPage,
});

function VersionsPage() {
  const versions = useQuery({
    queryKey: ["modrinth-versions"],
    queryFn: () => getAllVersions(50),
    staleTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 60,
  });

  return (
    <SiteLayout>
      <section className="container-page py-16 relative">
        {/* Decorative background glow */}
        <div className="absolute top-10 right-10 -z-10 h-64 w-64 rounded-full bg-[var(--brand-glow)] opacity-10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="relative z-10">
            <span className="badge-soft">
              <Package className="h-3.5 w-3.5" /> Version history
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              All releases
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Complete version history for Advanced Delivery Drones. All releases from Modrinth
              with detailed changelogs and compatibility information.
            </p>
          </div>
          <button
            onClick={() => versions.refetch()}
            className="btn-ghost"
          >
            <RefreshCw className={`h-4 w-4 ${versions.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {versions.isError && (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
            <div>
              <div className="font-medium">Unable to load versions</div>
              <div className="text-muted-foreground">
                Failed to fetch version data from Modrinth. Please try again later.
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          {versions.isLoading ? (
            <div className="space-y-10 relative border-l-2 border-white/10 ml-4 pl-8 md:ml-8 md:pl-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[41px] md:-left-[57px] top-4 h-4 w-4 rounded-full bg-white/10 ring-4 ring-background" />
                  <div className="card-surface p-6 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="h-6 w-24 bg-white/10 rounded"></div>
                        <div className="h-5 w-16 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-8 w-24 bg-white/10 rounded-md"></div>
                    </div>
                    <div className="mt-4 h-4 w-64 bg-white/5 rounded"></div>
                    <div className="mt-4 flex gap-2">
                      <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                      <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : versions.data && versions.data.length > 0 ? (
            <div className="space-y-12 relative border-l-2 border-white/10 ml-4 pl-8 md:ml-8 md:pl-12">
              {versions.data.map((version) => (
                <VersionCard key={version.id} version={version} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-border bg-card/50 py-12">
              <div className="text-sm text-muted-foreground">No versions found</div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function VersionCard({ version }: { version: ModrinthVersion }) {
  const [expanded, setExpanded] = useState(false);
  const primaryFile = version.files.find((f) => f.primary) || version.files[0];
  
  const toggleExpanded = () => setExpanded(!expanded);
  
  const publishDate = (() => {
    try {
      const date = new Date(version.date_published);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  })();

  return (
    <div className="relative group">
      {/* Timeline Node */}
      <div className={`absolute -left-[41px] md:-left-[57px] top-6 h-4 w-4 rounded-full ring-4 ring-background transition-colors duration-300 ${version.featured ? 'bg-[var(--brand-glow)] shadow-[0_0_15px_var(--brand-glow)]' : 'bg-white/20 group-hover:bg-white/40'}`} />
      
      {/* Date Indicator (Optional Desktop Only) */}
      <div className="hidden lg:block absolute -left-[200px] top-5 text-sm text-muted-foreground font-medium w-[120px] text-right">
        {publishDate}
      </div>

      <div className={`card-surface overflow-hidden p-6 transition-all duration-300 hover:border-[var(--color-ring)]/50 hover:shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)] ${version.featured ? 'border-[var(--brand-glow)]/30' : ''}`}>
        <div
          className="flex cursor-pointer items-start justify-between gap-4"
          onClick={toggleExpanded}
        >
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold">{version.version_number}</h3>
              {version.featured && (
                <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-glow)] uppercase tracking-wider">
                  Featured
                </span>
              )}
            <span className="rounded-full bg-zinc-900/80 border border-white/5 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {version.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 lg:hidden">
              <Calendar className="h-4 w-4" />
              {publishDate}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md bg-zinc-900/80 px-2 py-1 text-xs font-medium text-emerald-400" title="Modrinth Downloads">
                <Download className="h-3.5 w-3.5" />
                {parseInt(version.downloads).toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-zinc-900/80 px-2 py-1 text-xs font-medium text-sky-400" title="Hangar Downloads">
                <Download className="h-3.5 w-3.5" />
                {(version.hangar_downloads || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-zinc-900/80 px-2 py-1 text-xs font-medium text-orange-400" title="Spigot Downloads">
                <Download className="h-3.5 w-3.5" />
                {(version.spigot_downloads || 0).toLocaleString()}
              </div>
            </div>
            {primaryFile && (
              <div className="text-xs">
                {(primaryFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {version.game_versions.slice(0, 3).map((gv) => (
              <span
                key={gv}
                className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {gv}
              </span>
            ))}
            {version.game_versions.length > 3 && (
              <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                +{version.game_versions.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {primaryFile && (
            <a
              href={primaryFile.url}
              download
              onClick={(e) => e.stopPropagation()}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
          <button
             onClick={(e) => {
               e.stopPropagation();
               toggleExpanded();
             }}
             className="rounded-lg p-2 bg-zinc-900/50 hover:bg-[var(--color-accent)] transition-colors"
           >
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          {version.changelog && (
            <div>
              <h4 className="text-sm font-semibold">Changelog</h4>
              <div className="mt-2 rounded-lg bg-zinc-900/50 p-4 text-sm leading-relaxed text-muted-foreground prose prose-invert prose-sm">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline"
                      />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        {...props}
                        className="bg-zinc-900 px-1.5 py-0.5 rounded text-xs font-mono"
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre
                        {...props}
                        className="bg-zinc-900 p-3 rounded overflow-x-auto"
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul {...props} className="list-disc list-inside space-y-1" />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol {...props} className="list-decimal list-inside space-y-1" />
                    ),
                    li: ({ node, ...props }) => (
                      <li {...props} className="ml-2" />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 {...props} className="text-lg font-bold mt-3 mb-2" />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-base font-bold mt-2 mb-1" />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 {...props} className="text-sm font-semibold mt-2 mb-1" />
                    ),
                  }}
                >
                  {version.changelog}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {version.loaders && version.loaders.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold">Loaders</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {version.loaders.map((loader) => (
                  <span
                    key={loader}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {loader}
                  </span>
                ))}
              </div>
            </div>
          )}

          {version.game_versions && version.game_versions.length > 3 && (
            <div>
              <h4 className="text-sm font-semibold">All Minecraft Versions</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {version.game_versions.map((gv) => (
                  <span
                    key={gv}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {gv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {primaryFile && (
            <div className="flex gap-3">
              <a
                href={`https://modrinth.com/plugin/advanceddeliverydrones/version/${version.id}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on Modrinth
              </a>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
