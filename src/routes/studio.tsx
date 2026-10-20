import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";

export const Route = createFileRoute("/studio")({
  validateSearch: (search: Record<string, unknown>): { id?: string; src?: "cloud" } => {
    const out: { id?: string; src?: "cloud" } = {};
    if (typeof search.id === "string" && search.id.length < 80) out.id = search.id;
    if (search.src === "cloud") out.src = "cloud";
    return out;
  },
  component: StudioPage,
});

function StudioPage() {
  const search = Route.useSearch();
  return <StudioApp initialId={search.id} source={search.src} />;
}
