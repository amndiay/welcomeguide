import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

export function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={t.testimonials.eyebrow}
        title={t.testimonials.title}
        description={t.testimonials.description}
        align="center"
      />

      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {t.testimonials.items.map((item) => (
          <li
            key={item.name}
            className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-soft"
          >
            <Quote className="size-6 text-accent" aria-hidden />
            <blockquote className="mt-4 flex-1 text-base leading-relaxed text-card-foreground">
              “{item.quote}”
            </blockquote>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-deep">
                {item.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-card-foreground">
                  {item.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.role} · {item.city}
                </p>
              </div>
              <span className="ml-auto flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-3.5 fill-accent text-accent"
                  />
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
