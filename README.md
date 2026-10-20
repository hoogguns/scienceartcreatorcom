# Science Art Creator

Interactive scientific diagram builder using **Next.js** and **Fabric.js**.

Create professional scientific figures by dragging shapes, icons, and labels onto a canvas. Designed as a free/open alternative to tools like BioRender or Adobe Illustrator for researchers and students.

## Features (Iteration 1 - Foundation)

- Interactive Fabric.js canvas (select, drag, resize, rotate)
- Add basic shapes: rectangles, circles, text labels
- Delete selected objects and clear canvas
- Clean Next.js 16 + TypeScript + Tailwind UI

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/components/ScienceCanvas.tsx` — Core canvas component
- `PLAN.md`, `STATUS.md`, `NOTES.md` — Iteration tracking and decisions

## Roadmap

1. Foundation (Done)
2. Drag-and-drop scientific icon library
3. AI first-draft generation
4. Supabase persistence + auth
5. Export (PNG/SVG/PDF) + Stripe subscriptions

---

Built iteratively with progress tracked in `STATUS.md`.
