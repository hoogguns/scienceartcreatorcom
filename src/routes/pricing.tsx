import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { confirmCheckout, getBilling, startCheckout } from "@/lib/billing.functions";
import { OFFERS, type PlanId } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>): { checkout?: string; session_id?: string } => {
    const out: { checkout?: string; session_id?: string } = {};
    if (typeof search.checkout === "string") out.checkout = search.checkout;
    if (typeof search.session_id === "string") out.session_id = search.session_id;
    return out;
  },
  component: Pricing,
});

function Pricing() {
  const search = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [plan, setPlan] = useState<PlanId>("free");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancel = false;
    getBilling()
      .then((state) => {
        if (cancel) return;
        setPlan(state.plan);
        if (!state.billingLive) {
          setNote("Checkout is not connected yet. Drawing and export stay available.");
        }
      })
      .catch(() => {
        if (!cancel) setNote(null);
      });
    return () => {
      cancel = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !search.session_id || search.checkout !== "success") return;
    confirmCheckout({ data: { sessionId: search.session_id } })
      .then((result) => {
        if (result.ok) {
          setPlan(result.plan);
          toast.success("Plan updated");
        } else {
          toast.error(result.error);
        }
      })
      .catch(() => toast.error("Could not confirm checkout"));
  }, [user, search.session_id, search.checkout]);

  async function checkout(id: "starter" | "unlimited" | "lifetime") {
    setBusy(id);
    try {
      const result = await startCheckout({
        data: { plan: id, origin: window.location.origin },
      });
      if (!result.ok) {
        setNote(result.error);
        toast.message(result.error);
        return;
      }
      window.location.href = result.url;
    } catch {
      toast.error("Checkout did not start");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="font-display text-4xl tracking-tight">Plans</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Starter, Unlimited, and Lifetime. Free includes the full editor, local figures, and standard export.
          Paid plans raise the library limit once checkout is connected.
        </p>
        {note ? <p className="mt-4 max-w-2xl text-sm text-accent">{note}</p> : null}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {OFFERS.map((offer) => (
            <article key={offer.id} className="plate flex flex-col">
              <h2 className="font-display text-2xl">{offer.name}</h2>
              <p className="mt-2 text-muted">{offer.blurb}</p>
              <p className="mt-4 font-display text-4xl tabular-nums">
                {offer.price}
                <span className="ml-2 font-sans text-base text-muted">{offer.cadence}</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {offer.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="mt-6">
                {isPending ? null : user ? (
                  <Button
                    className="w-full"
                    variant={plan === offer.id ? "quiet" : "primary"}
                    disabled={busy !== null || plan === offer.id}
                    onClick={() => checkout(offer.id)}
                  >
                    {plan === offer.id ? "Current plan" : busy === offer.id ? "Opening…" : "Choose plan"}
                  </Button>
                ) : (
                  <SignedOut>
                    <Link to="/login" search={{ next: "pricing" }}>
                      <Button className="w-full" variant="quiet">
                        Sign in to choose
                      </Button>
                    </Link>
                  </SignedOut>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          Current library plan: <span className="font-medium text-ink">{user ? plan : "free on this device"}</span>.
          {" "}
          <Link to="/studio" className="font-medium text-accent">
            Return to the studio
          </Link>
        </p>
        <SignedIn>{null}</SignedIn>
      </section>
    </main>
  );
}
