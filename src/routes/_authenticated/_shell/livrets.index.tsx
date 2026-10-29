import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Pencil, Send, Undo2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAppCopy } from "@/hooks/use-app-copy";
import { listGuides, setGuideStatus } from "@/lib/guides.functions";
import { QrCodeDialog } from "@/components/dashboard/QrCodeDialog";

export const Route = createFileRoute("/_authenticated/_shell/livrets/")({
  head: () => ({
    meta: [{ title: "Livrets — Dalal" }, { name: "robots", content: "noindex" }],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  const copy = useAppCopy();
  const queryClient = useQueryClient();
  const fetchGuides = useServerFn(listGuides);
  const changeStatus = useServerFn(setGuideStatus);

  const guides = useQuery({ queryKey: ["guides"], queryFn: () => fetchGuides() });

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: "draft" | "published" }) =>
      changeStatus({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["guides"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  const rows = guides.data ?? [];

  return (
    <>
      <PageHeader
        title={copy.guides.title}
        description={copy.guides.subtitle}
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/logements">
              <Plus className="mr-1.5 size-4" />
              {copy.dashboard.createGuide}
            </Link>
          </Button>
        }
      />

      {guides.isLoading ? (
        <p className="text-sm text-muted-foreground">{copy.loading}</p>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {copy.guides.empty}
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((guide) => {
            const property = guide.properties as { name?: string; city?: string } | null;
            const link = `/livret/${guide.slug}`;
            return (
              <li
                key={guide.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-card-foreground">
                      {guide.title}
                    </p>
                    <Badge
                      variant={guide.status === "published" ? "default" : "secondary"}
                    >
                      {copy.status[guide.status as "draft" | "published" | "archived"]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy.guides.forProperty} {property?.name ?? "—"}
                    {property?.city ? ` · ${property.city}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{link}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="rounded-full">
                    <Link to="/livrets/$guideId" params={{ guideId: guide.id }}>
                      <Pencil className="mr-1.5 size-3.5" />
                      {copy.guides.edit}
                    </Link>
                  </Button>
                  <QrCodeDialog
                    slug={guide.slug}
                    title={guide.title}
                    city={property?.city ?? null}
                    published={guide.status === "published"}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        `${window.location.origin}${link}`,
                      );
                      toast.success(copy.guides.copied);
                    }}
                  >
                    <Copy className="mr-1.5 size-3.5" />
                    {copy.guides.copyLink}
                  </Button>
                  {guide.status === "published" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() =>
                        statusMutation.mutate({ id: guide.id, status: "draft" })
                      }
                    >
                      <Undo2 className="mr-1.5 size-3.5" />
                      {copy.guides.unpublish}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        statusMutation.mutate({ id: guide.id, status: "published" })
                      }
                    >
                      <Send className="mr-1.5 size-3.5" />
                      {copy.guides.publish}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

    </>
  );
}
