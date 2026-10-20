import { ICONS } from "./catalog";
import type { Draft, DraftItem, IconDef } from "./types";

function hasWord(prompt: string, word: string): boolean {
  return new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(prompt);
}

function scoreIcon(icon: IconDef, prompt: string): number {
  let score = 0;
  const name = icon.name.toLowerCase();
  if (hasWord(prompt, name)) score += 6;
  for (const tag of icon.tags) {
    if (hasWord(prompt, tag)) score += 3;
  }
  for (const word of name.split(/\s+/)) {
    if (word.length > 3 && hasWord(prompt, word)) score += 2;
  }
  return score;
}

function item(iconId: string, x: number, y: number, w: number, text?: string): DraftItem[] {
  const placed: DraftItem[] = [{ iconId, x, y, w }];
  if (text) placed.push({ text, x, y: Math.min(90, y + Math.max(12, w * 0.85)), w: Math.max(w, 16) });
  return placed;
}

function themed(prompt: string): IconDef[] {
  const picked = new Map<string, IconDef>();
  const add = (id: string) => {
    const icon = ICONS.find((entry) => entry.id === id);
    if (icon) picked.set(icon.id, icon);
  };

  if (/\bplant\b/.test(prompt)) {
    add("plant-cell");
    add("chloroplast");
    add("vacuole");
    add("leaf");
  }
  if (/\bneuron|synapse|axon\b/.test(prompt)) {
    add("neuron");
    add("vesicle");
    add("receptor");
    add("brain");
  }
  if (/\belisa|antibod/.test(prompt)) {
    add("micropipette");
    add("well-plate");
    add("antibody");
    add("tube");
  }
  if (/\bassay|workflow|protocol|lab\b/.test(prompt)) {
    add("pipette");
    add("tube");
    add("centrifuge");
    add("well-plate");
    add("microscope");
  }
  if (/\bmito|atp|respir/.test(prompt)) {
    add("mitochondrion");
    add("activation");
    add("small-molecule");
  }
  if (/\bblood|erythro|rbc\b/.test(prompt)) add("erythrocyte");
  if (/\bbacter|microbe\b/.test(prompt)) add("bacterium");
  if (/\bheart|cardiac\b/.test(prompt)) add("heart");
  if (/\blung|pulmon/.test(prompt)) add("lung");
  if (/\bkidney|renal\b/.test(prompt)) add("kidney");
  if (/\beye|retina\b/.test(prompt)) add("eye");
  if (/\bdna|gene|helix\b/.test(prompt)) add("dna");
  if (/\bmembrane|bilayer|lipid\b/.test(prompt)) {
    add("lipid-bilayer");
    add("receptor");
    add("ion-channel");
  }
  if (/\bcell\b/.test(prompt) && !picked.has("plant-cell") && !picked.has("neuron")) {
    add("animal-cell");
    add("nucleus");
    add("mitochondrion");
    add("golgi");
  }

  return [...picked.values()];
}

export function arrangeFromPrompt(prompt: string): Draft {
  const q = prompt.toLowerCase();
  const ranked = ICONS.map((icon) => ({ icon, score: scoreIcon(icon, q) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.icon);

  const themedIcons = themed(q);
  const merged: IconDef[] = [...themedIcons];
  if (merged.length === 0) {
    merged.push(...ranked.slice(0, 6));
  } else {
    const hasCell = merged.some((icon) => icon.category === "cells");
    for (const icon of ranked) {
      if (merged.some((entry) => entry.id === icon.id)) continue;
      if (hasCell && icon.category === "cells") continue;
      merged.push(icon);
      if (merged.length >= 5) break;
    }
  }

  const icons = merged.length > 0 ? merged : ICONS.filter((icon) => icon.category === "cells").slice(0, 4);
  const items: DraftItem[] = [];
  const pathway = /\b(path|flow|workflow|to|then|assay|elisa)\b/.test(q);
  const cellCallout =
    icons.some((icon) => icon.id === "animal-cell" || icon.id === "plant-cell") &&
    icons.some((icon) => icon.category === "organelles");

  if (cellCallout) {
    const hero = icons.find((icon) => icon.id === "animal-cell" || icon.id === "plant-cell")!;
    const rest = icons.filter((icon) => icon !== hero).slice(0, 4);
    items.push(...item(hero.id, 28, 50, 32));
    rest.forEach((icon, index) => {
      const y = 20 + index * 18;
      items.push({ iconId: "arrow-right", x: 52, y, w: 8 });
      items.push({ iconId: icon.id, x: 66, y, w: 12 });
      items.push({ text: icon.name, x: 84, y, w: 16 });
    });
  } else if (pathway) {
    icons.slice(0, 4).forEach((icon, index) => {
      const x = 16 + index * 22;
      items.push(...item(icon.id, x, 42, 16, icon.name));
      if (index < Math.min(icons.length, 4) - 1) {
        items.push({ iconId: "arrow-right", x: x + 11, y: 42, w: 8 });
      }
    });
  } else {
    icons.slice(0, 6).forEach((icon, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      items.push(...item(icon.id, 22 + col * 28, 32 + row * 40, 18, icon.name));
    });
  }

  const title = prompt.trim().slice(0, 80) || "Untitled figure";
  items.unshift({ text: title, x: 50, y: 8, w: 40 });
  return { title, items, source: "library" };
}

export const EXAMPLE_PROMPTS = [
  "Animal cell with organelles",
  "ELISA workflow",
  "Neuron synapse",
  "Plant cell and chloroplast",
];
