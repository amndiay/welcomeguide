import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GuestGuidebook } from "@/components/guest/GuestGuidebook";
import { useLanguage } from "@/i18n/LanguageProvider";
import { guestCopy } from "@/i18n/guestCopy";
import { getPublicGuide, trackGuideEvent } from "@/lib/public-guide.functions";

export const Route = createFileRoute("/livret/$slug")({
  loader: ({ params }) => getPublicGuide({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Livret introuvable — Dalal" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const name = loaderData.property?.name ?? loaderData.title;
    const city = loaderData.property?.city;
    const title = `${name}${city ? ` — ${city}` : ""} | Livret d'accueil`;
    const description =
      loaderData.welcome_message?.slice(0, 155) ??
      `Wi-Fi, arrivée, équipements, bonnes adresses : tout votre séjour${city ? ` à ${city}` : ""} dans un livret digital.`;
    const image = loaderData.cover_image_url?.startsWith("https://")
      ? loaderData.cover_image_url
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
    };
  },
  component: PublicGuidePage,
});

function PublicGuidePage() {
  const guide = Route.useLoaderData();
  const { lang } = useLanguage();
  const copy = guestCopy[lang];

  useEffect(() => {
    if (!guide) return;
    void trackGuideEvent({
      data: { guideId: guide.id, eventType: "guide_view" },
    }).catch(() => undefined);
  }, [guide]);

  if (!guide) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">{copy.notFoundTitle}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{copy.notFoundBody}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">{copy.backHome}</Link>
        </Button>
      </div>
    );
  }

  return <GuestGuidebook guide={guide} />;
}
