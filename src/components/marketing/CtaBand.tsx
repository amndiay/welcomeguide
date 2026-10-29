import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";

export function CtaBand() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <div className="gradient-primary relative overflow-hidden rounded-3xl px-6 py-14 text-center shadow-lift sm:px-12">
        <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-accent/25 blur-3xl" />
        <h2 className="relative text-2xl font-semibold text-balance text-primary-foreground sm:text-3xl">
          {t.cta.title}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
          {t.cta.description}
        </p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to="/connexion">{t.cta.primary}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
          >
            <Link to="/exemple">{t.cta.secondary}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
