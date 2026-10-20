import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "quiet" | "ghost";
  size?: "md" | "sm" | "icon";
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-accent text-accent-fg hover:bg-ink",
  quiet: "border border-line bg-card text-ink hover:bg-wash",
  ghost: "text-ink hover:bg-wash",
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  md: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
  icon: "size-11",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
