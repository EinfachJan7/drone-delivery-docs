import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { BookOpen, Zap, Shield, Settings, Package, AlertCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/docs/wiki/")({
  head: () => ({
    meta: [
      { title: "Wiki — Advanced Delivery Drones Documentation" },
      {
        name: "description",
        content: "Complete wiki and documentation for Advanced Delivery Drones plugin. Commands, permissions, features, and troubleshooting guides.",
      },
      { property: "og:title", content: "Advanced Delivery Drones Wiki" },
      { property: "og:description", content: "Complete documentation and guides." },
      { property: "og:url", content: "/docs/wiki" },
    ],
    links: [{ rel: "canonical", href: "/docs/wiki" }],
  }),
  component: WikiIndexPage,
});

const mainGuides = [
  {
    title: "Getting Started",
    description: "New to Delivery Drones? Start here! Learn installation, basic concepts, and how to send your first drone.",
    icon: BookOpen,
    link: "/docs/wiki/getting-started",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Commands Reference",
    description: "Complete reference of all available commands with syntax, examples, and permissions required.",
    icon: Zap,
    link: "/docs/wiki/commands",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Permissions Guide",
    description: "Understand the permission hierarchy and learn how to control who can use what features.",
    icon: Shield,
    link: "/docs/wiki/permissions",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Features Guide",
    description: "Deep dive into all features: flight system, animals, sockets, tracking, and more.",
    icon: Package,
    link: "/docs/wiki/features",
    color: "from-green-500 to-teal-500",
  },
];

const advancedGuides = [
  {
    title: "Delivery Sockets",
    description: "Master delivery stations for automated logistics. Create, manage, and optimize sockets.",
    link: "/docs/wiki/delivery-sockets",
  },
  {
    title: "Configuration",
    description: "Customize every aspect of the plugin. Flight speeds, appearance, storage, and more.",
    link: "/docs/wiki/configuration",
  },
  {
    title: "Troubleshooting",
    description: "Problems? Find solutions to common issues, errors, and performance problems.",
    link: "/docs/wiki/troubleshooting",
  },
];

function WikiIndexPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Hero Section */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Documentation
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Advanced Delivery Drones Wiki
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
              Complete documentation, guides, and references for setting up and using the Advanced
              Delivery Drones plugin on your Minecraft server.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Quick Start Guides */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
              Quick Start Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainGuides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <a
                    key={guide.link}
                    href={guide.link}
                    className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${guide.color} transition-opacity`}
                    ></div>

                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-br ${guide.color} text-white`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">{guide.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Advanced Guides */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
              Advanced Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advancedGuides.map((guide) => (
                <a
                  key={guide.link}
                  href={guide.link}
                  className="group p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-all hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {guide.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{guide.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
              Popular Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: "How do I send a drone to another player?",
                  link: "/docs/wiki/commands#dronese",
                },
                {
                  q: "What are delivery sockets and how do I use them?",
                  link: "/docs/wiki/delivery-sockets",
                },
                {
                  q: "How do I control permissions for my server?",
                  link: "/docs/wiki/permissions",
                },
                {
                  q: "Can I customize the appearance of drones?",
                  link: "/docs/wiki/features#-custom-drone-appearance",
                },
                {
                  q: "How do I troubleshoot common issues?",
                  link: "/docs/wiki/troubleshooting",
                },
                {
                  q: "What configuration options are available?",
                  link: "/docs/wiki/configuration",
                },
              ].map((faq, i) => (
                <a
                  key={i}
                  href={faq.link}
                  className="group p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
                >
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {faq.q}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Documentation Stats */}
          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">7</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Comprehensive Guides
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">150+</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Commands & Options</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">40+</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Config Settings</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">100%</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Feature Coverage</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Help */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Getting Help
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <a href="/docs/wiki/troubleshooting" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      → Browse Troubleshooting Guide
                    </a>
                  </li>
                  <li>
                    <a href="/docs/wiki/commands" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      → Check Commands Reference
                    </a>
                  </li>
                  <li>
                    <a href="/stats" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      → View Plugin Statistics
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Plugin Info
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <a href="/versions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      → View Version History
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      → Back to Home
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
