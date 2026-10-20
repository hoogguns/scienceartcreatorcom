import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Circle,
  Copy,
  Download,
  Minus,
  MousePointer2,
  Redo2,
  Square,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Glyph } from "@/components/glyph";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { draftFigure } from "@/lib/ai.functions";
import { EXAMPLE_PROMPTS, arrangeFromPrompt } from "@/lib/icons/arrange";
import { CATEGORIES, ICONS } from "@/lib/icons/catalog";
import type { Draft, IconCategory } from "@/lib/icons/types";
import { getLocalFigure, saveLocalFigure, type FigureFile } from "@/lib/local-figures";
import { getProject, saveProject } from "@/lib/projects.functions";
import {
  ART_PRESETS_PUBLIC,
  type ArtPreset,
  type Engine,
  type LayerInfo,
  type SelectionInfo,
  type Tool,
} from "./engine";

const EMPTY_SELECTION: SelectionInfo = {
  count: 0,
  label: "Nothing selected",
  opacity: 1,
  fontSize: null,
  text: null,
};

function slug(title: string) {
  const value = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return value || "figure";
}

export function StudioApp({
  initialId,
  source,
}: {
  initialId?: string;
  source?: "cloud";
}) {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const deskRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const titleRef = useRef("Untitled figure");
  const hydrated = useRef(false);
  const loadedFor = useRef<string | null>(null);

  const [ready, setReady] = useState(false);
  const [rev, setRev] = useState(0);
  const [title, setTitle] = useState("Untitled figure");
  const [tool, setTool] = useState<Tool>("select");
  const [userZoom, setUserZoom] = useState(1);
  const [art, setArt] = useState({ width: 1100, height: 760 });
  const [fitTick, setFitTick] = useState(0);
  const [category, setCategory] = useState<IconCategory | "all">("cells");
  const [query, setQuery] = useState("");
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [pending, setPending] = useState<Draft | null>(null);
  const [saveLabel, setSaveLabel] = useState("Not saved yet");
  const [mobile, setMobile] = useState<"canvas" | "icons" | "style" | "export">("canvas");
  const [textDraft, setTextDraft] = useState("");
  const [id, setId] = useState(initialId);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    if (initialId) {
      setId(initialId);
      return;
    }
    const created = crypto.randomUUID();
    setId(created);
    void navigate({ to: "/studio", search: { id: created }, replace: true });
  }, [initialId, navigate]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let dead = false;
    let engine: Engine | null = null;
    void import("./engine").then(async ({ createEngine }) => {
      if (dead) return;
      engine = await createEngine(host);
      if (dead) {
        engine.destroy();
        return;
      }
      engineRef.current = engine;
      setReady(true);
      setRev((n) => n + 1);
    });
    return () => {
      dead = true;
      engine?.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !ready) return;
    return engine.subscribe(() => setRev((n) => n + 1));
  }, [ready]);

  useEffect(() => {
    const desk = deskRef.current;
    if (!desk) return;
    const observer = new ResizeObserver(() => setFitTick((n) => n + 1));
    observer.observe(desk);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const desk = deskRef.current;
    const engine = engineRef.current;
    if (!desk || !engine || !ready) return;
    const fit = Math.min((desk.clientWidth - 32) / art.width, (desk.clientHeight - 32) / art.height);
    const scale = Math.min(2.4, Math.max(0.12, fit * userZoom));
    engine.setViewScale(scale);
  }, [art, userZoom, fitTick, ready]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!ready || !engine || !id) return;
    if (source === "cloud" && isPending) return;
    if (loadedFor.current === id) return;
    loadedFor.current = id;
    hydrated.current = false;
    let cancel = false;

    void (async () => {
      const local = getLocalFigure(id);
      if (source !== "cloud" && local) {
        await engine.loadFile(local.file);
        if (cancel) return;
        setTitle(local.title);
        setArt({ width: local.file.width, height: local.file.height });
        hydrated.current = true;
        setSaveLabel("Kept on this device");
        return;
      }
      if (user) {
        try {
          const remote = await getProject({ data: { id } });
          if (cancel) return;
          if (remote) {
            const file = JSON.parse(remote.canvasJson) as FigureFile;
            await engine.loadFile(file);
            setTitle(remote.title);
            setArt({ width: file.width, height: file.height });
            hydrated.current = true;
            setSaveLabel("Opened from your library");
            return;
          }
        } catch {
          /* fall through to local */
        }
      }
      if (local) {
        await engine.loadFile(local.file);
        if (cancel) return;
        setTitle(local.title);
        setArt({ width: local.file.width, height: local.file.height });
        setSaveLabel("Kept on this device");
      }
      hydrated.current = true;
    })();

    return () => {
      cancel = true;
    };
  }, [ready, id, source, user, isPending]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !ready || !id) return;
    let timer = 0;
    const unsub = engine.subscribe(() => {
      if (!hydrated.current) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const file = engine.snapshot();
        saveLocalFigure({
          id,
          title: titleRef.current,
          file,
          updatedAt: new Date().toISOString(),
        });
        setArt({ width: file.width, height: file.height });
        setSaveLabel("Kept on this device");
      }, 600);
    });
    return () => {
      unsub();
      window.clearTimeout(timer);
    };
  }, [ready, id]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const engine = engineRef.current;
      if (!engine) return;
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || engine.isEditing();
      if ((event.key === "Delete" || event.key === "Backspace") && !typing) {
        event.preventDefault();
        engine.deleteSelection();
      }
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) void engine.redo();
        else void engine.undo();
      }
      if (meta && event.key.toLowerCase() === "d") {
        event.preventDefault();
        void engine.duplicate();
      }
      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveCloud();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const engine = engineRef.current;
  const selection = engine?.selection() ?? EMPTY_SELECTION;
  const layers: LayerInfo[] = engine?.layers() ?? [];
  const history = engine?.canHistory() ?? { undo: false, redo: false };

  useEffect(() => {
    if (selection.text != null) setTextDraft(selection.text);
  }, [selection.text, selection.count, rev]);

  function chooseTool(next: Tool) {
    setTool(next);
    engineRef.current?.setTool(next);
    if (next === "text") {
      engineRef.current?.addText();
      setTool("select");
      engineRef.current?.setTool("select");
    }
  }

  function onTilePointerDown(event: React.PointerEvent, iconId: string) {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    const icon = ICONS.find((entry) => entry.id === iconId);
    const ghost = document.createElement("div");
    ghost.className = "drag-ghost";
    if (icon) ghost.innerHTML = icon.svg;
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
      if (!moved) {
        moved = true;
        document.body.appendChild(ghost);
      }
      ghost.style.transform = `translate(${ev.clientX + 12}px, ${ev.clientY + 12}px)`;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      ghost.remove();
      const current = engineRef.current;
      if (!current) return;
      const scene = moved ? current.clientToScene(ev.clientX, ev.clientY) : null;
      void current.addIcon(iconId, scene);
      setTool("select");
      setMobile("canvas");
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  async function apply(draft: Draft) {
    const current = engineRef.current;
    if (!current) return;
    await current.applyDraft(draft);
    setTitle(draft.title);
    setPending(null);
    setMobile("canvas");
    toast.success(draft.source === "grok" ? "Draft placed" : "Arrangement placed");
  }

  function requestDraft(draft: Draft) {
    const current = engineRef.current;
    if (!current) return;
    if (current.objectCount() > 0) setPending(draft);
    else void apply(draft);
  }

  async function saveCloud() {
    const current = engineRef.current;
    if (!current || !id) return;
    const file = current.snapshot();
    saveLocalFigure({
      id,
      title: titleRef.current,
      file,
      updatedAt: new Date().toISOString(),
    });
    if (!user) {
      setSaveLabel("Kept on this device");
      toast.message("Saved on this device. Sign in to keep a library copy.");
      return;
    }
    try {
      const result = await saveProject({
        data: { id, title: titleRef.current, canvasJson: JSON.stringify(file) },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSaveLabel("Saved to your library");
      toast.success("Saved to your library");
    } catch {
      toast.error("Could not reach your library");
    }
  }

  function download(filename: string, href: string) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    anchor.click();
  }

  function exportPNG() {
    const current = engineRef.current;
    if (!current) return;
    download(`${slug(title)}.png`, current.exportPNG(2));
  }

  function exportSVG() {
    const current = engineRef.current;
    if (!current) return;
    const blob = new Blob([current.exportSVG()], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    download(`${slug(title)}.svg`, url);
    URL.revokeObjectURL(url);
  }

  async function exportPDF() {
    const current = engineRef.current;
    if (!current) return;
    await current.exportPDF(3, `${slug(title)}.pdf`);
  }

  function fresh() {
    const next = crypto.randomUUID();
    loadedFor.current = next;
    hydrated.current = true;
    setTitle("Untitled figure");
    setId(next);
    const blank: FigureFile = {
      version: 1,
      width: 1100,
      height: 760,
      canvas: { objects: [] },
    };
    void engineRef.current?.loadFile(blank).then(() => {
      setArt({ width: 1100, height: 760 });
      setSaveLabel("New figure");
    });
    void navigate({ to: "/studio", search: { id: next }, replace: true });
  }

  const icons = ICONS.filter((icon) => {
    if (category !== "all" && icon.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return icon.name.toLowerCase().includes(q) || icon.tags.some((tag) => tag.includes(q));
  });

  const library = (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <input
        className="field"
        value={query}
        placeholder="Search icons"
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search icons"
      />
      <div className="chip-row">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
          All
        </FilterChip>
        {CATEGORIES.map((entry) => (
          <FilterChip key={entry.id} active={category === entry.id} onClick={() => setCategory(entry.id)}>
            {entry.label}
          </FilterChip>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-2 overflow-auto">
        {icons.map((icon) => (
          <button
            key={icon.id}
            type="button"
            className="press flex flex-col items-center gap-1 rounded-lg border border-line bg-card p-2 hover:bg-wash"
            onPointerDown={(event) => onTilePointerDown(event, icon.id)}
          >
            <Glyph svg={icon.svg} className="h-12 w-12" />
            <span className="line-clamp-2 text-center text-xs leading-tight text-muted">{icon.name}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">First draft</p>
        <textarea
          className="field h-20 py-2"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          aria-label="Describe the figure"
        />
        <div className="chip-row">
          {EXAMPLE_PROMPTS.map((example) => (
            <FilterChip key={example} active={prompt === example} onClick={() => setPrompt(example)}>
              {example}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="quiet" className="flex-1" onClick={() => requestDraft(arrangeFromPrompt(prompt))}>
            Arrange
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={aiBusy}
            onClick={() => {
              if (!user) {
                setAiError("Sign in to draft with Grok. Arrange works without an account.");
                return;
              }
              setAiBusy(true);
              setAiError(null);
              draftFigure({ data: { prompt } })
                .then((result) => {
                  if (!result.ok) setAiError(result.error);
                  else requestDraft(result.draft);
                })
                .catch(() => setAiError("Sign in to draft with Grok."))
                .finally(() => setAiBusy(false));
            }}
          >
            {aiBusy ? "Drafting…" : "Draft with Grok"}
          </Button>
        </div>
        {aiError ? <p className="text-sm text-danger">{aiError}</p> : null}
        {pending ? (
          <div className="rounded-lg border border-line bg-wash p-3">
            <p className="text-sm">Replace the current figure with this draft?</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => void apply(pending)}>
                Replace
              </Button>
              <Button size="sm" variant="quiet" onClick={() => setPending(null)}>
                Keep mine
              </Button>
            </div>
          </div>
        ) : null}
        <SignedOut>
          <p className="text-xs text-muted">Grok drafts need an account. Library arrange does not.</p>
        </SignedOut>
      </div>
    </div>
  );

  const inspector = (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-auto p-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Selection</p>
        <p className="mt-1 font-medium">{selection.label}</p>
      </div>
      <label className="block text-sm">
        Fill
        <input
          type="color"
          className="mt-1 h-11 w-full rounded-lg border border-line bg-card"
          defaultValue="#d5e6e3"
          onChange={(event) => engineRef.current?.setFill(event.target.value)}
          aria-label="Fill color"
        />
      </label>
      <label className="block text-sm">
        Stroke
        <input
          type="color"
          className="mt-1 h-11 w-full rounded-lg border border-line bg-card"
          defaultValue="#24343c"
          onChange={(event) => engineRef.current?.setStroke(event.target.value)}
          aria-label="Stroke color"
        />
      </label>
      <label className="block text-sm">
        Stroke width
        <input
          type="range"
          min={1}
          max={12}
          defaultValue={2}
          className="mt-2 w-full"
          onChange={(event) => engineRef.current?.setStrokeWidth(Number(event.target.value))}
        />
      </label>
      <label className="block text-sm">
        Opacity
        <input
          type="range"
          min={0.15}
          max={1}
          step={0.05}
          value={selection.opacity}
          className="mt-2 w-full"
          onChange={(event) => engineRef.current?.setOpacity(Number(event.target.value))}
        />
      </label>
      {selection.text != null ? (
        <>
          <label className="block text-sm">
            Text
            <textarea
              className="field mt-1 h-20 py-2"
              value={textDraft}
              onChange={(event) => {
                setTextDraft(event.target.value);
                engineRef.current?.setText(event.target.value, false);
              }}
              onBlur={() => engineRef.current?.commitNow()}
            />
          </label>
          <label className="block text-sm">
            Type size
            <input
              type="range"
              min={12}
              max={72}
              value={selection.fontSize ?? 22}
              className="mt-2 w-full"
              onChange={(event) => engineRef.current?.setFontSize(Number(event.target.value))}
            />
          </label>
        </>
      ) : null}
      <div className="grid grid-cols-3 gap-2">
        {(["left", "center", "right", "top", "middle", "bottom"] as const).map((mode) => (
          <Button key={mode} size="sm" variant="quiet" onClick={() => engineRef.current?.align(mode)}>
            {mode}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="quiet" onClick={() => engineRef.current?.bringForward()}>
          Forward
        </Button>
        <Button size="sm" variant="quiet" onClick={() => engineRef.current?.sendBackward()}>
          Back
        </Button>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Export</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="quiet" onClick={exportPNG}>
            PNG
          </Button>
          <Button size="sm" variant="quiet" onClick={exportSVG}>
            SVG
          </Button>
          <Button size="sm" variant="quiet" onClick={() => void exportPDF()}>
            PDF
          </Button>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Layers</p>
        <ul className="mt-2 space-y-1">
          {layers.length === 0 ? <li className="text-sm text-muted">Empty plate</li> : null}
          {layers.map((layer) => (
            <li key={layer.index} className="flex items-center gap-2">
              <button
                type="button"
                className="press min-h-9 flex-1 truncate rounded-lg px-2 text-left text-sm hover:bg-wash"
                onClick={() => engineRef.current?.selectLayer(layer.index)}
              >
                {layer.label}
              </button>
              <button
                type="button"
                className="press h-9 rounded-lg px-2 text-xs text-muted hover:bg-wash"
                onClick={() => engineRef.current?.toggleLayer(layer.index)}
              >
                {layer.visible ? "Hide" : "Show"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const exportPanel = (
    <div className="flex flex-col gap-2 p-3">
      <Button variant="quiet" onClick={exportPNG}>
        <Download className="size-4" /> PNG
      </Button>
      <Button variant="quiet" onClick={exportSVG}>
        <Download className="size-4" /> SVG
      </Button>
      <Button variant="quiet" onClick={() => void exportPDF()}>
        <Download className="size-4" /> Print PDF
      </Button>
      <p className="text-xs text-muted">PNG is 2×. PDF is sized from the page at higher resolution.</p>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-card px-2 md:px-3">
        <Link to="/" className="hidden shrink-0 font-display text-base tracking-tight sm:block">
          Science Art
        </Link>
        <input
          className="field h-9 min-w-0 flex-1"
          value={title}
          aria-label="Figure title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <span className="hidden max-w-40 truncate text-xs text-muted lg:inline">{saveLabel}</span>
        <Button size="sm" variant="quiet" onClick={fresh}>
          New
        </Button>
        <Button size="sm" onClick={() => void saveCloud()}>
          Save
        </Button>
        <Link to="/projects" className="press hidden h-9 items-center rounded-lg px-3 text-sm font-medium hover:bg-wash md:inline-flex">
          Figures
        </Link>
        <SignedIn>
          <span className="hidden text-xs text-muted xl:inline">Library on</span>
        </SignedIn>
        <SignedOut>
          <Link to="/login" className="press hidden h-9 items-center rounded-lg px-3 text-sm font-medium hover:bg-wash sm:inline-flex">
            Sign in
          </Link>
        </SignedOut>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-80 shrink-0 border-r border-line bg-paper md:flex md:flex-col">{library}</aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-line bg-card px-2 py-1">
            <ToolButton label="Select" active={tool === "select"} onClick={() => chooseTool("select")}>
              <MousePointer2 className="size-4" />
            </ToolButton>
            <ToolButton label="Text" active={false} onClick={() => chooseTool("text")}>
              <Type className="size-4" />
            </ToolButton>
            <ToolButton label="Rectangle" active={tool === "rect"} onClick={() => chooseTool("rect")}>
              <Square className="size-4" />
            </ToolButton>
            <ToolButton label="Ellipse" active={tool === "ellipse"} onClick={() => chooseTool("ellipse")}>
              <Circle className="size-4" />
            </ToolButton>
            <ToolButton label="Line" active={tool === "line"} onClick={() => chooseTool("line")}>
              <Minus className="size-4" />
            </ToolButton>
            <ToolButton label="Arrow" active={tool === "arrow"} onClick={() => chooseTool("arrow")}>
              <ArrowRight className="size-4" />
            </ToolButton>
            <span className="mx-1 h-6 w-px bg-line" />
            <ToolButton label="Undo" active={false} disabled={!history.undo} onClick={() => void engine?.undo()}>
              <Undo2 className="size-4" />
            </ToolButton>
            <ToolButton label="Redo" active={false} disabled={!history.redo} onClick={() => void engine?.redo()}>
              <Redo2 className="size-4" />
            </ToolButton>
            <ToolButton label="Duplicate" active={false} onClick={() => void engine?.duplicate()}>
              <Copy className="size-4" />
            </ToolButton>
            <ToolButton label="Delete" active={false} onClick={() => engine?.deleteSelection()}>
              <Trash2 className="size-4" />
            </ToolButton>
            <label className="ml-auto flex items-center gap-2 text-xs text-muted">
              Page
              <select
                className="field-inline"
                value={
                  art.width === 900 ? "square" : art.width === 1200 ? "slide" : "journal"
                }
                onChange={(event) => {
                  const preset = event.target.value as ArtPreset;
                  const size = ART_PRESETS_PUBLIC[preset];
                  engineRef.current?.setArtboard(size.width, size.height);
                  setArt(size);
                }}
              >
                <option value="journal">Journal</option>
                <option value="square">Square</option>
                <option value="slide">Slide</option>
              </select>
            </label>
            <ToolButton label="Zoom out" active={false} onClick={() => setUserZoom((z) => Math.max(0.4, z - 0.15))}>
              −
            </ToolButton>
            <ToolButton label="Zoom in" active={false} onClick={() => setUserZoom((z) => Math.min(2.2, z + 0.15))}>
              +
            </ToolButton>
          </div>
          <div ref={deskRef} className="desk min-h-0 flex-1 overflow-auto p-4">
            <div ref={hostRef} className="stage-host" />
            {!ready ? <p className="mt-6 text-center text-sm text-muted">Opening the plate…</p> : null}
          </div>
          <p className="hidden shrink-0 border-t border-line bg-card px-3 py-1 text-xs text-muted md:block">
            Drag icons onto the plate. Handles resize and rotate. Delete removes a selection.
          </p>
        </div>
        <aside className="hidden w-72 shrink-0 border-l border-line bg-paper lg:block">{inspector}</aside>
      </div>

      {mobile !== "canvas" ? (
        <div className="absolute inset-x-0 bottom-14 top-14 z-20 overflow-auto border-t border-line bg-paper md:hidden">
          {mobile === "icons" ? library : null}
          {mobile === "style" ? inspector : null}
          {mobile === "export" ? exportPanel : null}
        </div>
      ) : null}

      <nav className="flex h-14 shrink-0 border-t border-line bg-card md:hidden">
        {(
          [
            ["canvas", "Plate"],
            ["icons", "Icons"],
            ["style", "Style"],
            ["export", "Export"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`press flex-1 text-sm font-medium ${mobile === key ? "text-accent" : "text-muted"}`}
            onClick={() => setMobile(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="hidden border-t border-line bg-card px-3 py-2 md:flex md:items-center md:gap-2 lg:hidden">
        {exportPanel}
      </div>
    </div>
  );
}

function ToolButton({
  children,
  label,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`press inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-sm ${
        active ? "bg-accent text-accent-fg" : "hover:bg-wash"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press h-9 shrink-0 rounded-full px-3 text-sm ${
        active ? "bg-accent text-accent-fg" : "bg-card text-ink border border-line"
      }`}
    >
      {children}
    </button>
  );
}
