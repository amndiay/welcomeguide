import { createFileRoute } from "@tanstack/react-router";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBand } from "@/components/marketing/CtaBand";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

const title = "FAQ Dalal — questions fréquentes sur les livrets d'accueil";
const description =
  "Comment fonctionne Dalal, compatibilité Airbnb, multi-logements, modification du livret : toutes les réponses.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="mx-auto w-full max-w-3xl px-4 pt-16 pb-4 sm:px-6 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow={t.faq.pageEyebrow}
          title={t.faq.pageTitle}
          align="center"
        />
      </section>
      <FaqAccordion />
      <div className="pt-16">
        <CtaBand />
      </div>
    </div>
  );
}
