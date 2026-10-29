export interface PlanConfig {
  id: "free_trial" | "host" | "concierge";
  /** Configurable later — set to null for a quote-based plan. */
  price: number | null;
  currency: string;
  highlighted?: boolean;
}

export const currency = "XOF";

/** Plans, in the same order as the translated `pricing.plans` entries. */
export const plans: PlanConfig[] = [
  { id: "free_trial", price: 0, currency },
  { id: "host", price: 5900, currency, highlighted: true },
  { id: "concierge", price: 25000, currency },
];

export function formatPrice(plan: PlanConfig, quoteLabel: string): string {
  if (plan.price === null) return quoteLabel;
  // Non-breaking spaces as thousands separator, e.g. "5 900 FCFA".
  const amount = plan.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return `${amount} FCFA`;
}
