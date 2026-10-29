import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { sampleGuidebooks } from "@/content/sample-guide";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export function SampleCard() {
  const { lang, t } = useLanguage();
  const { property, sections } = sampleGuidebooks[lang];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.sample.eyebrow}
        title={t.sample.title}
        align="center"
      />
      <Link
        to="/exemple"
        className="group mt-10 block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="gradient-primary flex items-center justify-between gap-4 px-7 py-8">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-primary-foreground/75 uppercase">
              {t.sample.label}
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-primary-foreground">
              {property.name} — {property.city}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-primary-foreground/85">
              <MapPin className="size-3.5" />
              {property.city}, {property.country}
            </p>
          </div>
          <ArrowUpRight className="size-6 shrink-0 text-primary-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <div className="flex flex-wrap gap-2 px-7 py-6">
          {sections.map((section) => (
            <span
              key={section.id}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              {section.title}
            </span>
          ))}
        </div>
      </Link>
    </section>
  );
}
