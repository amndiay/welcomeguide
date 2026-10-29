import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** True when the signed-in user is a Dalal platform administrator. */
export const amIPlatformAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("is_platform_admin");
    if (error) throw new Error(error.message);
    return { isAdmin: data === true };
  });


async function assertAdmin(supabase: {
  rpc: (name: "is_platform_admin") => PromiseLike<{ data: unknown }>;
}) {
  const { data } = await supabase.rpc("is_platform_admin");
  if (data !== true) throw new Error("Forbidden");
}

export interface AdminGuideRow {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  updated_at: string;
  propertyName: string | null;
  city: string | null;
  organizationName: string | null;
  organizationId: string | null;
  ownerEmail: string | null;
}

/** Every guide on the platform, with its owner organization. */
export const adminListGuides = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminGuideRow[]> => {
    await assertAdmin(context.supabase);

    const { data, error } = await context.supabase
      .from("guides")
      .select(
        "id, title, slug, status, updated_at, properties(name, city, organization_id, organizations(name))",
      )
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);

    const orgIds = Array.from(
      new Set(
        (data ?? [])
          .map((g) => g.properties?.organization_id)
          .filter((v): v is string => Boolean(v)),
      ),
    );

    const owners = new Map<string, string | null>();
    if (orgIds.length > 0) {
      const { data: profiles } = await context.supabase
        .from("profiles")
        .select("email, organization_id")
        .in("organization_id", orgIds);
      for (const profile of profiles ?? []) {
        if (profile.organization_id && !owners.has(profile.organization_id)) {
          owners.set(profile.organization_id, profile.email);
        }
      }
    }

    return (data ?? []).map((guide) => ({
      id: guide.id,
      title: guide.title,
      slug: guide.slug,
      status: guide.status,
      updated_at: guide.updated_at,
      propertyName: guide.properties?.name ?? null,
      city: guide.properties?.city ?? null,
      organizationName: guide.properties?.organizations?.name ?? null,
      organizationId: guide.properties?.organization_id ?? null,
      ownerEmail: guide.properties?.organization_id
        ? owners.get(guide.properties.organization_id) ?? null
        : null,
    }));
  });

export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string | null;
  organizationId: string | null;
  organizationName: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  guideCount: number;
  propertyCount: number;
}

/** Every user on the platform with their organization and volumes. */
export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertAdmin(context.supabase);

    const [profilesRes, propsRes, guidesRes] = await Promise.all([
      context.supabase
        .from("profiles")
        .select(
          "id, first_name, last_name, email, organization_id, onboarding_completed, created_at, organizations(name)",
        )
        .order("created_at", { ascending: false }),
      context.supabase.from("properties").select("id, organization_id"),
      context.supabase.from("guides").select("id, property_id"),
    ]);
    if (profilesRes.error) throw new Error(profilesRes.error.message);

    const propsByOrg = new Map<string, string[]>();
    for (const property of propsRes.data ?? []) {
      const list = propsByOrg.get(property.organization_id) ?? [];
      list.push(property.id);
      propsByOrg.set(property.organization_id, list);
    }

    return (profilesRes.data ?? []).map((profile) => {
      const propertyIds = profile.organization_id
        ? propsByOrg.get(profile.organization_id) ?? []
        : [];
      return {
        id: profile.id,
        name:
          [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
          null,
        email: profile.email,
        organizationId: profile.organization_id,
        organizationName: profile.organizations?.name ?? null,
        onboardingCompleted: profile.onboarding_completed,
        createdAt: profile.created_at,
        propertyCount: propertyIds.length,
        guideCount: (guidesRes.data ?? []).filter((g) =>
          propertyIds.includes(g.property_id),
        ).length,
      };
    });
  });

/** Change any guide's publication status (platform admin only). */
export const adminSetGuideStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { id: string; status: "draft" | "published" | "archived" }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { error } = await context.supabase
      .from("guides")
      .update({
        status: data.status,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Delete any guide with its sections and blocks (platform admin only). */
export const adminDeleteGuide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { error } = await context.supabase
      .from("guides")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
