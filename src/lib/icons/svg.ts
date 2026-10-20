export const INK = "#24343c";
export const WASH = "#d5e6e3";
export const PALE = "#f6f1e6";
export const DEEP = "#1f4e5f";

type Ellipse = {
  k: "e";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  f?: string;
  s?: string;
  sw?: number;
  rot?: number;
};
type Circle = { k: "c"; cx: number; cy: number; r: number; f?: string; s?: string; sw?: number };
type Path = {
  k: "p";
  d: string;
  f?: string;
  s?: string;
  sw?: number;
  cap?: "round" | "butt" | "square";
  dash?: string;
};
type Rect = {
  k: "r";
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  f?: string;
  s?: string;
  sw?: number;
};
type Line = {
  k: "l";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  s?: string;
  sw?: number;
  cap?: "round" | "butt" | "square";
  dash?: string;
};
type Text = { k: "t"; x: number; y: number; text: string; size?: number; f?: string };

export type Shape = Ellipse | Circle | Path | Rect | Line | Text;

function paint(f: string | undefined, s: string | undefined, sw: number | undefined) {
  const fill = f ?? "none";
  const stroke = s ?? "none";
  const width = sw ?? (stroke === "none" ? 0 : 2.2);
  return ` fill="${fill}" stroke="${stroke}" stroke-width="${width}"`;
}

function render(shape: Shape): string {
  switch (shape.k) {
    case "e": {
      const rot =
        shape.rot != null ? ` transform="rotate(${shape.rot} ${shape.cx} ${shape.cy})"` : "";
      return `<ellipse cx="${shape.cx}" cy="${shape.cy}" rx="${shape.rx}" ry="${shape.ry}"${paint(shape.f, shape.s, shape.sw)}${rot}/>`;
    }
    case "c":
      return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}"${paint(shape.f, shape.s, shape.sw)}/>`;
    case "r":
      return `<rect x="${shape.x}" y="${shape.y}" width="${shape.w}" height="${shape.h}"${shape.rx != null ? ` rx="${shape.rx}"` : ""}${paint(shape.f, shape.s, shape.sw)}/>`;
    case "l":
      return `<line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}"${paint("none", shape.s ?? INK, shape.sw)} stroke-linecap="${shape.cap ?? "round"}"${shape.dash ? ` stroke-dasharray="${shape.dash}"` : ""}/>`;
    case "p":
      return `<path d="${shape.d}"${paint(shape.f, shape.s, shape.sw)} stroke-linecap="${shape.cap ?? "round"}" stroke-linejoin="round"${shape.dash ? ` stroke-dasharray="${shape.dash}"` : ""}/>`;
    case "t":
      return `<text x="${shape.x}" y="${shape.y}" text-anchor="middle" font-family="Source Sans 3, sans-serif" font-size="${shape.size ?? 28}" font-weight="600" fill="${shape.f ?? PALE}">${shape.text}</text>`;
  }
}

export function iconSvg(shapes: Shape[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">${shapes.map(render).join("")}</svg>`;
}
