import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Archive, RotateCcw, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PropertyImage } from "@/components/dashboard/PropertyImage";
import { useAppCopy } from "@/hooks/use-app-copy";
import { listProperties, setPropertyStatus } from "@/lib/properties.functions";

export const Route = createFileRoute("/_authenticated/_shell/logements/")({
  head: () => ({ meta: [{ title: "Logements — Dalal" }, { name: "robots", content: "noindex" }] }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const copy = useAppCopy();
  const queryClient = useQueryClient();
  const [showArchived, setShowArchived] = useState(false);

  const fetchProperties = useServerFn(listProperties);
  const changeStatus = useServerFn(setPropertyStatus);

  const properties = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
  });

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: "active" | "archived" }) =>
      changeStatus({ data: input }),
    onSuccess: (_result, input) => {
      toast.success(
        input.status === "archived"
          ? copy.properties.archived
          : copy.properties.restored,
      );
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  const rows = (properties.data ?? []).filter((property) =>
    showArchived ? true : property.status !== "archived",
  );

  return (
    <>
      <PageHeader
        title={copy.properties.title}
        description={copy.properties.subtitle}
        action={
          <Button asChild className="rounded-full">
            <Link to="/logements/nouveau">
              <Plus className="mr-1.5 size-4" />
              {copy.properties.newTitle}
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex items-center gap-3">
        <Switch
          id="archived"
          checked={showArchived}
          onCheckedChange={setShowArchived}
        />
        <Label htmlFor="archived" className="text-sm text-muted-foreground">
          {copy.properties.showArchived}
        </Label>
      </div>

      {properties.isLoading ? (
        <p className="text-sm text-muted-foreground">{copy.loading}</p>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {copy.properties.empty}
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((property) => (
            <li
              key={property.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <PropertyImage
                path={property.cover_image_url}
                alt={property.name}
                className="h-36 w-full"
              />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {property.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[property.city, property.country].filter(Boolean).join(", ") ||
                        copy.propertyTypes[property.type]}
                    </p>
                  </div>
                  <Badge variant={property.status === "active" ? "default" : "secondary"}>
                    {copy.status[property.status]}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to="/logements/$propertyId" params={{ propertyId: property.id }}>
                      <Pencil className="mr-1.5 size-3.5" />
                      {copy.properties.editTitle}
                    </Link>
                  </Button>
                  {property.status === "archived" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() =>
                        statusMutation.mutate({ id: property.id, status: "active" })
                      }
                    >
                      <RotateCcw className="mr-1.5 size-3.5" />
                      {copy.properties.restore}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() =>
                        statusMutation.mutate({ id: property.id, status: "archived" })
                      }
                    >
                      <Archive className="mr-1.5 size-3.5" />
                      {copy.properties.archive}
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
