import { Info } from "lucide-react";
import { featureIcons } from "@/content/features";
import { useLanguage } from "@/i18n/LanguageProvider";

export function FeatureGrid() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.features.items.map((feature, i) => {
          const Icon = featureIcons[i] ?? Info;
          return (
            <article
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary-deep transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
