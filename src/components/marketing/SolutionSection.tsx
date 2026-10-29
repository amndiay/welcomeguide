import { Clock, Smartphone, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

const icons: LucideIcon[] = [Smartphone, Clock, Sparkles];

export function SolutionSection() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.solution.eyebrow}
        title={t.solution.title}
        description={t.solution.description}
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {t.solution.points.map((point, i) => {
          const Icon = icons[i] ?? Sparkles;
          return (
            <div
              key={point.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-card-foreground">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
