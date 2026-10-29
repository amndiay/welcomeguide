import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans, formatPrice } from "@/content/pricing";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";

export function PricingCards() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const text = t.pricing.plans[i];
          if (!text) return null;
          return (
            <article
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1",
                plan.highlighted
                  ? "border-primary/50 ring-1 ring-primary/25 lg:scale-[1.02]"
                  : "border-border",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {t.pricing.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold text-card-foreground">
                {text.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {text.tagline}
              </p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold text-card-foreground">
                  {formatPrice(plan, t.pricing.quote)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {text.period}
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {text.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 rounded-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link to={plan.id === "concierge" ? "/contact" : "/connexion"}>
                  {text.cta}
                </Link>
              </Button>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        {t.pricing.note}
      </p>
    </section>
  );
}
