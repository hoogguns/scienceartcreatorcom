import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Glyph } from "@/components/glyph";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icons/catalog";

export const Route = createFileRoute("/")({ component: Home });

const PLATE = ["animal-cell", "mitochondrion", "flask", "arrow-right", "antibody", "well-plate"];

function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:items-center md:pt-12">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">Publication figures</p>
          <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
            Figures that stay editable.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Build a plate the way a journal expects it: vector cells, glassware, and pathways you can still
            move after the first draft. Export PNG, SVG, or a print PDF.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/studio">
              <Button>Open the studio</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="quiet">See plans</Button>
            </Link>
          </div>
        </div>
        <div className="plate">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="font-display text-xl">Figure 1</p>
            <p className="text-sm text-muted">Cell and assay</p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-lg bg-paper p-3">
            {PLATE.map((id) => {
              const icon = getIcon(id);
              if (!icon) return null;
              return (
                <div key={id} className="rounded-lg bg-card p-2">
                  <Glyph svg={icon.svg} className="mx-auto h-16 w-16" />
                  <p className="mt-1 text-center text-xs text-muted">{icon.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3">
        {[
          ["Library", "Drag cells, organelles, labware, and pathway marks onto the page."],
          ["First draft", "Describe the figure. Arrange from the library, or sign in and let Grok place it."],
          ["Export", "PNG for slides, SVG for further editing, PDF sized for print."],
        ].map(([title, copy]) => (
          <article key={title} className="plate">
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-2 text-muted">{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
