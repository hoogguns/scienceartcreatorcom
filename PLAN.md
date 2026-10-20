# Science Art Creator - Project Plan

## Overview
Interactive web app for creating scientific diagrams using Next.js + Fabric.js canvas. Users drag scientific icons, get AI-generated first drafts, save projects, and export high-quality figures. Target: alternative to paid tools like BioRender or Adobe Illustrator for science.

## Core Steps (Logical Layout)
1. **Foundation**: Next.js app + interactive Fabric.js canvas (click, drag, resize, rotate, layer shapes/icons).
2. **Icon Library**: Sidebar with categorized vector icons (cells, lab equipment, arrows, molecules) draggable onto canvas.
3. **AI First-Draft**: API route to AI (Recraft/Fal/Replicate or free alternatives) for prompt → editable SVG/graphics on canvas.
4. **Database & Auth**: Supabase for user projects (canvas JSON state) + authentication.
5. **Export & Monetization**: Client-side PNG/SVG/PDF exports + Stripe for Starter/Unlimited/Lifetime plans.
6. **GitHub**: Repo `scienceartcreatorcom` combining iterations into golden image.

## Iteration Rules
- Always read STATUS.md / PLAN.md / NOTES.md before starting work.
- Each day/iteration: plan → build → test → document successes/failures → screenshots/links.
- Improve existing code rather than restart if possible.
- Prefer free/open-source or from-scratch implementations over paid APIs where feasible.

## Current Focus (Iteration 1)
- Initialize Next.js + TypeScript + Tailwind project.
- Integrate Fabric.js canvas with basic interaction.
- Create initial tracking files.
- Test basic canvas functionality.

## Tech Stack
- Frontend: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Fabric.js
- Backend: Next.js API routes, Supabase (Postgres + Auth)
- AI: Open-source or free tier first (e.g., local SVG generation or free endpoints)
- Payments: Stripe
- Hosting: Vercel (connected)
