export type IconCategory =
  | "cells"
  | "organelles"
  | "molecules"
  | "lab"
  | "pathways"
  | "anatomy"
  | "marks";

export type IconDef = {
  id: string;
  name: string;
  category: IconCategory;
  tags: string[];
  svg: string;
};

export type DraftItem = {
  iconId?: string;
  text?: string;
  /** Center, percent of the artboard. */
  x: number;
  y: number;
  /** Width as a percent of the artboard width. */
  w?: number;
  angle?: number;
};

export type Draft = {
  title: string;
  items: DraftItem[];
  source: "library" | "grok";
};

export const CATEGORIES: { id: IconCategory; label: string }[] = [
  { id: "cells", label: "Cells" },
  { id: "organelles", label: "Organelles" },
  { id: "molecules", label: "Molecules" },
  { id: "lab", label: "Labware" },
  { id: "pathways", label: "Pathways" },
  { id: "anatomy", label: "Anatomy" },
  { id: "marks", label: "Marks" },
];
