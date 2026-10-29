import { createFileRoute } from "@tanstack/react-router";
import { PricingCards } from "@/components/marketing/PricingCards";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

const title = "Tarifs Dalal — livrets d'accueil pour hôtes et conciergeries";
const description =
  "Free Trial, Host ou Concierge : choisissez l'offre Dalal adaptée à votre nombre de logements. Essai gratuit, sans carte bancaire.";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.pageTitle}
          description={t.pricing.pageDescription}
          align="center"
        />
      </section>
      <PricingCards />
      <FaqAccordion />
    </div>
  );
}
