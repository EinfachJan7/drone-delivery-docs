import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { RoadmapSection } from "@/components/site/RoadmapSection";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — Advanced Delivery Drones" },
      {
        name: "description",
        content:
          "Development roadmap for Advanced Delivery Drones — shipped features, work in progress, and upcoming releases.",
      },
      { property: "og:title", content: "Roadmap — Advanced Delivery Drones" },
      {
        property: "og:description",
        content:
          "Track shipped features, active development, and planned updates for Advanced Delivery Drones.",
      },
      { property: "og:url", content: "/roadmap" },
    ],
    links: [{ rel: "canonical", href: "/roadmap" }],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <SiteLayout>
      <RoadmapSection />
    </SiteLayout>
  );
}
