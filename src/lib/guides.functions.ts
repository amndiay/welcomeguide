import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type GuideStatus = "draft" | "published" | "archived";

const DEFAULT_SECTIONS = [
  "welcome",
  "checkin",
  "wifi",
  "house_rules",
  "local_guide",
  "checkout",
  "contacts",
];

const SECTION_TITLES: Record<string, string> = {
  welcome: "Bienvenue",
  checkin: "Arrivée",
  wifi: "Wi-Fi",
  house_rules: "Règles de la maison",
  amenities: "Équipements",
  local_guide: "Autour du logement",
  services: "Services",
  checkout: "Départ",
  contacts: "Contacts",
};

function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "livret"
  );
}

export const listGuides = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("guides")
      .select(
        "id, title, slug, status, default_language, updated_at, published_at, property_id, properties(name, city)",
      )
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createGuide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      propertyId: string;
      templateId?: string | null;
      title?: string;
      language?: string;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, name")
      .eq("id", data.propertyId)
      .maybeSingle();
    if (propertyError) throw new Error(propertyError.message);
    if (!property) throw new Error("Logement introuvable");

    let sections = DEFAULT_SECTIONS;
    if (data.templateId) {
      const { data: template } = await supabase
        .from("templates")
        .select("configuration")
        .eq("id", data.templateId)
        .maybeSingle();
      const configured = (
        template?.configuration as { sections?: string[] } | null
      )?.sections;
      if (configured?.length) sections = configured;
    }

    const slug = `${slugify(property.name)}-${Math.random().toString(36).slice(2, 8)}`;

    const { data: guide, error } = await supabase
      .from("guides")
      .insert({
        property_id: property.id,
        title: data.title?.trim() || `Livret — ${property.name}`,
        slug,
        template_id: data.templateId ?? null,
        default_language: data.language ?? "fr",
      })
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);

    const { error: sectionsError } = await supabase.from("guide_sections").insert(
      sections.map((type, index) => ({
        guide_id: guide.id,
        type,
        title: SECTION_TITLES[type] ?? type,
        position: index,
      })),
    );
    if (sectionsError) throw new Error(sectionsError.message);

    return guide;
  });

export const setGuideStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: GuideStatus }) => input)
  .handler(async ({ data, context }) => {
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

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [properties, guides, published, views] = await Promise.all([
      supabase
        .from("properties")
        .select("id", { count: "exact", head: true })
        .neq("status", "archived"),
      supabase.from("guides").select("id", { count: "exact", head: true }),
      supabase
        .from("guides")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "guide_view"),
    ]);

    return {
      properties: properties.count ?? 0,
      guides: guides.count ?? 0,
      publishedGuides: published.count ?? 0,
      guideViews: views.count ?? 0,
    };
  });
