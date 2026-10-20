import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { OFFERS, isPlanId, type PlanId } from "@/lib/plans";

export type BillingState = {
  plan: PlanId;
  billingLive: boolean;
  status: string;
};

async function readPlan(userId: string): Promise<{ plan: PlanId; status: string }> {
  const sql = await getSql();
  const rows = await sql<{ plan: string; status: string }>`
    select plan, status from subscriptions where user_id = ${userId}
  `;
  const plan = rows[0]?.plan ?? "free";
  return {
    plan: isPlanId(plan) ? plan : "free",
    status: rows[0]?.status ?? "active",
  };
}

export const getBilling = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<BillingState> => {
    const current = await readPlan(context.userId);
    return {
      ...current,
      billingLive: Boolean(process.env.STRIPE_SECRET_KEY),
    };
  });

function priceEnv(plan: Exclude<PlanId, "free">): string | undefined {
  const offer = OFFERS.find((item) => item.id === plan);
  if (!offer) return undefined;
  return process.env[offer.envPrice];
}

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { plan: string; origin: string }) => {
    if (!input || (input.plan !== "starter" && input.plan !== "unlimited" && input.plan !== "lifetime")) {
      throw new Error("Unknown plan");
    }
    let origin: string;
    try {
      const url = new URL(input.origin);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("bad");
      origin = url.origin;
    } catch {
      throw new Error("Invalid return address");
    }
    return { plan: input.plan as Exclude<PlanId, "free">, origin };
  })
  .handler(async ({ context, data }) => {
    const secret = process.env.STRIPE_SECRET_KEY;
    const price = priceEnv(data.plan);
    if (!secret || !price) {
      return {
        ok: false as const,
        error: "Checkout is not connected yet. You can still draw and export.",
      };
    }

    const mode = data.plan === "lifetime" ? "payment" : "subscription";
    const body = new URLSearchParams();
    body.set("mode", mode);
    body.set("line_items[0][price]", price);
    body.set("line_items[0][quantity]", "1");
    body.set("success_url", `${data.origin}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
    body.set("cancel_url", `${data.origin}/pricing?checkout=cancel`);
    body.set("client_reference_id", context.userId);
    body.set("metadata[userId]", context.userId);
    body.set("metadata[plan]", data.plan);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) return { ok: false as const, error: "Stripe did not open a checkout" };
    const json = (await res.json()) as { url?: string };
    if (!json.url) return { ok: false as const, error: "Stripe did not return a checkout link" };
    return { ok: true as const, url: json.url };
  });

export const confirmCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { sessionId: string }) => {
    if (!input?.sessionId || !/^cs_[A-Za-z0-9_]+$/.test(input.sessionId)) {
      throw new Error("Invalid checkout");
    }
    return input;
  })
  .handler(async ({ context, data }) => {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return { ok: false as const, error: "Checkout is not connected" };
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${data.sessionId}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!res.ok) return { ok: false as const, error: "Could not confirm checkout" };
    const session = (await res.json()) as {
      payment_status?: string;
      status?: string;
      customer?: string;
      subscription?: string;
      metadata?: { userId?: string; plan?: string };
      client_reference_id?: string;
    };
    const userId = session.metadata?.userId || session.client_reference_id;
    const plan = session.metadata?.plan ?? "";
    const paid = session.payment_status === "paid" || session.status === "complete";
    if (!paid || userId !== context.userId || !isPlanId(plan) || plan === "free") {
      return { ok: false as const, error: "This checkout is not paid for your account" };
    }
    const sql = await getSql();
    await sql`
      insert into subscriptions (user_id, plan, status, stripe_customer, stripe_subscription, updated_at)
      values (
        ${context.userId},
        ${plan},
        ${"active"},
        ${session.customer ?? null},
        ${session.subscription ?? null},
        now()
      )
      on conflict (user_id) do update set
        plan = excluded.plan,
        status = excluded.status,
        stripe_customer = excluded.stripe_customer,
        stripe_subscription = excluded.stripe_subscription,
        updated_at = now()
    `;
    return { ok: true as const, plan };
  });
