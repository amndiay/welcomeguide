import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/marketing/Hero";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { SolutionSection } from "@/components/marketing/SolutionSection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { StepsSection } from "@/components/marketing/StepsSection";
import { AudienceSection } from "@/components/marketing/AudienceSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { SampleCard } from "@/components/marketing/SampleCard";
import { PricingCards } from "@/components/marketing/PricingCards";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBand } from "@/components/marketing/CtaBand";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { useLanguage } from "@/i18n/LanguageProvider";

const title = "Dalal — Le livret d'accueil digital de votre location";
const description =
  "Créez en quelques minutes un livret d'accueil digital élégant pour vos voyageurs : Wi-Fi, check-in, règles, guide local et QR Code.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLanguage();

  return (
    <div>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <section className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.homeTitle}
          align="center"
        />
      </section>
      <FeatureGrid />
      <StepsSection />
      <AudienceSection />
      <TestimonialsSection />
      <SampleCard />
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
        <SectionHeading
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.homeTitle}
          align="center"
        />
      </section>
      <PricingCards />
      <FaqAccordion />
      <div className="pt-16 sm:pt-20">
        <CtaBand />
      </div>
    </div>
  );
}
