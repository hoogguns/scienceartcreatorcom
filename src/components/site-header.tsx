import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";

export function SiteHeader({ tone = "plain" }: { tone?: "plain" | "studio" }) {
  return (
    <header
      className={
        tone === "studio"
          ? "flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-card px-3 md:px-4"
          : "mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4"
      }
    >
      <Link to="/" className="font-display text-lg leading-none tracking-tight text-ink">
        Science Art Creator
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2">
        <Link to="/studio" className="press hidden h-9 items-center rounded-lg px-3 text-sm font-medium hover:bg-wash sm:inline-flex">
          Studio
        </Link>
        <Link to="/projects" className="press hidden h-9 items-center rounded-lg px-3 text-sm font-medium hover:bg-wash sm:inline-flex">
          Figures
        </Link>
        <Link to="/pricing" className="press h-9 items-center rounded-lg px-3 text-sm font-medium hover:bg-wash inline-flex">
          Pricing
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link to="/login" className="press inline-flex h-9 items-center rounded-lg bg-accent px-3 text-sm font-medium text-accent-fg">
            Sign in
          </Link>
        </SignedOut>
      </nav>
    </header>
  );
}
