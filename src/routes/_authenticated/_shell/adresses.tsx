import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAppCopy } from "@/hooks/use-app-copy";
import { listPlaces } from "@/lib/airtable.functions";

export const Route = createFileRoute("/_authenticated/_shell/adresses")({
  head: () => ({
    meta: [{ title: "Bonnes adresses — Dalal" }, { name: "robots", content: "noindex" }],
  }),
  component: PlacesPage,
});

function PlacesPage() {
  const copy = useAppCopy();
  const [category, setCategory] = useState<string | null>(null);
  const fetchPlaces = useServerFn(listPlaces);

  const places = useQuery({
    queryKey: ["places"],
    queryFn: () => fetchPlaces({ data: {} }),
  });

  const rows = places.data ?? [];
  const categories = Array.from(
    new Set(rows.map((place) => place.category).filter(Boolean) as string[]),
  );
  const filtered = category
    ? rows.filter((place) => place.category === category)
    : rows;

  return (
    <>
      <PageHeader title={copy.places.title} description={copy.places.subtitle} />

      {categories.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={category === null ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setCategory(null)}
          >
            {copy.places.all}
          </Button>
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      )}

      {places.isLoading ? (
        <p className="text-sm text-muted-foreground">{copy.loading}</p>
      ) : places.isError ? (
        <p className="text-sm text-destructive">{copy.places.error}</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {copy.places.empty}
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((place) => (
            <li
              key={place.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-card-foreground">{place.name}</p>
                {place.featured && (
                  <Star className="size-4 shrink-0 text-accent" aria-hidden />
                )}
              </div>
              {place.category && (
                <Badge variant="secondary" className="mt-2">
                  {place.category}
                </Badge>
              )}
              {place.description && (
                <p className="mt-3 text-sm text-muted-foreground">{place.description}</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                {[place.address, place.city].filter(Boolean).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        {copy.places.managedInAirtable}
      </p>
    </>
  );
}
