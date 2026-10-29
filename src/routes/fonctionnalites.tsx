import { createFileRoute } from "@tanstack/react-router";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { StepsSection } from "@/components/marketing/StepsSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { AudienceSection } from "@/components/marketing/AudienceSection";
import { useLanguage } from "@/i18n/LanguageProvider";

const title = "Fonctionnalités du livret d'accueil digital — Dalal";
const description =
  "Livret digital, QR Code, check-in, Wi-Fi, règles de la maison, guide local, équipements, check-out et contacts utiles : tout ce que contient un livret Dalal.";

export const Route = createFileRoute("/fonctionnalites")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-4 sm:px-6 sm:pt-24">
        <SectionHeading
          as="h1"
          eyebrow={t.features.eyebrow}
          title={t.features.pageTitle}
          description={t.features.pageDescription}
          align="center"
        />
      </section>
      <FeatureGrid />
      <StepsSection />
      <AudienceSection />
      <CtaBand />
    </div>
  );
}
