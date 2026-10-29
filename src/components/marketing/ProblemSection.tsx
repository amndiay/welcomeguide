import { MessageCircleQuestion } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

export function ProblemSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.problem.eyebrow}
          title={t.problem.title}
          description={t.problem.description}
          align="center"
        />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.problem.questions.map((question) => (
            <li
              key={question}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background px-5 py-4 text-sm text-foreground transition-colors hover:border-accent/50"
            >
              <MessageCircleQuestion className="size-4 shrink-0 text-accent" />
              {question}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
