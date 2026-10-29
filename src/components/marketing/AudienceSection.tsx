import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

function Column({
  eyebrow,
  title,
  items,
  tone,
}: {
  eyebrow: string;
  title: string;
  items: readonly { title: string; description: string }[];
  tone: "primary" | "accent";
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9">
      <span
        className={
          tone === "primary"
            ? "inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold tracking-wide text-primary-deep uppercase"
            : "inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold tracking-wide text-primary-deep uppercase"
        }
      >
        {eyebrow}
      </span>
      <h3 className="mt-4 text-2xl font-semibold text-card-foreground">
        {title}
      </h3>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span
              className={
                tone === "primary"
                  ? "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  : "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
              }
            >
              <Check className="size-3.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                {item.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AudienceSection() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-5 lg:grid-cols-2">
        <Column
          eyebrow={t.audience.hostEyebrow}
          title={t.audience.hostTitle}
          items={t.audience.hostItems}
          tone="primary"
        />
        <Column
          eyebrow={t.audience.conciergeEyebrow}
          title={t.audience.conciergeTitle}
          items={t.audience.conciergeItems}
          tone="accent"
        />
      </div>
    </section>
  );
}
