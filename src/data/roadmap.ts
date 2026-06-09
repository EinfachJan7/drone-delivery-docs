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
    id: "-",
    title: "-",
    description: "-",
    status: "-",
    targetVersion: "-",
  },

  // ── In progress ───────────────────────────────────────────
  {
    id: "-",
    title: "-",
    description: "-",
    status: "-",
    targetVersion: "-",
  },
  // ── Planned ─────────────────────────────────────────────
  {
    id: "Worldguard-Hook",
    title: "Worldguard Hook",
    description: "Add custom flags for worldguard regions.",
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
