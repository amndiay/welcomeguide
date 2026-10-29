import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

export function StepsSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.steps.eyebrow}
          title={t.steps.title}
          align="center"
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.items.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border bg-background p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="gradient-primary flex size-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
