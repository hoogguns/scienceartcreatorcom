export const PLAN_IDS = ["free", "starter", "unlimited", "lifetime"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type PlanOffer = {
  id: Exclude<PlanId, "free">;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  envPrice: string;
};

export const OFFERS: PlanOffer[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$12",
    cadence: "per month",
    blurb: "For a paper, a talk, and the revisions after review.",
    features: [
      "40 saved figures",
      "PNG, SVG, and print PDF",
      "3× raster export",
      "Grok first drafts",
    ],
    envPrice: "STRIPE_PRICE_STARTER",
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "$29",
    cadence: "per month",
    blurb: "A bench that publishes every week.",
    features: [
      "Unlimited saved figures",
      "4× print export",
      "Higher daily draft allowance",
      "Priority on new icon sets",
    ],
    envPrice: "STRIPE_PRICE_UNLIMITED",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$149",
    cadence: "once",
    blurb: "The studio, kept. No renewal.",
    features: [
      "Everything in Unlimited",
      "One payment",
      "Figures stay in your library",
      "Future icon packs included",
    ],
    envPrice: "STRIPE_PRICE_LIFETIME",
  },
];

export function isPlanId(value: string): value is PlanId {
  return (PLAN_IDS as readonly string[]).includes(value);
}

export function projectCap(plan: PlanId): number | null {
  if (plan === "free") return 8;
  if (plan === "starter") return 40;
  return null;
}

export function dailyDraftCap(plan: PlanId): number {
  if (plan === "unlimited" || plan === "lifetime") return 40;
  if (plan === "starter") return 20;
  return 8;
}
