# Build log

Read this file and `PLAN.md` before the next pass.

## Iteration 1 — studio foundation

Shipped a scientific figure studio: vector canvas, icon library, local and signed-in save, PNG / SVG / print PDF, pricing, and a first-draft arranger.

### Successes

- Fabric canvas: select, drag, scale, rotate, layer order, align, undo, redo, text, rectangle, ellipse, line, arrow.
- About fifty textbook icons across cells, organelles, molecules, labware, pathways, anatomy, and panel marks. Click or drag onto the plate.
- “Arrange” builds a labeled plate from the prompt without an API call. “Draft with Grok” is signed-in, capped per day, and returns only library icon ids so the result stays editable.
- Figures autosave in the browser. Save writes the same figure into the account library.
- Starter, Unlimited, and Lifetime are on the pricing page. Stripe Checkout runs when billing keys exist; otherwise the editor and export stay open.
- Landing, figures list, and sign-in (Google and X) are in place.
- Dev and production renders are clean: no console errors, no horizontal overflow. Production preview needed the PGLite asset copy below.

### Failures and fixes

- Production preview exited on boot because the Nitro bundle did not carry `pglite.data` / wasm next to the bundled driver. `scripts/copy-pglite-assets.mjs` now runs as part of `npm run build`.
- The first arranger treated “organelles” as every organelle tag, so a plant chloroplast landed on an animal-cell plate, and labels sat on top of the next icon. Matching is now whole words, and callout names sit beside the icons.
- PNG / SVG / PDF in the top tool row were clipped. Export lives in the side panel (and the Export tab on a phone).
- A canvas on the studio page makes the brand check ask for a game card. This is not a game. The share image stays a normal product card.

### Not this stack

Next.js, Supabase, and Recraft were not used. The running app is TanStack Start, Neon (PGLite in the preview), Better Auth, and Grok for drafts. Same product jobs: editable vectors, accounts, saved figures, and paid plans.

### Next

- More icons (blots, plots, histology) and multi-panel masters.
- Snap guides and real scale-bar units.
- Turn on Stripe price ids when billing keys are present.
- Keep this log updated.


## Iteration 3 — snap guides and plot marks

### Successes

- Snap-to-10 px grid while objects move and scale. Toggle lives next to the align controls and starts on.
- Four new marks: western blot (lanes and bands), bar chart, line plot with points, and a histology section. All stay fully editable vectors.

### Failures and fixes

- None that blocked the build. The snap listener is attached once at canvas creation; the toggle only flips a flag.

### Next

- Orthogonal connectors that stick to objects.
- Scale bar with a unit label.
- More blot and chart variants.


## Iteration 4 — orthogonal connectors and labeled scale bars

### Successes

- New Connector tool draws an orthogonal (horizontal-then-vertical) path with an arrow head. Endpoints snap to the nearest object edge or center within ~28 px at draw time.
- Scale-bar icon now carries an editable-looking unit label ("100 μm"). Added a 50 nm variant.
- Added multi-lane western blot and a scatter plot to the marks library.

### Failures and fixes

- None that blocked the build. Connectors are static after drawing; they do not yet re-route when objects move.

### Next

- Update connectors when their target objects move.
- More unit options and multi-panel masters.


## Iteration 5 — live connectors

### Successes

- Connectors now store sacFromId / sacToId. When either endpoint object moves, the connector recomputes its orthogonal path and arrow head so it stays attached.
- Added a 1 mm scale-bar mark and a multi-panel master (A–D layout) to the library.

### Failures and fixes

- Path updates use the Fabric Path.path array so the geometry redraws without recreating the object. Build stayed clean.

### Next

- Multi-panel templates that drop real labeled panels.
- More scale-bar units.
