# Science Art Creator

Living plan for the automation. **Read this file before every iteration.**

Product: a browser studio for journal-style scientific figures. Users place
vector icons (cells, organelles, labware, arrows), edit them on a canvas
(move, scale, rotate, layer, recolor, label), ask for an editable first draft,
save figures to their account, and export PNG, SVG, and print PDF.

Repo: hoogguns/scienceartcreatorcom.
It already holds an earlier studio (StudioApp.tsx, marketing home, catalog).
Do not delete that history. Next iteration should merge its landing copy into
this plate and then replace the remote with one tree.

## Stack (do not regress)

- TanStack Start + React 19 + Tailwind v4, not Next.js. Fabric.js is the canvas
  and is imported only from src/lib/figures/stage.ts inside a client effect.
- Neon Postgres + Better Auth (Google and X), not Supabase.
- Draft engine: composeLocal always works. Signed-in Draft calls grok-4.5.
- Billing waits for STRIPE_SECRET_KEY and price ids. Never fake a charge.

## Routes

- / studio
- /figures library
- /pricing plans
- /login sign-in

## Next

- Merge the earlier landing into this plate, then replace the remote tree.
- Orthogonal connectors.
- Stripe test checkout once keys exist.
