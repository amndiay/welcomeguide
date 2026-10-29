import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type OrgRole = "owner" | "admin" | "editor" | "viewer";
export type OrgType = "individual_host" | "professional_host" | "concierge";

export interface MeResult {
  userId: string;
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    avatar_url: string | null;
    organization_id: string | null;
    onboarding_completed: boolean;
  } | null;
  organization: {
    id: string;
    name: string;
    type: OrgType;
    logo_url: string | null;
  } | null;
  role: OrgRole | null;
}

/** Current profile, organization and role for the signed-in user. */
export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MeResult> => {
    const { supabase, userId } = context;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, email, avatar_url, organization_id, onboarding_completed",
      )
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);

    let organization: MeResult["organization"] = null;
    let role: OrgRole | null = null;

    if (profile?.organization_id) {
      const [orgRes, memberRes] = await Promise.all([
        supabase
          .from("organizations")
          .select("id, name, type, logo_url")
          .eq("id", profile.organization_id)
          .maybeSingle(),
        supabase
          .from("organization_members")
          .select("role")
          .eq("user_id", userId)
          .eq("organization_id", profile.organization_id)
          .maybeSingle(),
      ]);
      organization = orgRes.data ?? null;
      role = (memberRes.data?.role as OrgRole | undefined) ?? null;
    }

    return { userId, profile: profile ?? null, organization, role };
  });

/** Update the signed-in user's own profile fields. */
export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { firstName?: string; lastName?: string }) => ({
    firstName: input.firstName?.trim().slice(0, 80) ?? "",
    lastName: input.lastName?.trim().slice(0, 80) ?? "",
  }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({
        first_name: data.firstName || null,
        last_name: data.lastName || null,
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Rename / retype the organization (owners and admins only, enforced by RLS). */
export const updateOrganization = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { name: string; type: OrgType }) => ({
    name: input.name.trim().slice(0, 120),
    type: input.type,
  }))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile?.organization_id) throw new Error("Aucune organisation");

    const { error } = await context.supabase
      .from("organizations")
      .update({ name: data.name, type: data.type })
      .eq("id", profile.organization_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Mark the onboarding wizard as finished for the signed-in user. */
export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Guide templates available to every signed-in user. */
export const listTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("templates")
      .select("id, name, description, configuration")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Members of the current organization. */
export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("organization_members")
      .select("id, user_id, role, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const ids = (data ?? []).map((m) => m.user_id);
    if (ids.length === 0) return [];

    const { data: profiles } = await context.supabase
      .from("profiles")
      .select("id, first_name, last_name, email")
      .in("id", ids);

    return (data ?? []).map((member) => {
      const profile = profiles?.find((p) => p.id === member.user_id);
      return {
        id: member.id,
        role: member.role as OrgRole,
        email: profile?.email ?? null,
        name:
          [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
          null,
      };
    });
  });
