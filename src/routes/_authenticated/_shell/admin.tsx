import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Pencil, Send, ShieldAlert, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  adminDeleteGuide,
  adminListGuides,
  adminListUsers,
  adminSetGuideStatus,
  amIPlatformAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/_shell/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Dalal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const queryClient = useQueryClient();
  const checkAdmin = useServerFn(amIPlatformAdmin);
  const fetchGuides = useServerFn(adminListGuides);
  const fetchUsers = useServerFn(adminListUsers);
  const setStatus = useServerFn(adminSetGuideStatus);
  const removeGuide = useServerFn(adminDeleteGuide);

  const [tab, setTab] = useState<"guides" | "users">("guides");
  const [search, setSearch] = useState("");

  const admin = useQuery({
    queryKey: ["platform-admin"],
    queryFn: () => checkAdmin(),
  });
  const isAdmin = admin.data?.isAdmin === true;

  const guides = useQuery({
    queryKey: ["admin-guides"],
    queryFn: () => fetchGuides(),
    enabled: isAdmin,
  });
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers(),
    enabled: isAdmin,
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-guides"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: "draft" | "published" }) =>
      setStatus({ data: input }),
    onSuccess: refresh,
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeGuide({ data: { id } }),
    onSuccess: () => {
      toast.success("Livret supprimé");
      refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  if (admin.isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <ShieldAlert className="mx-auto size-8 text-muted-foreground" />
        <h1 className="mt-3 text-lg font-semibold text-card-foreground">
          Accès réservé
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cette console est réservée aux administrateurs de la plateforme Dalal.
        </p>
      </div>
    );
  }

  const term = search.trim().toLowerCase();
  const guideRows = (guides.data ?? []).filter((row) =>
    term
      ? [row.title, row.propertyName, row.organizationName, row.ownerEmail, row.city]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term))
      : true,
  );
  const userRows = (users.data ?? []).filter((row) =>
    term
      ? [row.name, row.email, row.organizationName]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term))
      : true,
  );

  return (
    <>
      <PageHeader
        title="Administration"
        description="Tous les comptes et tous les livrets de la plateforme."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {(
            [
              ["guides", `Livrets (${guides.data?.length ?? 0})`],
              ["users", `Utilisateurs (${users.data?.length ?? 0})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un livret, un hôte, un e-mail…"
          className="max-w-xs rounded-full"
        />
      </div>

      {tab === "guides" ? (
        <div className="space-y-3">
          {guides.isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : guideRows.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Aucun livret.
            </p>
          ) : (
            guideRows.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-card-foreground">
                      {row.title}
                    </p>
                    <Badge
                      variant={row.status === "published" ? "default" : "secondary"}
                    >
                      {row.status === "published"
                        ? "Publié"
                        : row.status === "draft"
                          ? "Brouillon"
                          : "Archivé"}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {[row.propertyName, row.city].filter(Boolean).join(" · ")}
                    {" — "}
                    {row.organizationName ?? "Organisation inconnue"}
                    {row.ownerEmail ? ` (${row.ownerEmail})` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to="/livrets/$guideId" params={{ guideId: row.id }}>
                      <Pencil className="mr-1.5 size-3.5" />
                      Modifier
                    </Link>
                  </Button>
                  {row.status === "published" && (
                    <Button asChild size="sm" variant="ghost" className="rounded-full">
                      <a
                        href={`/livret/${row.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={statusMutation.isPending}
                    onClick={() =>
                      statusMutation.mutate({
                        id: row.id,
                        status: row.status === "published" ? "draft" : "published",
                      })
                    }
                  >
                    {row.status === "published" ? (
                      <>
                        <Undo2 className="mr-1.5 size-3.5" />
                        Dépublier
                      </>
                    ) : (
                      <>
                        <Send className="mr-1.5 size-3.5" />
                        Publier
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Supprimer définitivement le livret « ${row.title} » ?`,
                        )
                      ) {
                        deleteMutation.mutate(row.id);
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {users.isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : userRows.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Aucun utilisateur.
            </p>
          ) : (
            userRows.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-card-foreground">
                    {row.name || row.email || "Utilisateur"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.email} — {row.organizationName ?? "Sans organisation"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{row.propertyCount} logements</Badge>
                  <Badge variant="secondary">{row.guideCount} livrets</Badge>
                  {!row.onboardingCompleted && (
                    <Badge variant="outline">Onboarding en cours</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
