import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Home, BookOpen, Send, Eye, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PropertyImage } from "@/components/dashboard/PropertyImage";
import { useAppCopy } from "@/hooks/use-app-copy";
import { getMe } from "@/lib/account.functions";
import { getDashboardStats } from "@/lib/guides.functions";
import { listProperties } from "@/lib/properties.functions";

export const Route = createFileRoute("/_authenticated/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Dalal" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const copy = useAppCopy();
  const navigate = useNavigate();
  const fetchMe = useServerFn(getMe);
  const fetchStats = useServerFn(getDashboardStats);
  const fetchProperties = useServerFn(listProperties);

  const me = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => fetchStats() });
  const properties = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
  });

  // New accounts finish the setup wizard before landing here.
  useEffect(() => {
    if (me.data?.profile && me.data.profile.onboarding_completed === false) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [me.data, navigate]);

  const firstName = me.data?.profile?.first_name;
  const cards = [
    { icon: Home, label: copy.dashboard.statProperties, value: stats.data?.properties },
    { icon: BookOpen, label: copy.dashboard.statGuides, value: stats.data?.guides },
    { icon: Send, label: copy.dashboard.statPublished, value: stats.data?.publishedGuides },
    { icon: Eye, label: copy.dashboard.statViews, value: stats.data?.guideViews },
  ];

  const active = (properties.data ?? []).filter((p) => p.status !== "archived");

  return (
    <>
      <PageHeader
        title={`${copy.dashboard.greeting}${firstName ? ` ${firstName}` : ""} 👋`}
        description={copy.dashboard.subtitle}
        action={
          <Button asChild className="rounded-full">
            <Link to="/logements/nouveau">
              <Plus className="mr-1.5 size-4" />
              {copy.dashboard.addProperty}
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <card.icon className="size-5 text-primary" aria-hidden />
            <p className="mt-3 text-2xl font-semibold text-card-foreground">
              {card.value ?? "—"}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {copy.dashboard.quickActions}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/logements/nouveau">
              <Plus className="mr-1.5 size-4" />
              {copy.dashboard.addProperty}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/livrets">
              <BookOpen className="mr-1.5 size-4" />
              {copy.dashboard.createGuide}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/adresses">
              <MapPin className="mr-1.5 size-4" />
              {copy.dashboard.browsePlaces}
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {copy.dashboard.recentProperties}
        </h2>

        {properties.isLoading ? (
          <p className="text-sm text-muted-foreground">{copy.loading}</p>
        ) : active.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{copy.dashboard.empty}</p>
            <Button asChild className="mt-4 rounded-full">
              <Link to="/logements/nouveau">{copy.dashboard.emptyCta}</Link>
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {active.slice(0, 6).map((property) => (
              <li key={property.id}>
                <Link
                  to="/logements/$propertyId"
                  params={{ propertyId: property.id }}
                  className="block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
                >
                  <PropertyImage
                    path={property.cover_image_url}
                    alt={property.name}
                    className="h-36 w-full"
                  />
                  <div className="p-4">
                    <p className="font-semibold text-card-foreground">{property.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[property.city, property.country].filter(Boolean).join(", ") ||
                        copy.propertyTypes[property.type]}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
