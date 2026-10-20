# Notes & Decisions

- Fabric.js must be loaded client-side only (`'use client'` + dynamic import) to avoid SSR errors.
- Prefer vector icons (SVG) for scalability in scientific diagrams.
- AI feature: Start with simple prompt-to-shape or free SVG generators before paid APIs.
- Export: Use Fabric.js toDataURL / toSVG for PNG/SVG; jsPDF or similar for PDF.
- Repo name: scienceartcreatorcom (as specified).
