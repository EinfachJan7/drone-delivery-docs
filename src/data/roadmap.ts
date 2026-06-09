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
    id: "Mobtransport-rewrite",
    title: "Drone Mob Transport update",
    description: "Completely overhauling the mob-sending system to add a brand-new GUI menu, making drone animal transport much smarter, more visual, and highly flexible.",
    status: "completed",
    targetVersion: "1.1.2",
  },

  // ── In progress ───────────────────────────────────────────
  {
    id: "-",
    title: "-",
    description: "-",
    status: "",
    targetVersion: "2.2.2",
  },
  // ── Planned ─────────────────────────────────────────────
  {
    id: "Worldguard-Hook",
    title: "Worldguard Hook",
    description: "Add custom flags for worldguard regions.",
    status: "planned",
    targetVersion: "1.1.3",
  },
  {
    id: "Live-Maps-Hook",
    title: "Live Maps Integration",
    description: "Add hooks for Live Maps plugin. Such as Bluemap, Dynmap, etc.",
    status: "planned",
    targetVersion: "1.1.4",
  },
  {
    id: "Drone-Item-Blacklist",
    title: "Drone Item Blacklist",
    description: "Add a blacklist for items that cannot be sent by drones into the config.This is for server owners who don't want to allow certain items to be sent by drones.",
    status: "planned",
    targetVersion: "1.1.5",
  },
  {
    id: "Even-More-Placeholders",
    title: "More Placeholders",
    description: "Add even more placeholders for the plugin.",
    status: "planned",
    targetVersion: "1.1.6",
  },
  {
    id: "Custom-Item-support-for-the-guis",
    title: "Custom item support for the drone guis",
    description: "Allow server owners to use their own custom items for the drone guis.",
    status: "planned",
    targetVersion: "1.1.6",
  },
  {
    id: "Mob-Blacklist",
    title: "Mob Blacklist for the Mob drones",
    description: "Add a blacklist for mobs that cannot be sent by mob drones into the config. This is for server owners who don't want to allow certain mobs to be sent by mob drones.",
    status: "planned",
    targetVersion: "1.1.3",
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
