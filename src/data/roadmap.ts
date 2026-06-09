/**
 * Roadmap data — add and edit entries here.
 *
 * status:
 *   "completed"   → shipped, green styling with checkmark
 *   "in-progress" → actively in development, pulsing indicator
 *   "planned"     → upcoming, muted styling
 */

export type RoadmapStatus = "completed" | "in-progress" | "planned";

export type RoadmapItem = {
  id: string;
  title: string;
  description?: string;
  status: RoadmapStatus;
  /** Optional target release, e.g. "1.1.0" */
  targetVersion?: string;
};

export const ROADMAP_ITEMS: RoadmapItem[] = [
  // ── Shipped ─────────────────────────────────────────────
  {
    id: "physical-flight",
    title: "Physical drone flight",
    description: "Armor-stand drones with launch animation, cruise speed and smooth landing.",
    status: "completed",
  },
  {
    id: "package-inventories",
    title: "Package inventories",
    description: "9–54 slot compose GUIs with auto-return on expiry.",
    status: "completed",
  },
  {
    id: "delivery-sockets",
    title: "Delivery sockets",
    description: "Personal delivery points with trust lists and chest/hopper auto-unload.",
    status: "completed",
  },
  {
    id: "animal-transport",
    title: "Animal transport",
    description: "Send animals via GUI with full NBT persistence.",
    status: "completed",
  },
  {
    id: "discord-webhooks",
    title: "Discord webhooks",
    description: "Rich embeds for sent, delivered, declined and expired drones.",
    status: "completed",
  },
  {
    id: "gui-config",
    title: "Fully configurable GUIs",
    description: "Customize every menu via gui.yml with live reload.",
    status: "completed",
  },
  {
    id: "i18n",
    title: "6 languages built-in",
    description: "de_DE, en_EN, es_ES, fr_FR, ru_RU, zh_CN with MiniMessage.",
    status: "completed",
  },

  // ── In progress ───────────────────────────────────────────
  {
    id: "vault-integration",
    title: "Vault economy integration",
    description: "Charge delivery fees per distance, package size or socket usage.",
    status: "in-progress",
    targetVersion: "1.1.0",
  },
  {
    id: "developer-api",
    title: "Developer API",
    description: "Events and hooks for third-party plugins to extend drone behaviour.",
    status: "in-progress",
    targetVersion: "1.1.0",
  },

  // ── Planned ─────────────────────────────────────────────
  {
    id: "bulk-queue",
    title: "Bulk delivery queue",
    description: "Queue multiple packages and send them in batches with rate limiting.",
    status: "planned",
    targetVersion: "1.2.0",
  },
  {
    id: "custom-models",
    title: "Custom drone models",
    description: "Resource-pack based drone skins and model variants per server.",
    status: "planned",
    targetVersion: "1.2.0",
  },
  {
    id: "route-map",
    title: "Route map visualization",
    description: "In-game map item showing active drone routes and ETA.",
    status: "planned",
    targetVersion: "1.3.0",
  },
  {
    id: "bedrock-optimizations",
    title: "Bedrock-specific optimizations",
    description: "Improved Geyser/Floodgate rendering and touch-friendly GUIs.",
    status: "planned",
    targetVersion: "1.3.0",
  },
];

export function getRoadmapProgress(items: RoadmapItem[] = ROADMAP_ITEMS) {
  const total = items.length;
  const completed = items.filter((i) => i.status === "completed").length;
  const inProgress = items.filter((i) => i.status === "in-progress").length;
  const planned = items.filter((i) => i.status === "planned").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, inProgress, planned, percent };
}
