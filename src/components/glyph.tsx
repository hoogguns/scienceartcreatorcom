import { cn } from "@/lib/cn";

export function Glyph({ svg, className }: { svg: string; className?: string }) {
  return <span className={cn("glyph", className)} dangerouslySetInnerHTML={{ __html: svg }} />;
}
