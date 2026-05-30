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
      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="badge-soft">
              <Package className="h-3.5 w-3.5" /> Version history
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
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

        <div className="mt-10 space-y-4">
          {versions.isLoading ? (
            <div className="flex items-center justify-center rounded-lg border border-border bg-card/50 py-12">
              <div className="text-sm text-muted-foreground">Loading versions…</div>
            </div>
          ) : versions.data && versions.data.length > 0 ? (
            versions.data.map((version) => (
              <VersionCard key={version.id} version={version} />
            ))
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
  
  const publishDate = (() => {
    try {
      const date = new Date(version.published);
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
    <div className="card-surface overflow-hidden p-6">
      <div
        className="flex cursor-pointer items-start justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{version.version_number}</h3>
            {version.featured && (
              <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-xs font-medium text-[var(--brand-glow)]">
                Featured
              </span>
            )}
            <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {version.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {publishDate}
            </div>
            <div className="flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              {version.downloads.toLocaleString()} downloads
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
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-2 hover:bg-zinc-900"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          {version.changelog && (
            <div>
              <h4 className="text-sm font-semibold">Changelog</h4>
              <div className="mt-2 rounded-lg bg-zinc-950 p-4 text-sm leading-relaxed text-muted-foreground prose prose-invert prose-sm">
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
  );
}
