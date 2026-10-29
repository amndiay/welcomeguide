import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";

export interface PublicGuideProperty {
  name: string;
  city: string | null;
  country: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  wifi_name: string | null;
  wifi_password: string | null;
  checkin_time: string | null;
  checkout_time: string | null;
}

export interface PublicGuideSection {
  id: string;
  type: string;
  title: string | null;
  blocks: {
    id: string;
    type: string;
    content: Json;
  }[];
}

export interface PublicGuideRecommendation {
  id: string;
  category: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  instagram: string | null;
}

export interface PublicGuide {
  id: string;
  slug: string;
  title: string;
  default_language: string;
  theme: Json;
  cover_image_url: string | null;
  logo_url: string | null;
  welcome_message: string | null;
  host_name: string | null;
  host_avatar_url: string | null;
  updated_at: string | null;
  property: PublicGuideProperty | null;
  sections: PublicGuideSection[];
  recommendations: PublicGuideRecommendation[];
}

/** Anonymous, publishable-key client. Created per request inside the handler. */
function publicClient() {
  const url = process.env['SUPABASE_URL'] ?? import.meta.env['VITE_SUPABASE_URL'];
  const key =
    process.env['SUPABASE_PUBLISHABLE_KEY'] ??
    import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("Backend indisponible");

  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Reads a PUBLISHED guidebook by slug. No authentication required.
 * Drafts and archived guidebooks return null (never leak private content).
 */
export const getPublicGuide = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({
    slug: String(input.slug ?? "")
      .toLowerCase()
      .slice(0, 120),
  }))
  .handler(async ({ data }): Promise<PublicGuide | null> => {
    const supabase = publicClient();

    const { data: guide } = await supabase
      .from("guides")
      .select(
        "id, slug, title, default_language, theme, cover_image_url, logo_url, welcome_message, host_name, host_avatar_url, updated_at, property_id, properties(name, city, country, address, phone, whatsapp, wifi_name, wifi_password, checkin_time, checkout_time)",
      )
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();

    if (!guide) return null;

    const { data: sections } = await supabase
      .from("guide_sections")
      .select("id, type, title, position")
      .eq("guide_id", guide.id)
      .eq("visible", true)
      .order("position", { ascending: true });

    const sectionIds = (sections ?? []).map((section) => section.id);
    let blocks: { id: string; section_id: string; type: string; content: Json }[] = [];
    if (sectionIds.length) {
      const { data: blockRows } = await supabase
        .from("guide_blocks")
        .select("id, section_id, type, content, position")
        .in("section_id", sectionIds)
        .eq("visible", true)
        .order("position", { ascending: true });
      blocks = blockRows ?? [];
    }

    const { data: recommendations } = await supabase
      .from("recommendations")
      .select(
        "id, category, name, description, photo_url, address, latitude, longitude, phone, whatsapp, website, instagram",
      )
      .eq("property_id", guide.property_id)
      .eq("visible", true)
      .order("position", { ascending: true });

    return {
      id: guide.id,
      slug: guide.slug,
      title: guide.title,
      default_language: guide.default_language ?? "fr",
      theme: guide.theme,
      cover_image_url: guide.cover_image_url,
      logo_url: guide.logo_url,
      welcome_message: guide.welcome_message,
      host_name: guide.host_name,
      host_avatar_url: guide.host_avatar_url,
      updated_at: guide.updated_at,
      property: (guide.properties as PublicGuideProperty | null) ?? null,
      sections: (sections ?? []).map((section) => ({
        id: section.id,
        type: section.type,
        title: section.title,
        blocks: blocks
          .filter((block) => block.section_id === section.id)
          .map(({ id, type, content }) => ({ id, type, content })),
      })),
      recommendations: (recommendations ?? []) as PublicGuideRecommendation[],
    };
  });

/** Fire-and-forget analytics for public guidebook views / section opens. */
export const trackGuideEvent = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { guideId: string; sectionId?: string | null; eventType: string }) => input,
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    await supabase.from("analytics_events").insert({
      guide_id: data.guideId,
      section_id: data.sectionId ?? null,
      event_type: data.eventType === "section_view" ? "section_view" : "guide_view",
    });
    return { ok: true };
  });
