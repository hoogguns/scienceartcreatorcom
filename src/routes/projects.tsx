import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deleteLocalFigure, listLocalFigures, type LocalFigure } from "@/lib/local-figures";
import { deleteProject, listProjects, type ProjectSummary } from "@/lib/projects.functions";

export const Route = createFileRoute("/projects")({ component: Projects });

function Projects() {
  const { user, isPending } = useCurrentUserState();
  const [local, setLocal] = useState<LocalFigure[]>([]);
  const [cloud, setCloud] = useState<ProjectSummary[] | null>(null);

  useEffect(() => {
    setLocal(listLocalFigures());
  }, []);

  useEffect(() => {
    if (!user) {
      setCloud(null);
      return;
    }
    listProjects()
      .then(setCloud)
      .catch(() => setCloud([]));
  }, [user]);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl tracking-tight">Figures</h1>
            <p className="mt-2 text-muted">On this device, and in your library when you are signed in.</p>
          </div>
          <Link to="/studio">
            <Button>New figure</Button>
          </Link>
        </div>

        <h2 className="mt-8 font-display text-2xl">Library</h2>
        {isPending ? (
          <p className="mt-3 text-sm text-muted">Checking your account…</p>
        ) : !user ? (
          <p className="mt-3 text-sm text-muted">
            Sign in to keep figures beyond this browser.{" "}
            <Link to="/login" className="font-medium text-accent">
              Sign in
            </Link>
          </p>
        ) : cloud && cloud.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No library figures yet. Save one from the studio.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-card">
            {(cloud ?? []).map((figure) => (
              <li key={figure.id} className="flex items-center justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{figure.title}</p>
                  <p className="text-xs text-muted">{figure.updatedAt.slice(0, 16).replace("T", " ")}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to="/studio" search={{ id: figure.id, src: "cloud" }}>
                    <Button size="sm" variant="quiet">
                      Open
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      deleteProject({ data: { id: figure.id } })
                        .then(() => setCloud((rows) => (rows ?? []).filter((row) => row.id !== figure.id)))
                        .catch(() => toast.error("Could not delete"));
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-8 font-display text-2xl">On this device</h2>
        {local.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing saved in this browser yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-card">
            {local.map((figure) => (
              <li key={figure.id} className="flex items-center justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{figure.title}</p>
                  <p className="text-xs text-muted">{figure.updatedAt.slice(0, 16).replace("T", " ")}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to="/studio" search={{ id: figure.id }}>
                    <Button size="sm" variant="quiet">
                      Open
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      deleteLocalFigure(figure.id);
                      setLocal(listLocalFigures());
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
