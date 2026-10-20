import { DEEP, INK, PALE, WASH, iconSvg, type Shape } from "./svg";
import type { IconCategory, IconDef } from "./types";

export { CATEGORIES } from "./types";

const S = INK;
const W = WASH;
const P = PALE;
const D = DEEP;

function def(
  id: string,
  name: string,
  category: IconCategory,
  tags: string[],
  shapes: Shape[],
): IconDef {
  return { id, name, category, tags, svg: iconSvg(shapes) };
}

export const ICONS: IconDef[] = [
  def("animal-cell", "Animal cell", "cells", ["cell", "animal", "eukaryote", "overview"], [
    { k: "e", cx: 50, cy: 52, rx: 40, ry: 34, f: W, s: S, sw: 2.4 },
    { k: "c", cx: 46, cy: 48, r: 12, f: P, s: S, sw: 2 },
    { k: "c", cx: 43, cy: 47, r: 3.2, f: D },
    { k: "e", cx: 74, cy: 40, rx: 7, ry: 4, f: "none", s: S, sw: 1.8, rot: -28 },
    { k: "e", cx: 26, cy: 64, rx: 6.5, ry: 3.6, f: "none", s: S, sw: 1.8, rot: 24 },
    { k: "p", d: "M60 66c8 1 12 8 6 12", f: "none", s: S, sw: 1.8 },
    { k: "c", cx: 68, cy: 62, r: 2.2, f: D },
    { k: "c", cx: 30, cy: 40, r: 2.2, f: D },
  ]),
  def("plant-cell", "Plant cell", "cells", ["cell", "plant", "wall", "chloroplast"], [
    { k: "r", x: 14, y: 16, w: 72, h: 68, rx: 6, f: W, s: S, sw: 3 },
    { k: "r", x: 22, y: 24, w: 56, h: 52, rx: 18, f: P, s: S, sw: 1.6 },
    { k: "e", cx: 36, cy: 42, rx: 8, ry: 5, f: "#c5ddd4", s: S, sw: 1.5, rot: -20 },
    { k: "e", cx: 62, cy: 58, rx: 8, ry: 5, f: "#c5ddd4", s: S, sw: 1.5, rot: 18 },
    { k: "c", cx: 50, cy: 48, r: 6, f: "none", s: S, sw: 1.6 },
  ]),
  def("bacterium", "Bacterium", "cells", ["cell", "bacteria", "prokaryote", "microbe"], [
    { k: "r", x: 22, y: 34, w: 56, h: 32, rx: 16, f: W, s: S, sw: 2.4 },
    { k: "p", d: "M34 46c6 4 10-4 16 0s10-4 16 0", f: "none", s: D, sw: 1.6 },
    { k: "p", d: "M30 34c-2-14 8-18 6-22", f: "none", s: S, sw: 1.8 },
    { k: "p", d: "M48 34c0-12 6-14 4-22", f: "none", s: S, sw: 1.8 },
    { k: "p", d: "M66 34c2-14 10-12 8-22", f: "none", s: S, sw: 1.8 },
  ]),
  def("yeast", "Yeast", "cells", ["cell", "yeast", "fungus", "budding"], [
    { k: "e", cx: 46, cy: 54, rx: 22, ry: 26, f: W, s: S, sw: 2.4 },
    { k: "c", cx: 70, cy: 34, r: 12, f: W, s: S, sw: 2.2 },
    { k: "c", cx: 42, cy: 52, r: 5, f: P, s: S, sw: 1.5 },
  ]),
  def("neuron", "Neuron", "cells", ["cell", "neuron", "brain", "synapse", "axon"], [
    { k: "c", cx: 38, cy: 48, r: 14, f: W, s: S, sw: 2.2 },
    { k: "p", d: "M28 38c-10-12-16-8-18-16", f: "none", s: S, sw: 1.8 },
    { k: "p", d: "M30 56c-12 6-14 16-22 18", f: "none", s: S, sw: 1.8 },
    { k: "p", d: "M34 34c-4-16 6-18 2-26", f: "none", s: S, sw: 1.8 },
    { k: "p", d: "M52 48h22l6-8 8 16-8 6", f: "none", s: S, sw: 2 },
    { k: "c", cx: 86, cy: 52, r: 3, f: "none", s: S, sw: 1.6 },
  ]),
  def("erythrocyte", "Red blood cell", "cells", ["cell", "blood", "rbc", "erythrocyte"], [
    { k: "e", cx: 50, cy: 50, rx: 34, ry: 22, f: "#e7d2cc", s: S, sw: 2.2 },
    { k: "e", cx: 50, cy: 50, rx: 14, ry: 8, f: "#f3e4de", s: S, sw: 1.5 },
  ]),
  def("epithelial", "Epithelium", "cells", ["cell", "tissue", "epithelial", "barrier"], [
    { k: "r", x: 12, y: 28, w: 22, h: 48, rx: 8, f: W, s: S, sw: 2 },
    { k: "r", x: 39, y: 22, w: 22, h: 54, rx: 8, f: P, s: S, sw: 2 },
    { k: "r", x: 66, y: 28, w: 22, h: 48, rx: 8, f: W, s: S, sw: 2 },
    { k: "c", cx: 23, cy: 48, r: 4, f: D },
    { k: "c", cx: 50, cy: 44, r: 4, f: D },
    { k: "c", cx: 77, cy: 50, r: 4, f: D },
  ]),
  def("adipocyte", "Adipocyte", "cells", ["cell", "fat", "adipocyte", "lipid"], [
    { k: "c", cx: 50, cy: 50, r: 36, f: P, s: S, sw: 2.2 },
    { k: "c", cx: 72, cy: 30, r: 8, f: W, s: S, sw: 1.8 },
    { k: "c", cx: 72, cy: 30, r: 2.4, f: D },
  ]),
  def("nucleus", "Nucleus", "organelles", ["nucleus", "organelle", "dna", "cell"], [
    { k: "c", cx: 50, cy: 50, r: 30, f: P, s: S, sw: 2.4 },
    { k: "c", cx: 44, cy: 46, r: 8, f: W, s: D, sw: 1.8 },
    { k: "c", cx: 62, cy: 58, r: 3, f: D },
  ]),
  def("mitochondrion", "Mitochondrion", "organelles", ["mitochondrion", "mito", "atp", "organelle", "energy"], [
    { k: "e", cx: 50, cy: 50, rx: 36, ry: 18, f: W, s: S, sw: 2.4 },
    { k: "p", d: "M22 50c6-8 10 8 16 0s10-8 16 0 10 8 16 0", f: "none", s: D, sw: 1.8 },
  ]),
  def("chloroplast", "Chloroplast", "organelles", ["chloroplast", "plant", "photosynthesis", "organelle"], [
    { k: "e", cx: 50, cy: 50, rx: 34, ry: 20, f: "#d5e6d8", s: S, sw: 2.4 },
    { k: "p", d: "M24 42h52M24 50h52M24 58h52", f: "none", s: D, sw: 1.6 },
    { k: "e", cx: 50, cy: 50, rx: 10, ry: 6, f: P, s: S, sw: 1.4 },
  ]),
  def("golgi", "Golgi", "organelles", ["golgi", "organelle", "secretory"], [
    { k: "p", d: "M22 32c18-8 38-8 56 0", f: "none", s: S, sw: 2.4 },
    { k: "p", d: "M24 44c16-7 36-7 52 0", f: "none", s: S, sw: 2.4 },
    { k: "p", d: "M26 56c14-6 34-6 48 0", f: "none", s: S, sw: 2.4 },
    { k: "p", d: "M30 68c12-5 28-5 40 0", f: "none", s: S, sw: 2.4 },
    { k: "c", cx: 78, cy: 36, r: 3.5, f: W, s: S, sw: 1.5 },
  ]),
  def("rough-er", "Rough ER", "organelles", ["er", "endoplasmic", "organelle", "protein"], [
    { k: "p", d: "M18 28c20 10 20 10 40 0s20-10 24 2 4 18-8 22-24 2-28 14 8 16 28 10", f: "none", s: S, sw: 2.2 },
    { k: "c", cx: 30, cy: 32, r: 2.3, f: D },
    { k: "c", cx: 48, cy: 26, r: 2.3, f: D },
    { k: "c", cx: 64, cy: 34, r: 2.3, f: D },
    { k: "c", cx: 42, cy: 52, r: 2.3, f: D },
    { k: "c", cx: 58, cy: 70, r: 2.3, f: D },
  ]),
  def("ribosome", "Ribosome", "organelles", ["ribosome", "organelle", "translation"], [
    { k: "c", cx: 50, cy: 58, r: 18, f: W, s: S, sw: 2.2 },
    { k: "e", cx: 50, cy: 38, rx: 14, ry: 10, f: P, s: S, sw: 2.2 },
  ]),
  def("lysosome", "Lysosome", "organelles", ["lysosome", "organelle", "degradation"], [
    { k: "c", cx: 50, cy: 50, r: 28, f: W, s: S, sw: 2.4 },
    { k: "c", cx: 40, cy: 46, r: 4, f: D },
    { k: "c", cx: 58, cy: 42, r: 3, f: P, s: S, sw: 1.4 },
    { k: "c", cx: 54, cy: 60, r: 5, f: D },
  ]),
  def("vacuole", "Vacuole", "organelles", ["vacuole", "plant", "organelle"], [
    { k: "c", cx: 50, cy: 50, r: 32, f: "#e7f1f2", s: S, sw: 2.4 },
    { k: "c", cx: 50, cy: 50, r: 22, f: "none", s: S, sw: 1.2 },
  ]),
  def("dna", "DNA", "molecules", ["dna", "gene", "helix", "nucleus"], [
    { k: "p", d: "M32 12c16 12 16 16 0 28s-16 16 0 28 16 16 0 24", f: "none", s: S, sw: 2.2 },
    { k: "p", d: "M68 12c-16 12-16 16 0 28s16 16 0 28-16 16 0 24", f: "none", s: D, sw: 2.2 },
    { k: "l", x1: 36, y1: 24, x2: 64, y2: 24, s: S, sw: 1.6 },
    { k: "l", x1: 34, y1: 40, x2: 66, y2: 40, s: S, sw: 1.6 },
    { k: "l", x1: 36, y1: 56, x2: 64, y2: 56, s: S, sw: 1.6 },
    { k: "l", x1: 34, y1: 72, x2: 66, y2: 72, s: S, sw: 1.6 },
  ]),
  def("antibody", "Antibody", "molecules", ["antibody", "igg", "immune", "elisa"], [
    { k: "p", d: "M50 78 V46", f: "none", s: S, sw: 3 },
    { k: "p", d: "M50 48 L30 24", f: "none", s: S, sw: 3 },
    { k: "p", d: "M50 48 L70 24", f: "none", s: S, sw: 3 },
    { k: "c", cx: 26, cy: 20, r: 6, f: W, s: S, sw: 2 },
    { k: "c", cx: 74, cy: 20, r: 6, f: W, s: S, sw: 2 },
    { k: "c", cx: 50, cy: 82, r: 5, f: D },
  ]),
  def("receptor", "Receptor", "molecules", ["receptor", "membrane", "signal"], [
    { k: "l", x1: 14, y1: 58, x2: 86, y2: 58, s: S, sw: 2 },
    { k: "l", x1: 14, y1: 70, x2: 86, y2: 70, s: S, sw: 2 },
    { k: "p", d: "M40 58 V28c0-8 20-8 20 0v30", f: W, s: S, sw: 2.2 },
    { k: "c", cx: 50, cy: 18, r: 7, f: P, s: D, sw: 2 },
    { k: "p", d: "M44 70 v12 M56 70 v12", f: "none", s: S, sw: 2 },
  ]),
  def("lipid-bilayer", "Lipid bilayer", "molecules", ["membrane", "lipid", "bilayer"], [
    { k: "c", cx: 22, cy: 38, r: 6, f: W, s: S, sw: 1.6 },
    { k: "c", cx: 40, cy: 38, r: 6, f: W, s: S, sw: 1.6 },
    { k: "c", cx: 58, cy: 38, r: 6, f: W, s: S, sw: 1.6 },
    { k: "c", cx: 76, cy: 38, r: 6, f: W, s: S, sw: 1.6 },
    { k: "c", cx: 22, cy: 62, r: 6, f: W, s: S, sw: 1.6 },
    { k: "c", cx: 40, cy: 62, r: 6, f: W, s: S, sw: 1.6 },
    { k: "c", cx: 58, cy: 62, r: 6, f: W, s: S, sw: 1.6 },
    { k: "c", cx: 76, cy: 62, r: 6, f: W, s: S, sw: 1.6 },
    { k: "l", x1: 22, y1: 44, x2: 22, y2: 56, s: S, sw: 1.4 },
    { k: "l", x1: 40, y1: 44, x2: 40, y2: 56, s: S, sw: 1.4 },
    { k: "l", x1: 58, y1: 44, x2: 58, y2: 56, s: S, sw: 1.4 },
    { k: "l", x1: 76, y1: 44, x2: 76, y2: 56, s: S, sw: 1.4 },
  ]),
  def("protein", "Protein", "molecules", ["protein", "fold", "enzyme"], [
    { k: "p", d: "M30 62c-8-18 8-28 4-40 18 4 28 2 36 14 10 16-2 28-14 30-8 12-22 10-26-4z", f: W, s: S, sw: 2.2 },
    { k: "c", cx: 48, cy: 42, r: 3, f: D },
  ]),
  def("small-molecule", "Small molecule", "molecules", ["molecule", "compound", "drug", "chemistry"], [
    { k: "l", x1: 50, y1: 28, x2: 30, y2: 42, s: S, sw: 2 },
    { k: "l", x1: 50, y1: 28, x2: 70, y2: 42, s: S, sw: 2 },
    { k: "l", x1: 30, y1: 42, x2: 30, y2: 64, s: S, sw: 2 },
    { k: "l", x1: 70, y1: 42, x2: 70, y2: 64, s: S, sw: 2 },
    { k: "l", x1: 30, y1: 64, x2: 50, y2: 78, s: S, sw: 2 },
    { k: "l", x1: 70, y1: 64, x2: 50, y2: 78, s: S, sw: 2 },
    { k: "c", cx: 50, cy: 24, r: 6, f: P, s: S, sw: 1.8 },
    { k: "c", cx: 26, cy: 42, r: 6, f: W, s: S, sw: 1.8 },
    { k: "c", cx: 74, cy: 42, r: 6, f: W, s: S, sw: 1.8 },
    { k: "c", cx: 26, cy: 66, r: 6, f: D },
    { k: "c", cx: 74, cy: 66, r: 6, f: W, s: S, sw: 1.8 },
    { k: "c", cx: 50, cy: 82, r: 6, f: P, s: S, sw: 1.8 },
  ]),
  def("ion-channel", "Ion channel", "molecules", ["channel", "ion", "membrane", "pore"], [
    { k: "l", x1: 12, y1: 36, x2: 34, y2: 36, s: S, sw: 2 },
    { k: "l", x1: 66, y1: 36, x2: 88, y2: 36, s: S, sw: 2 },
    { k: "l", x1: 12, y1: 64, x2: 34, y2: 64, s: S, sw: 2 },
    { k: "l", x1: 66, y1: 64, x2: 88, y2: 64, s: S, sw: 2 },
    { k: "p", d: "M34 28c8 8 8 36 0 44M66 28c-8 8-8 36 0 44", f: W, s: S, sw: 2.2 },
    { k: "c", cx: 50, cy: 50, r: 3, f: D },
  ]),
  def("vesicle", "Vesicle", "molecules", ["vesicle", "trafficking", "cargo"], [
    { k: "c", cx: 50, cy: 50, r: 30, f: P, s: S, sw: 2.4 },
    { k: "c", cx: 40, cy: 46, r: 6, f: W, s: D, sw: 1.6 },
    { k: "c", cx: 58, cy: 42, r: 4, f: W, s: D, sw: 1.6 },
    { k: "c", cx: 54, cy: 60, r: 5, f: W, s: D, sw: 1.6 },
  ]),
  def("flask", "Flask", "lab", ["flask", "erlenmeyer", "lab", "glass", "assay", "workflow"], [
    { k: "p", d: "M38 16 h24 l16 62 a8 8 0 0 1-8 8 H30 a8 8 0 0 1-8-8 z", f: P, s: S, sw: 2.2 },
    { k: "p", d: "M28 62 h44 l8 16 H22 z", f: W, s: "none" },
    { k: "l", x1: 36, y1: 16, x2: 64, y2: 16, s: S, sw: 2.4 },
  ]),
  def("beaker", "Beaker", "lab", ["beaker", "lab", "glass", "workflow"], [
    { k: "p", d: "M30 18 h40 v52 a12 12 0 0 1-12 12 H42 a12 12 0 0 1-12-12 z", f: P, s: S, sw: 2.2 },
    { k: "p", d: "M32 58 h36 v10 a8 8 0 0 1-8 8 H40 a8 8 0 0 1-8-8 z", f: W, s: "none" },
    { k: "p", d: "M30 18 h8 M62 18 h8", f: "none", s: S, sw: 2.2 },
  ]),
  def("tube", "Test tube", "lab", ["tube", "test tube", "lab", "sample", "workflow"], [
    { k: "p", d: "M38 14 h24 v52 a12 12 0 0 1-24 0 z", f: P, s: S, sw: 2.2 },
    { k: "p", d: "M40 48 h20 v16 a10 10 0 0 1-20 0 z", f: W, s: "none" },
    { k: "r", x: 36, y: 12, w: 28, h: 6, rx: 1, f: D },
  ]),
  def("pipette", "Pipette", "lab", ["pipette", "lab", "liquid", "elisa", "workflow"], [
    { k: "p", d: "M46 18 h8 v46 l-4 18-4-18 z", f: P, s: S, sw: 2 },
    { k: "r", x: 42, y: 14, w: 16, h: 8, rx: 2, f: D },
    { k: "p", d: "M48 52 h4 v10 h-4 z", f: W, s: "none" },
  ]),
  def("micropipette", "Micropipette", "lab", ["micropipette", "pipette", "lab", "elisa", "workflow"], [
    { k: "p", d: "M58 14 h10 v18 H62 l-6 8 v28 l-4 16 h-6 l-2-16 V40 l8-8 V22 h6 z", f: P, s: S, sw: 2 },
    { k: "r", x: 60, y: 20, w: 6, h: 8, f: D },
    { k: "c", cx: 52, cy: 78, r: 2, f: W, s: S, sw: 1.2 },
  ]),
  def("petri", "Petri dish", "lab", ["petri", "plate", "culture", "lab", "workflow"], [
    { k: "e", cx: 50, cy: 58, rx: 34, ry: 14, f: P, s: S, sw: 2.2 },
    { k: "e", cx: 50, cy: 46, rx: 34, ry: 14, f: W, s: S, sw: 2.2 },
    { k: "e", cx: 50, cy: 46, rx: 20, ry: 7, f: "none", s: D, sw: 1.4 },
    { k: "c", cx: 40, cy: 44, r: 2, f: D },
    { k: "c", cx: 58, cy: 48, r: 1.6, f: D },
  ]),
  def("microscope", "Microscope", "lab", ["microscope", "lab", "imaging", "workflow"], [
    { k: "e", cx: 50, cy: 84, rx: 28, ry: 6, f: W, s: S, sw: 2 },
    { k: "r", x: 46, y: 48, w: 8, h: 32, f: P, s: S, sw: 2 },
    { k: "p", d: "M50 48 C50 48 28 48 28 32", f: "none", s: S, sw: 3 },
    { k: "c", cx: 28, cy: 26, r: 6, f: D },
    { k: "r", x: 58, y: 58, w: 22, h: 4, rx: 1, f: S },
    { k: "r", x: 64, y: 46, w: 6, h: 14, f: P, s: S, sw: 1.6 },
  ]),
  def("centrifuge", "Centrifuge", "lab", ["centrifuge", "lab", "spin", "workflow"], [
    { k: "r", x: 18, y: 28, w: 64, h: 52, rx: 10, f: P, s: S, sw: 2.2 },
    { k: "c", cx: 50, cy: 54, r: 16, f: W, s: S, sw: 2 },
    { k: "l", x1: 50, y1: 54, x2: 62, y2: 44, s: D, sw: 2 },
    { k: "c", cx: 34, cy: 36, r: 2, f: D },
  ]),
  def("bunsen", "Bunsen burner", "lab", ["bunsen", "burner", "flame", "lab"], [
    { k: "p", d: "M38 78 h24 l6 10 H32 z", f: W, s: S, sw: 2 },
    { k: "r", x: 46, y: 48, w: 8, h: 30, f: P, s: S, sw: 2 },
    { k: "p", d: "M50 48c6-10 4-16 8-24-8 2-6 12-10 12s-2-10-10-12c4 8 2 14 8 24z", f: "#f0d7c4", s: S, sw: 1.6 },
  ]),
  def("well-plate", "Well plate", "lab", ["plate", "well", "elisa", "assay", "96", "workflow"], [
    { k: "r", x: 12, y: 22, w: 76, h: 56, rx: 6, f: P, s: S, sw: 2.2 },
    { k: "c", cx: 30, cy: 38, r: 5, f: W, s: S, sw: 1.4 },
    { k: "c", cx: 46, cy: 38, r: 5, f: W, s: S, sw: 1.4 },
    { k: "c", cx: 62, cy: 38, r: 5, f: "#e7d2cc", s: S, sw: 1.4 },
    { k: "c", cx: 30, cy: 54, r: 5, f: W, s: S, sw: 1.4 },
    { k: "c", cx: 46, cy: 54, r: 5, f: "#e7d2cc", s: S, sw: 1.4 },
    { k: "c", cx: 62, cy: 54, r: 5, f: W, s: S, sw: 1.4 },
    { k: "c", cx: 74, cy: 46, r: 3, f: D },
  ]),
  def("arrow-right", "Arrow", "pathways", ["arrow", "flow", "pathway", "to", "next"], [
    { k: "l", x1: 12, y1: 50, x2: 70, y2: 50, s: S, sw: 3 },
    { k: "p", d: "M62 36 L86 50 L62 64", f: "none", s: S, sw: 3 },
  ]),
  def("arrow-curved", "Curved arrow", "pathways", ["arrow", "curve", "cycle", "pathway"], [
    { k: "p", d: "M24 68c0-32 52-32 52-4", f: "none", s: S, sw: 3 },
    { k: "p", d: "M64 52l14 14-18 2", f: "none", s: S, sw: 3 },
  ]),
  def("arrow-dashed", "Dashed arrow", "pathways", ["arrow", "dashed", "indirect", "pathway"], [
    { k: "l", x1: 12, y1: 50, x2: 68, y2: 50, s: S, sw: 3, dash: "7 6" },
    { k: "p", d: "M62 36 L86 50 L62 64", f: "none", s: S, sw: 3 },
  ]),
  def("inhibition", "Inhibition", "pathways", ["inhibition", "block", "blunt", "pathway", "negative"], [
    { k: "l", x1: 14, y1: 50, x2: 70, y2: 50, s: S, sw: 3 },
    { k: "l", x1: 74, y1: 34, x2: 74, y2: 66, s: S, sw: 4, cap: "square" },
  ]),
  def("activation", "Activation", "pathways", ["activation", "stimulate", "pathway", "positive", "arrow"], [
    { k: "p", d: "M14 50 H62 L62 36 L88 50 L62 64 L62 50 Z", f: D, s: D, sw: 1 },
  ]),
  def("equilibrium", "Equilibrium", "pathways", ["equilibrium", "reversible", "pathway"], [
    { k: "l", x1: 16, y1: 40, x2: 74, y2: 40, s: S, sw: 2.6 },
    { k: "p", d: "M68 30 L86 40 L68 50", f: "none", s: S, sw: 2.6 },
    { k: "l", x1: 84, y1: 60, x2: 26, y2: 60, s: S, sw: 2.6 },
    { k: "p", d: "M32 50 L14 60 L32 70", f: "none", s: S, sw: 2.6 },
  ]),
  def("heart", "Heart", "anatomy", ["heart", "cardiac", "anatomy", "organ"], [
    { k: "p", d: "M50 80 C50 80 16 58 16 38 C16 24 26 16 36 20 C44 23 48 30 50 34 C52 30 56 23 64 20 C74 16 84 24 84 38 C84 58 50 80 50 80 Z", f: "#e7d2cc", s: S, sw: 2.2 },
  ]),
  def("brain", "Brain", "anatomy", ["brain", "neuro", "anatomy", "organ"], [
    { k: "p", d: "M50 18c-8 0-14 6-16 12-8 1-14 8-14 16 0 6 3 10 8 13-1 4-1 8 2 12 4 6 12 8 18 7v6h8v-6c8 2 16-2 18-9 6-2 10-8 10-14 0-8-6-14-14-16-2-6-8-11-16-11-2 0-3 0-4 0z", f: P, s: S, sw: 2 },
    { k: "p", d: "M50 22 v48", f: "none", s: S, sw: 1.4 },
    { k: "p", d: "M36 36c6 2 8 6 6 10M64 36c-6 2-8 6-6 10M34 52c8 2 10 4 8 8", f: "none", s: D, sw: 1.3 },
  ]),
  def("lung", "Lungs", "anatomy", ["lung", "pulmonary", "anatomy", "organ"], [
    { k: "p", d: "M48 20 h4 v18", f: "none", s: S, sw: 2 },
    { k: "p", d: "M50 36 C50 36 30 32 24 42 C16 54 18 78 32 80 C42 82 48 70 50 60 C52 70 58 82 68 80 C82 78 84 54 76 42 C70 32 50 36 50 36 Z", f: "#e7d2cc", s: S, sw: 2 },
  ]),
  def("leaf", "Leaf", "anatomy", ["leaf", "plant", "anatomy"], [
    { k: "p", d: "M50 86 C50 86 18 64 20 40 C22 18 44 12 50 12 C56 12 78 18 80 40 C82 64 50 86 50 86 Z", f: "#d5e6d8", s: S, sw: 2.2 },
    { k: "p", d: "M50 80 V24", f: "none", s: D, sw: 1.6 },
    { k: "p", d: "M50 40c-8 4-14 4-20 2M50 52c8 4 14 4 20 2M50 64c-6 3-12 3-16 1", f: "none", s: D, sw: 1.3 },
  ]),
  def("eye", "Eye", "anatomy", ["eye", "retina", "anatomy", "vision"], [
    { k: "p", d: "M8 50c14-18 28-24 42-24s28 6 42 24c-14 18-28 24-42 24S22 68 8 50z", f: P, s: S, sw: 2.2 },
    { k: "c", cx: 50, cy: 50, r: 12, f: W, s: S, sw: 2 },
    { k: "c", cx: 50, cy: 50, r: 5, f: D },
  ]),
  def("kidney", "Kidney", "anatomy", ["kidney", "renal", "anatomy", "organ"], [
    { k: "p", d: "M62 16c-16 0-28 12-28 28 0 10 4 16 4 24 0 12 8 20 20 20 16 0 26-14 26-32 0-8-2-12-2-18 0-10-8-22-20-22z", f: "#e7d2cc", s: S, sw: 2.2 },
    { k: "p", d: "M58 34c6 6 6 14 2 22", f: "none", s: D, sw: 1.8 },
  ]),
  def("panel-a", "Panel A", "marks", ["panel", "label", "a"], [
    { k: "c", cx: 50, cy: 50, r: 28, f: D },
    { k: "t", x: 50, y: 60, text: "A", size: 32 },
  ]),
  def("panel-b", "Panel B", "marks", ["panel", "label", "b"], [
    { k: "c", cx: 50, cy: 50, r: 28, f: D },
    { k: "t", x: 50, y: 60, text: "B", size: 32 },
  ]),
  def("panel-c", "Panel C", "marks", ["panel", "label", "c"], [
    { k: "c", cx: 50, cy: 50, r: 28, f: D },
    { k: "t", x: 50, y: 60, text: "C", size: 32 },
  ]),
  def("scale-bar", "Scale bar", "marks", ["scale", "bar", "measure"], [
    { k: "l", x1: 16, y1: 46, x2: 84, y2: 46, s: S, sw: 4, cap: "square" },
    { k: "l", x1: 16, y1: 36, x2: 16, y2: 56, s: S, sw: 3, cap: "square" },
    { k: "l", x1: 84, y1: 36, x2: 84, y2: 56, s: S, sw: 3, cap: "square" },
    { k: "t", x: 50, y: 74, text: "100 μm", size: 14, f: S },
  ]),
  def("scale-bar-nm", "Scale bar (nm)", "marks", ["scale", "bar", "measure", "nm"], [
    { k: "l", x1: 16, y1: 46, x2: 84, y2: 46, s: S, sw: 4, cap: "square" },
    { k: "l", x1: 16, y1: 36, x2: 16, y2: 56, s: S, sw: 3, cap: "square" },
    { k: "l", x1: 84, y1: 36, x2: 84, y2: 56, s: S, sw: 3, cap: "square" },
    { k: "t", x: 50, y: 74, text: "50 nm", size: 14, f: S },
  ]),
  def("western-blot-multi", "Western blot (multi)", "marks", ["blot", "western", "gel", "lanes"], [
    { k: "r", x: 12, y: 18, w: 76, h: 58, rx: 2, f: "#f8f4ee", s: S, sw: 2 },
    { k: "r", x: 18, y: 30, w: 8, h: 6, f: D },
    { k: "r", x: 30, y: 34, w: 8, h: 10, f: D },
    { k: "r", x: 42, y: 28, w: 8, h: 8, f: D },
    { k: "r", x: 54, y: 38, w: 8, h: 5, f: D },
    { k: "r", x: 66, y: 32, w: 8, h: 12, f: D },
    { k: "l", x1: 16, y1: 68, x2: 84, y2: 68, s: S, sw: 1.2 },
  ]),
  def("scatter-plot", "Scatter plot", "marks", ["chart", "scatter", "plot", "graph", "data"], [
    { k: "l", x1: 18, y1: 76, x2: 18, y2: 24, s: S, sw: 2 },
    { k: "l", x1: 18, y1: 76, x2: 84, y2: 76, s: S, sw: 2 },
    { k: "c", cx: 32, cy: 58, r: 3, f: DEEP },
    { k: "c", cx: 44, cy: 46, r: 3, f: DEEP },
    { k: "c", cx: 56, cy: 52, r: 3, f: DEEP },
    { k: "c", cx: 68, cy: 34, r: 3, f: DEEP },
    { k: "c", cx: 74, cy: 42, r: 3, f: DEEP },
    { k: "c", cx: 40, cy: 64, r: 2.4, f: WASH, s: S, sw: 1.2 },
  ]),
  def("western-blot", "Western blot", "marks", ["blot", "western", "gel", "protein", "band"], [
    { k: "r", x: 18, y: 20, w: 64, h: 60, rx: 2, f: "#f8f4ee", s: S, sw: 2 },
    { k: "r", x: 28, y: 32, w: 12, h: 8, f: D },
    { k: "r", x: 44, y: 36, w: 12, h: 6, f: D },
    { k: "r", x: 60, y: 40, w: 12, h: 10, f: D },
    { k: "l", x1: 22, y1: 70, x2: 78, y2: 70, s: S, sw: 1.2 },
  ]),
  def("bar-chart", "Bar chart", "marks", ["chart", "bar", "plot", "graph", "data"], [
    { k: "l", x1: 20, y1: 78, x2: 20, y2: 22, s: S, sw: 2 },
    { k: "l", x1: 20, y1: 78, x2: 82, y2: 78, s: S, sw: 2 },
    { k: "r", x: 28, y: 48, w: 12, h: 30, f: WASH, s: S, sw: 1.5 },
    { k: "r", x: 46, y: 36, w: 12, h: 42, f: P, s: S, sw: 1.5 },
    { k: "r", x: 64, y: 28, w: 12, h: 50, f: DEEP, s: S, sw: 1.5 },
  ]),
  def("line-plot", "Line plot", "marks", ["chart", "line", "plot", "graph", "data"], [
    { k: "l", x1: 18, y1: 76, x2: 18, y2: 24, s: S, sw: 2 },
    { k: "l", x1: 18, y1: 76, x2: 84, y2: 76, s: S, sw: 2 },
    { k: "p", d: "M22 62 L38 48 L52 54 L68 32 L80 40", f: "none", s: DEEP, sw: 2.4 },
    { k: "c", cx: 22, cy: 62, r: 2.4, f: DEEP },
    { k: "c", cx: 38, cy: 48, r: 2.4, f: DEEP },
    { k: "c", cx: 52, cy: 54, r: 2.4, f: DEEP },
    { k: "c", cx: 68, cy: 32, r: 2.4, f: DEEP },
    { k: "c", cx: 80, cy: 40, r: 2.4, f: DEEP },
  ]),
  def("histology", "Histology", "marks", ["histology", "tissue", "section", "stain"], [
    { k: "c", cx: 50, cy: 50, r: 34, f: "#f3e8d8", s: S, sw: 2.2 },
    { k: "c", cx: 38, cy: 42, r: 8, f: "#e6c9b0", s: S, sw: 1.4 },
    { k: "c", cx: 58, cy: 40, r: 6, f: "#d4b89a", s: S, sw: 1.4 },
    { k: "c", cx: 46, cy: 60, r: 7, f: "#e6c9b0", s: S, sw: 1.4 },
    { k: "c", cx: 62, cy: 58, r: 5, f: "#d4b89a", s: S, sw: 1.4 },
    { k: "c", cx: 34, cy: 56, r: 3, f: DEEP },
  ]),
];

const byId = new Map(ICONS.map((icon) => [icon.id, icon]));

export function getIcon(id: string): IconDef | undefined {
  return byId.get(id);
}

export function iconIndexForPrompt(): string {
  return ICONS.map((icon) => `${icon.id} (${icon.name})`).join(", ");
}
