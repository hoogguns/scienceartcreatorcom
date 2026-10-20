import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { next?: "pricing" } => {
    if (search.next === "pricing") return { next: "pricing" };
    return {};
  },
  component: Login,
});

function Login() {
  const { next } = Route.useSearch();
  const callbackURL = next === "pricing" ? "/pricing" : "/studio";
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <section className="mx-auto w-full max-w-md px-4 py-12">
        <div className="plate">
          <h1 className="font-display text-3xl">Sign in</h1>
          <p className="mt-2 text-muted">
            Your figures stay in a private library. The studio still works on this device before you sign in.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            {authEnabled ? (
              GROK_PROVIDERS.map((provider) => (
                <button
                  key={provider.providerId}
                  type="button"
                  onClick={() => signIn(provider.providerId, { callbackURL })}
                  className="press h-11 rounded-lg border border-line bg-card px-4 text-sm font-medium hover:bg-wash"
                >
                  Continue with {provider.label}
                </button>
              ))
            ) : (
              <p className="text-sm text-muted">Sign-in is not available in this build.</p>
            )}
          </div>
          <Link to="/studio" className="mt-4 inline-block text-sm font-medium text-accent">
            Continue without an account
          </Link>
        </div>
      </section>
    </main>
  );
}
