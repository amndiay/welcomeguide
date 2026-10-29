import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/layout/Logo";
import { useAppCopy } from "@/hooks/use-app-copy";
import {
  completeOnboarding,
  getMe,
  listTemplates,
  updateOrganization,
  updateProfile,
  type OrgType,
} from "@/lib/account.functions";
import { createProperty, type PropertyType } from "@/lib/properties.functions";
import { createGuide } from "@/lib/guides.functions";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [{ title: "Bienvenue — Dalal" }, { name: "robots", content: "noindex" }],
  }),
  component: OnboardingPage,
});

const TOTAL = 5;
const PROPERTY_TYPES: PropertyType[] = [
  "apartment",
  "villa",
  "house",
  "studio",
  "room",
  "other",
];

function OnboardingPage() {
  const copy = useAppCopy();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchMe = useServerFn(getMe);
  const fetchTemplates = useServerFn(listTemplates);
  const saveProfile = useServerFn(updateProfile);
  const saveOrg = useServerFn(updateOrganization);
  const addProperty = useServerFn(createProperty);
  const addGuide = useServerFn(createGuide);
  const finishOnboarding = useServerFn(completeOnboarding);

  const me = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });
  const templates = useQuery({
    queryKey: ["templates"],
    queryFn: () => fetchTemplates(),
  });

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("individual_host");
  const [propertyName, setPropertyName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [templateId, setTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (!me.data) return;
    setFirstName(me.data.profile?.first_name ?? "");
    setLastName(me.data.profile?.last_name ?? "");
    setOrgName(me.data.organization?.name ?? "");
    setOrgType((me.data.organization?.type ?? "individual_host") as OrgType);
  }, [me.data]);

  const orgTypeOptions: { value: OrgType; label: string }[] = [
    { value: "individual_host", label: copy.onboarding.typeIndividual },
    { value: "professional_host", label: copy.onboarding.typeProfessional },
    { value: "concierge", label: copy.onboarding.typeConcierge },
  ];

  async function next() {
    setBusy(true);
    try {
      if (step === 1) {
        await saveProfile({ data: { firstName, lastName } });
      } else if (step === 2) {
        await saveOrg({ data: { name: orgName || "Mon organisation", type: orgType } });
      } else if (step === 3 && propertyName.trim()) {
        const property = await addProperty({
          data: {
            name: propertyName,
            type: propertyType,
            city,
            country,
            status: "active",
          },
        });
        window.sessionStorage.setItem("dalal.onboarding.property", property.id);
      } else if (step === 4) {
        const propertyId = window.sessionStorage.getItem(
          "dalal.onboarding.property",
        );
        if (propertyId) {
          await addGuide({ data: { propertyId, templateId } });
        }
      } else if (step === 5) {
        await finishOnboarding();
        window.sessionStorage.removeItem("dalal.onboarding.property");
        await queryClient.invalidateQueries();
        navigate({ to: "/dashboard" });
        return;
      }
      setStep((current) => Math.min(current + 1, TOTAL));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary/40 px-4 py-14">
      <Logo />

      <div className="mt-8 w-full max-w-xl rounded-3xl border border-border bg-card p-7 shadow-soft">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {copy.onboarding.step} {step} {copy.onboarding.of} {TOTAL}
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(step / TOTAL) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <StepShell
            title={copy.onboarding.s1Title}
            description={copy.onboarding.s1Description}
          >
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
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            title={copy.onboarding.s2Title}
            description={copy.onboarding.s2Description}
          >
            <div className="space-y-2">
              <Label htmlFor="orgName">{copy.onboarding.orgName}</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(event) => setOrgName(event.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {orgTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setOrgType(option.value)}
                  className={`rounded-2xl border p-3 text-sm font-medium transition-colors ${
                    orgType === option.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title={copy.onboarding.s3Title}
            description={copy.onboarding.s3Description}
          >
            <div className="space-y-2">
              <Label htmlFor="propertyName">{copy.onboarding.propertyName}</Label>
              <Input
                id="propertyName"
                value={propertyName}
                onChange={(event) => setPropertyName(event.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">{copy.onboarding.city}</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{copy.onboarding.country}</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{copy.onboarding.propertyType}</Label>
              <Select
                value={propertyType}
                onValueChange={(value) => setPropertyType(value as PropertyType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {copy.propertyTypes[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            title={copy.onboarding.s4Title}
            description={copy.onboarding.s4Description}
          >
            <div className="grid gap-3">
              {(templates.data ?? []).map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setTemplateId(template.id)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    templateId === template.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <p className="text-sm font-semibold text-card-foreground">
                    {template.name}
                  </p>
                  {template.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {template.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell
            title={copy.onboarding.s5Title}
            description={copy.onboarding.s5Description}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-primary/10 p-4 text-sm text-foreground">
              <Check className="size-5 text-primary" aria-hidden />
              {copy.onboarding.done}
            </div>
          </StepShell>
        )}

        <div className="mt-7 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="rounded-full"
            disabled={step === 1 || busy}
            onClick={() => setStep((current) => Math.max(current - 1, 1))}
          >
            {copy.onboarding.back}
          </Button>
          <div className="flex items-center gap-2">
            {step > 2 && step < 5 && (
              <Button
                variant="ghost"
                className="rounded-full"
                disabled={busy}
                onClick={() => setStep((current) => current + 1)}
              >
                {copy.onboarding.skip}
              </Button>
            )}
            <Button className="rounded-full" disabled={busy} onClick={() => void next()}>
              {busy && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {step === TOTAL ? copy.onboarding.finish : copy.onboarding.next}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
