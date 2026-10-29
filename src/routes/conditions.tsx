import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

const title = "Conditions générales d'utilisation — Dalal";
const description =
  "Les conditions d'utilisation du service Dalal : compte, contenus des livrets, abonnements et responsabilités.";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading as="h1" eyebrow={t.legal.eyebrow} title={t.legal.termsTitle} />
      <div className="mt-10 space-y-6">
        {t.legal.terms.map((block) => (
          <div key={block.heading}>
            <h2 className="text-base font-semibold text-foreground">
              {block.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {block.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
