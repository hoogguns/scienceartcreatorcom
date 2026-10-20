import {
  Canvas,
  Ellipse,
  FabricObject,
  Group,
  IText,
  Line,
  Path,
  Point,
  Rect,
  loadSVGFromString,
} from "fabric";
import { getIcon } from "@/lib/icons/catalog";
import type { Draft, DraftItem } from "@/lib/icons/types";
import type { FigureFile } from "@/lib/local-figures";
import { DEEP, INK, WASH } from "@/lib/icons/svg";

export type Tool = "select" | "pan" | "text" | "rect" | "ellipse" | "line" | "arrow";

export type LayerInfo = {
  index: number;
  label: string;
  visible: boolean;
};

export type SelectionInfo = {
  count: number;
  label: string;
  opacity: number;
  fontSize: number | null;
  text: string | null;
};

type Meta = FabricObject & { sacKind?: string; sacLabel?: string };

const ART_PRESETS = {
  journal: { width: 1100, height: 760 },
  square: { width: 900, height: 900 },
  slide: { width: 1200, height: 675 },
} as const;

export type ArtPreset = keyof typeof ART_PRESETS;
export const ART_PRESETS_PUBLIC = ART_PRESETS;

function tag(obj: FabricObject, kind: string, label: string) {
  obj.set({ sacKind: kind, sacLabel: label });
}

function labelOf(obj: FabricObject): string {
  const meta = obj as Meta;
  return meta.sacLabel || obj.type || "Object";
}

function childList(obj: FabricObject): FabricObject[] | null {
  if (obj.type !== "group") return null;
  return (obj as Group).getObjects();
}

function paintTree(obj: FabricObject, key: "fill" | "stroke", color: string) {
  const kids = childList(obj);
  if (kids) {
    kids.forEach((kid) => paintTree(kid, key, color));
    return;
  }
  if (key === "fill") {
    const textual = obj.type === "i-text" || obj.type === "text" || obj.type === "textbox";
    const fill = obj.fill;
    if (textual || (typeof fill === "string" && fill !== "none" && fill !== "transparent")) {
      obj.set("fill", color);
    }
    return;
  }
  if (typeof obj.stroke === "string" && obj.stroke !== "none") obj.set("stroke", color);
}

function strokeTree(obj: FabricObject, width: number) {
  const kids = childList(obj);
  if (kids) {
    kids.forEach((kid) => strokeTree(kid, width));
    return;
  }
  if (typeof obj.stroke === "string" && obj.stroke !== "none") obj.set("strokeWidth", width);
}

export type Engine = {
  setSnap: (on: boolean) => void;
  destroy: () => void;
  setTool: (tool: Tool) => void;
  setViewScale: (scale: number) => void;
  setArtboard: (width: number, height: number) => void;
  artSize: () => { width: number; height: number };
  addIcon: (id: string, at?: { x: number; y: number } | null) => Promise<void>;
  clientToScene: (clientX: number, clientY: number) => { x: number; y: number } | null;
  addText: () => void;
  deleteSelection: () => void;
  duplicate: () => Promise<void>;
  bringForward: () => void;
  sendBackward: () => void;
  align: (mode: "left" | "center" | "right" | "top" | "middle" | "bottom") => void;
  setFill: (color: string) => void;
  setStroke: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setOpacity: (opacity: number) => void;
  setFontSize: (size: number) => void;
  setText: (text: string, commitChange?: boolean) => void;
  commitNow: () => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canHistory: () => { undo: boolean; redo: boolean };
  isEditing: () => boolean;
  selection: () => SelectionInfo;
  layers: () => LayerInfo[];
  selectLayer: (index: number) => void;
  toggleLayer: (index: number) => void;
  snapshot: () => FigureFile;
  loadFile: (file: FigureFile) => Promise<void>;
  applyDraft: (draft: Draft) => Promise<void>;
  objectCount: () => number;
  exportPNG: (multiplier: number) => string;
  exportSVG: () => string;
  exportPDF: (multiplier: number, filename: string) => Promise<void>;
  subscribe: (listener: () => void) => () => void;
};

function arrowD(x1: number, y1: number, x2: number, y2: number) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const head = Math.min(22, Math.max(12, len * 0.28));
  const hx = x2 - Math.cos(ang) * head;
  const hy = y2 - Math.sin(ang) * head;
  const wing = head * 0.62;
  const lx = hx + Math.cos(ang + Math.PI / 2) * wing;
  const ly = hy + Math.sin(ang + Math.PI / 2) * wing;
  const rx = hx + Math.cos(ang - Math.PI / 2) * wing;
  const ry = hy + Math.sin(ang - Math.PI / 2) * wing;
  return `M ${x1} ${y1} L ${hx} ${hy} M ${lx} ${ly} L ${x2} ${y2} L ${rx} ${ry}`;
}

export async function createEngine(host: HTMLElement): Promise<Engine> {
  if (!FabricObject.customProperties.includes("sacKind")) {
    FabricObject.customProperties.push("sacKind", "sacLabel");
  }
  FabricObject.ownDefaults.borderColor = DEEP;
  FabricObject.ownDefaults.cornerColor = "#ffffff";
  FabricObject.ownDefaults.cornerStrokeColor = DEEP;
  FabricObject.ownDefaults.transparentCorners = false;
  FabricObject.ownDefaults.cornerSize = 9;
  FabricObject.ownDefaults.padding = 3;

  const canvasEl = document.createElement("canvas");
  host.appendChild(canvasEl);

  let artW: number = ART_PRESETS.journal.width;
  let artH: number = ART_PRESETS.journal.height;
  let viewScale = 1;
  let tool: Tool = "select";
  let silence = false;
  let drawing = false;
  let sketch: FabricObject | null = null;
  let sketchStart = { x: 0, y: 0 };
  let panning = false;
  let panLast = { x: 0, y: 0 };

  const canvas = new Canvas(canvasEl, {
    width: artW,
    height: artH,
    backgroundColor: "#ffffff",
    preserveObjectStacking: true,
    selection: true,
    containerClass: "artboard",
  });

  const SNAP = 10;
  let snapOn = true;
  function snap(value: number) {
    return snapOn ? Math.round(value / SNAP) * SNAP : value;
  }
  canvas.on("object:moving", (opt) => {
    const obj = opt.target;
    if (!obj || !snapOn) return;
    obj.set({
      left: snap(obj.left ?? 0),
      top: snap(obj.top ?? 0),
    });
  });
  canvas.on("object:scaling", (opt) => {
    const obj = opt.target;
    if (!obj || !snapOn) return;
    const w = (obj.width ?? 0) * (obj.scaleX ?? 1);
    const h = (obj.height ?? 0) * (obj.scaleY ?? 1);
    if (Math.abs(w - snap(w)) < 4) {
      obj.set("scaleX", snap(w) / (obj.width || 1));
    }
    if (Math.abs(h - snap(h)) < 4) {
      obj.set("scaleY", snap(h) / (obj.height || 1));
    }
  });

  const listeners = new Set<() => void>();
  const undoStack: string[] = [];
  const redoStack: string[] = [];
  let last = "";

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function file(): FigureFile {
    return { version: 1, width: artW, height: artH, canvas: canvas.toJSON() };
  }

  function remember() {
    last = JSON.stringify(file());
  }

  function commit() {
    if (silence) return;
    const json = JSON.stringify(file());
    if (json === last) return;
    undoStack.push(last);
    if (undoStack.length > 40) undoStack.shift();
    last = json;
    redoStack.length = 0;
    emit();
  }

  async function restore(json: string) {
    const parsed = JSON.parse(json) as FigureFile;
    silence = true;
    artW = parsed.width;
    artH = parsed.height;
    canvas.setDimensions({ width: artW, height: artH });
    canvas.setDimensions({ width: artW * viewScale, height: artH * viewScale }, { cssOnly: true });
    await canvas.loadFromJSON(parsed.canvas as Record<string, unknown>);
    canvas.backgroundColor = "#ffffff";
    silence = false;
    canvas.requestRenderAll();
    emit();
  }

  function layoutScale() {
    canvas.setDimensions({ width: artW * viewScale, height: artH * viewScale }, { cssOnly: true });
  }

  function withFlatView<T>(fn: () => T): T {
    const vpt = canvas.viewportTransform.slice() as typeof canvas.viewportTransform;
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    try {
      return fn();
    } finally {
      canvas.setViewportTransform(vpt);
    }
  }

  function applyTool() {
    const selecting = tool === "select";
    canvas.selection = selecting;
    canvas.skipTargetFind = !selecting;
    canvas.defaultCursor = tool === "pan" ? "grab" : tool === "select" ? "default" : "crosshair";
    canvas.getObjects().forEach((obj) => {
      obj.selectable = selecting;
      obj.evented = selecting;
    });
  }

  async function placeIcon(id: string, point: { x: number; y: number }, width: number, angle = 0) {
    const icon = getIcon(id);
    if (!icon) return;
    const parsed = await loadSVGFromString(icon.svg);
    const parts = parsed.objects.filter((obj): obj is FabricObject => obj != null);
    if (parts.length === 0) return;
    const grouped = parts.length === 1 ? parts[0] : new Group(parts);
    tag(grouped, "icon", icon.name);
    grouped.set({
      left: point.x,
      top: point.y,
      originX: "center",
      originY: "center",
      angle,
    });
    grouped.scaleToWidth(width);
    canvas.add(grouped);
    grouped.setCoords();
    return grouped;
  }

  function placeText(text: string, point: { x: number; y: number }, width: number) {
    const fontSize = Math.max(18, Math.min(56, width * 0.16));
    const label = new IText(text, {
      left: point.x,
      top: point.y,
      originX: "center",
      originY: "center",
      fontFamily: "Source Sans 3, sans-serif",
      fontSize,
      fill: INK,
      fontWeight: 500,
    });
    tag(label, "text", "Text");
    canvas.add(label);
    return label;
  }

  canvas.on("object:modified", () => {
    if (!drawing) commit();
  });

  canvas.on("mouse:down", (opt) => {
    const point = canvas.getScenePoint(opt.e);
    if (tool === "pan") {
      panning = true;
      panLast = { x: opt.viewportPoint.x, y: opt.viewportPoint.y };
      canvas.defaultCursor = "grabbing";
      return;
    }
    if (tool !== "rect" && tool !== "ellipse" && tool !== "line" && tool !== "arrow") return;
    drawing = true;
    sketchStart = { x: point.x, y: point.y };
    if (tool === "rect") {
      sketch = new Rect({
        left: point.x,
        top: point.y,
        width: 1,
        height: 1,
        fill: WASH,
        stroke: INK,
        strokeWidth: 2,
        originX: "left",
        originY: "top",
      });
      tag(sketch, "shape", "Rectangle");
    } else if (tool === "ellipse") {
      sketch = new Ellipse({
        left: point.x,
        top: point.y,
        rx: 1,
        ry: 1,
        fill: WASH,
        stroke: INK,
        strokeWidth: 2,
        originX: "center",
        originY: "center",
      });
      tag(sketch, "shape", "Ellipse");
    } else {
      sketch = new Line([point.x, point.y, point.x, point.y], {
        stroke: INK,
        strokeWidth: 3,
        strokeLineCap: "round",
      });
      tag(sketch, "shape", tool === "arrow" ? "Arrow" : "Line");
    }
    canvas.add(sketch);
  });

  canvas.on("mouse:move", (opt) => {
    if (panning && tool === "pan") {
      const next = { x: opt.viewportPoint.x, y: opt.viewportPoint.y };
      canvas.relativePan(new Point(next.x - panLast.x, next.y - panLast.y));
      panLast = next;
      return;
    }
    if (!drawing || !sketch) return;
    const point = canvas.getScenePoint(opt.e);
    if (sketch.type === "rect") {
      sketch.set({
        left: Math.min(sketchStart.x, point.x),
        top: Math.min(sketchStart.y, point.y),
        width: Math.abs(point.x - sketchStart.x),
        height: Math.abs(point.y - sketchStart.y),
      });
    } else if (sketch.type === "ellipse") {
      sketch.set({
        left: (sketchStart.x + point.x) / 2,
        top: (sketchStart.y + point.y) / 2,
        rx: Math.max(1, Math.abs(point.x - sketchStart.x) / 2),
        ry: Math.max(1, Math.abs(point.y - sketchStart.y) / 2),
      });
    } else if (sketch instanceof Line) {
      sketch.set({ x2: point.x, y2: point.y });
    }
    sketch.setCoords();
    canvas.requestRenderAll();
  });

  canvas.on("mouse:up", () => {
    if (panning) {
      panning = false;
      canvas.defaultCursor = "grab";
      return;
    }
    if (!drawing || !sketch) return;
    const made = sketch;
    sketch = null;
    drawing = false;
    const bounds = made.getBoundingRect();
    if (bounds.width < 6 && bounds.height < 6) {
      canvas.remove(made);
      canvas.requestRenderAll();
      return;
    }
    if (tool === "arrow" && made instanceof Line) {
      const d = arrowD(made.x1 ?? 0, made.y1 ?? 0, made.x2 ?? 0, made.y2 ?? 0);
      canvas.remove(made);
      const path = new Path(d, {
        stroke: INK,
        strokeWidth: 3,
        fill: "transparent",
        strokeLineCap: "round",
        strokeLineJoin: "round",
      });
      tag(path, "shape", "Arrow");
      canvas.add(path);
      canvas.setActiveObject(path);
    } else {
      canvas.setActiveObject(made);
    }
    commit();
    tool = "select";
    applyTool();
    emit();
  });

  remember();
  layoutScale();

  const engine: Engine = {
    setSnap(on) {
      snapOn = on;
    },
    destroy() {
      canvas.dispose();
      host.replaceChildren();
    },
    setTool(next) {
      tool = next;
      applyTool();
      canvas.requestRenderAll();
      emit();
    },
    setViewScale(scale) {
      viewScale = scale;
      layoutScale();
    },
    setArtboard(width, height) {
      artW = width;
      artH = height;
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.setDimensions({ width: artW, height: artH });
      layoutScale();
      canvas.requestRenderAll();
      commit();
    },
    artSize: () => ({ width: artW, height: artH }),
    async addIcon(id, at) {
      const point = at ?? { x: artW / 2, y: artH / 2 };
      const grouped = await placeIcon(id, point, Math.min(artW, artH) * 0.18);
      if (!grouped) return;
      canvas.setActiveObject(grouped);
      tool = "select";
      applyTool();
      commit();
    },
    clientToScene(clientX, clientY) {
      const el = canvas.upperCanvasEl;
      if (!el) return null;
      const bounds = el.getBoundingClientRect();
      if (
        clientX < bounds.left ||
        clientX > bounds.right ||
        clientY < bounds.top ||
        clientY > bounds.bottom
      ) {
        return null;
      }
      const retina = canvas.getRetinaScaling() || 1;
      const x = ((clientX - bounds.left) * (el.width / bounds.width)) / retina;
      const y = ((clientY - bounds.top) * (el.height / bounds.height)) / retina;
      return { x, y };
    },
    addText() {
      const label = placeText("Label", { x: artW / 2, y: artH / 2 }, 220);
      canvas.setActiveObject(label);
      label.enterEditing();
      commit();
    },
    deleteSelection() {
      const objs = canvas.getActiveObjects();
      if (objs.length === 0) return;
      canvas.discardActiveObject();
      canvas.remove(...objs);
      commit();
    },
    async duplicate() {
      const obj = canvas.getActiveObject();
      if (!obj) return;
      const clone = await obj.clone();
      clone.set({ left: (clone.left ?? 0) + 28, top: (clone.top ?? 0) + 28 });
      canvas.add(clone);
      canvas.setActiveObject(clone);
      commit();
    },
    bringForward() {
      const obj = canvas.getActiveObject();
      if (!obj) return;
      canvas.bringObjectForward(obj);
      commit();
    },
    sendBackward() {
      const obj = canvas.getActiveObject();
      if (!obj) return;
      canvas.sendObjectBackwards(obj);
      commit();
    },
    align(mode) {
      const obj = canvas.getActiveObject();
      if (!obj) return;
      obj.setCoords();
      const box = obj.getBoundingRect();
      const margin = 28;
      let dx = 0;
      let dy = 0;
      if (mode === "left") dx = margin - box.left;
      if (mode === "center") dx = (artW - box.width) / 2 - box.left;
      if (mode === "right") dx = artW - margin - box.width - box.left;
      if (mode === "top") dy = margin - box.top;
      if (mode === "middle") dy = (artH - box.height) / 2 - box.top;
      if (mode === "bottom") dy = artH - margin - box.height - box.top;
      obj.set({ left: (obj.left ?? 0) + dx, top: (obj.top ?? 0) + dy });
      obj.setCoords();
      commit();
    },
    setFill(color) {
      canvas.getActiveObjects().forEach((obj) => paintTree(obj, "fill", color));
      canvas.requestRenderAll();
      commit();
    },
    setStroke(color) {
      canvas.getActiveObjects().forEach((obj) => paintTree(obj, "stroke", color));
      canvas.requestRenderAll();
      commit();
    },
    setStrokeWidth(width) {
      canvas.getActiveObjects().forEach((obj) => strokeTree(obj, width));
      canvas.requestRenderAll();
      commit();
    },
    setOpacity(opacity) {
      canvas.getActiveObjects().forEach((obj) => obj.set("opacity", opacity));
      canvas.requestRenderAll();
      commit();
    },
    setFontSize(size) {
      canvas.getActiveObjects().forEach((obj) => {
        if (obj.type === "i-text" || obj.type === "text" || obj.type === "textbox") {
          obj.set("fontSize", size);
        }
      });
      canvas.requestRenderAll();
      commit();
    },
    setText(text, commitChange = true) {
      const obj = canvas.getActiveObject();
      if (!obj || (obj.type !== "i-text" && obj.type !== "text" && obj.type !== "textbox")) return;
      obj.set("text", text);
      canvas.requestRenderAll();
      if (commitChange) commit();
    },
    commitNow() {
      commit();
    },
    async undo() {
      const prev = undoStack.pop();
      if (!prev) return;
      redoStack.push(last);
      last = prev;
      await restore(prev);
    },
    async redo() {
      const next = redoStack.pop();
      if (!next) return;
      undoStack.push(last);
      last = next;
      await restore(next);
    },
    canHistory: () => ({ undo: undoStack.length > 0, redo: redoStack.length > 0 }),
    isEditing() {
      const obj = canvas.getActiveObject() as IText | undefined;
      return Boolean(obj && "isEditing" in obj && obj.isEditing);
    },
    selection() {
      const objs = canvas.getActiveObjects();
      const first = objs[0] as (IText & Meta) | undefined;
      return {
        count: objs.length,
        label: objs.length === 1 && first ? labelOf(first) : objs.length > 1 ? `${objs.length} selected` : "Nothing selected",
        opacity: first?.opacity ?? 1,
        fontSize: first && "fontSize" in first ? first.fontSize : null,
        text: first && typeof first.text === "string" && (first.type === "i-text" || first.type === "text") ? first.text : null,
      };
    },
    layers() {
      return canvas
        .getObjects()
        .map((obj, index) => ({
          index,
          label: labelOf(obj),
          visible: obj.visible !== false,
        }))
        .reverse();
    },
    selectLayer(index) {
      const obj = canvas.getObjects()[index];
      if (!obj) return;
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
      emit();
    },
    toggleLayer(index) {
      const obj = canvas.getObjects()[index];
      if (!obj) return;
      obj.visible = obj.visible === false;
      canvas.requestRenderAll();
      commit();
    },
    snapshot: file,
    async loadFile(next) {
      silence = true;
      artW = next.width;
      artH = next.height;
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.setDimensions({ width: artW, height: artH });
      layoutScale();
      await canvas.loadFromJSON(next.canvas as Record<string, unknown>);
      canvas.backgroundColor = "#ffffff";
      silence = false;
      undoStack.length = 0;
      redoStack.length = 0;
      remember();
      applyTool();
      canvas.requestRenderAll();
      emit();
    },
    async applyDraft(draft) {
      canvas.discardActiveObject();
      canvas.remove(...canvas.getObjects());
      for (const item of draft.items) {
        await placeItem(item);
      }
      canvas.requestRenderAll();
      commit();
    },
    objectCount: () => canvas.getObjects().length,
    exportPNG(multiplier) {
      return withFlatView(() => canvas.toDataURL({ format: "png", multiplier }));
    },
    exportSVG() {
      return withFlatView(() => canvas.toSVG());
    },
    async exportPDF(multiplier, filename) {
      const data = withFlatView(() => canvas.toDataURL({ format: "png", multiplier }));
      const { jsPDF } = await import("jspdf");
      const wMm = (artW / 96) * 25.4;
      const hMm = (artH / 96) * 25.4;
      const pdf = new jsPDF({
        orientation: wMm >= hMm ? "landscape" : "portrait",
        unit: "mm",
        format: [wMm, hMm],
      });
      pdf.addImage(data, "PNG", 0, 0, wMm, hMm);
      pdf.save(filename);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  async function placeItem(item: DraftItem) {
    const x = (item.x / 100) * artW;
    const y = (item.y / 100) * artH;
    const width = ((item.w ?? 16) / 100) * artW;
    if (item.iconId) {
      await placeIcon(item.iconId, { x, y }, width, item.angle ?? 0);
      return;
    }
    if (item.text) placeText(item.text, { x, y }, width);
  }

  canvas.on("selection:created", () => emit());
  canvas.on("selection:updated", () => emit());
  canvas.on("selection:cleared", () => emit());

  return engine;
}
