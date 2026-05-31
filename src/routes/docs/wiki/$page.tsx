import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/docs/wiki/$page")({
  head: ({ params }) => {
    const pageTitle = params.page
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      meta: [
        { title: `${pageTitle} — Advanced Delivery Drones Wiki` },
        {
          name: "description",
          content: `${pageTitle} documentation for Advanced Delivery Drones plugin.`,
        },
        { property: "og:title", content: `${pageTitle} — Wiki` },
        { property: "og:description", content: `${pageTitle} documentation.` },
        { property: "og:url", content: `/docs/wiki/${params.page}` },
      ],
      links: [{ rel: "canonical", href: `/docs/wiki/${params.page}` }],
    };
  },
  component: WikiPage,
});

interface WikiContent {
  content: string;
  title: string;
}

function WikiPage() {
  const { page } = Route.useParams();
  const [content, setContent] = useState<WikiContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWiki = async () => {
      try {
        setLoading(true);
        setError(null);

        // Map URL-friendly names to markdown files
        const pageMap: Record<string, string> = {
          "getting-started": "getting-started",
          commands: "commands",
          permissions: "permissions",
          features: "features",
          "delivery-sockets": "delivery-sockets",
          configuration: "configuration",
          troubleshooting: "troubleshooting",
          index: "index",
        };

        const fileName = pageMap[page] || page;

        // Try to load from public/wiki directory
        const response = await fetch(`/wiki/${fileName}.md`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(`Wiki page "${page}" not found.`);
          } else {
            setError(`Failed to load wiki page: ${response.statusText}`);
          }
          return;
        }

        const markdownContent = await response.text();

        // Extract first heading as title
        const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : page;

        setContent({
          content: markdownContent,
          title: title,
        });
      } catch (err) {
        setError(
          `Error loading wiki page: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadWiki();
  }, [page]);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <a href="/" className="hover:text-slate-900 dark:hover:text-slate-200">
                Home
              </a>
              <span>/</span>
              <a href="/docs/wiki/index" className="hover:text-slate-900 dark:hover:text-slate-200">
                Wiki
              </a>
              <span>/</span>
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {content?.title || "Loading..."}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading wiki page...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6">
              <h2 className="text-red-900 dark:text-red-200 font-semibold mb-2">
                Error Loading Page
              </h2>
              <p className="text-red-800 dark:text-red-300 text-sm sm:text-base">{error}</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                <a
                  href="/docs/wiki/index"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center text-sm sm:text-base"
                >
                  Back to Wiki Index
                </a>
                <a
                  href="/"
                  className="inline-block px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg transition-colors text-center text-sm sm:text-base"
                >
                  Home
                </a>
              </div>
            </div>
          ) : content ? (
            <>
              <article className="prose prose-sm sm:prose md:prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.content}
                </ReactMarkdown>
              </article>

              {/* Related Links */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Other Wiki Pages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { name: "getting-started", label: "Getting Started" },
                    { name: "commands", label: "Commands Reference" },
                    { name: "permissions", label: "Permissions Guide" },
                    { name: "features", label: "Features Guide" },
                    { name: "delivery-sockets", label: "Delivery Sockets" },
                    { name: "configuration", label: "Configuration Guide" },
                    { name: "troubleshooting", label: "Troubleshooting" },
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={`/docs/wiki/${link.name}`}
                      className={`p-3 rounded-lg border text-sm sm:text-base transition-all ${
                        page === link.name
                          ? "bg-blue-100 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800"
                          : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {link.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </SiteLayout>
  );
}
