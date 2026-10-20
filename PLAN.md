# Science Art Creator — plan

Product: a browser studio for scientific figures. Users place editable vector icons, label them, ask for a first draft, save projects, and export PNG, SVG, or print PDF.

Stack in this workspace: TanStack Start, Neon Postgres with Better Auth, Grok for drafts. Stripe Checkout is wired and stays dormant until billing keys exist.

## Status

Iteration 1 is in the product. See `BUILD_LOG.md` for what worked and what broke.

## Next pass

1. Read `BUILD_LOG.md` before editing.
2. Add snap alignment, grouped labels, and a scale bar with a unit.
3. Grow the library: western blot, chart glyphs, histology.
4. Do not restart the dev server unless dependencies or `vite.config` change.
5. Do not label the app as a game in `src/lib/og/site.json`.
