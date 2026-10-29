import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAppCopy } from "@/hooks/use-app-copy";
import {
  getMe,
  listMembers,
  updateOrganization,
  updateProfile,
  type OrgType,
} from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/_shell/parametres")({
  head: () => ({
    meta: [{ title: "Paramètres — Dalal" }, { name: "robots", content: "noindex" }],
  }),
  component: SettingsPage,
});

const ORG_TYPES: OrgType[] = ["individual_host", "professional_host", "concierge"];

function SettingsPage() {
  const copy = useAppCopy();
  const queryClient = useQueryClient();
  const fetchMe = useServerFn(getMe);
  const fetchMembers = useServerFn(listMembers);
  const saveProfile = useServerFn(updateProfile);
  const saveOrg = useServerFn(updateOrganization);

  const me = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });
  const members = useQuery({ queryKey: ["members"], queryFn: () => fetchMembers() });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("individual_host");

  useEffect(() => {
    if (!me.data) return;
    setFirstName(me.data.profile?.first_name ?? "");
    setLastName(me.data.profile?.last_name ?? "");
    setOrgName(me.data.organization?.name ?? "");
    setOrgType((me.data.organization?.type ?? "individual_host") as OrgType);
  }, [me.data]);

  const profileMutation = useMutation({
    mutationFn: () => saveProfile({ data: { firstName, lastName } }),
    onSuccess: () => {
      toast.success(copy.settings.saved);
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  const orgMutation = useMutation({
    mutationFn: () => saveOrg({ data: { name: orgName, type: orgType } }),
    onSuccess: () => {
      toast.success(copy.settings.saved);
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  const orgTypeLabel: Record<OrgType, string> = {
    individual_host: copy.onboarding.typeIndividual,
    professional_host: copy.onboarding.typeProfessional,
    concierge: copy.onboarding.typeConcierge,
  };

  return (
    <>
      <PageHeader title={copy.settings.title} description={copy.settings.subtitle} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {copy.settings.profile}
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{copy.auth.firstName}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{copy.auth.lastName}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
            <Button
              className="rounded-full"
              disabled={profileMutation.isPending}
              onClick={() => profileMutation.mutate()}
            >
              {copy.settings.save}
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {copy.settings.organization}
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">{copy.onboarding.orgName}</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(event) => setOrgName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{copy.settings.orgType}</Label>
              <Select
                value={orgType}
                onValueChange={(value) => setOrgType(value as OrgType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {orgTypeLabel[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="rounded-full"
              disabled={orgMutation.isPending}
              onClick={() => orgMutation.mutate()}
            >
              {copy.settings.save}
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {copy.settings.members}
          </h2>
          <ul className="mt-4 space-y-3">
            {(members.data ?? []).map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {member.name || member.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <Badge variant="secondary">{copy.roles[member.role]}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
