import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/marketing/PhoneMockup";
import { useLanguage } from "@/i18n/LanguageProvider";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-96 bg-gradient-to-b from-primary-soft to-transparent" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:gap-10 lg:pb-24">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="size-3.5 text-accent" />
            {t.site.promise}
          </span>
          <h1 className="mt-6 text-4xl font-semibold text-balance text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
            {t.site.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.site.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group rounded-full">
              <Link to="/connexion">
                {t.hero.primaryCta}
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/exemple">{t.hero.secondaryCta}</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{t.hero.note}</p>
        </div>

        <div className="reveal lg:justify-self-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
