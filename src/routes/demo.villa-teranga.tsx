import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GuidebookView } from "@/components/guidebook/GuidebookView";
import { PhoneFrame } from "@/components/guidebook/PhoneFrame";
import { sampleGuidebooks } from "@/content/sample-guide";
import { useLanguage } from "@/i18n/LanguageProvider";

const title = "Démo livret voyageur — Villa Teranga, Dakar | Dalal";
const description =
  "Testez l'expérience voyageur Dalal : accès rapide Wi-Fi, itinéraire, contact hôte, arrivée, départ et bonnes adresses, sur mobile.";

export const Route = createFileRoute("/demo/villa-teranga")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const { lang, t } = useLanguage();

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 pt-10 text-center sm:px-6">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          {t.example.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Villa Teranga — Dakar</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.example.description}</p>
      </div>
      <PhoneFrame className="mt-8">
        <GuidebookView guidebook={sampleGuidebooks[lang]} variant="framed" />
      </PhoneFrame>
      <div className="mx-auto max-w-2xl px-4 pt-12 pb-20 text-center sm:px-6">
        <Button asChild size="lg" className="rounded-full">
          <Link to="/connexion">{t.example.cta}</Link>
        </Button>
      </div>
    </div>
  );
}
