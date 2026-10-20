export type FigureFile = {
  version: 1;
  width: number;
  height: number;
  canvas: unknown;
};

export type LocalFigure = {
  id: string;
  title: string;
  file: FigureFile;
  updatedAt: string;
};

const KEY = "sac.figures.v1";

function readAll(): LocalFigure[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalFigure[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(figures: LocalFigure[]) {
  localStorage.setItem(KEY, JSON.stringify(figures.slice(0, 30)));
}

export function listLocalFigures(): LocalFigure[] {
  return readAll().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getLocalFigure(id: string): LocalFigure | undefined {
  return readAll().find((figure) => figure.id === id);
}

export function saveLocalFigure(figure: LocalFigure) {
  const rest = readAll().filter((item) => item.id !== figure.id);
  writeAll([figure, ...rest]);
}

export function deleteLocalFigure(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
}
