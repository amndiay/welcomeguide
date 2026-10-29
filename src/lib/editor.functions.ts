import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";
import {
  SECTION_DEF_MAP,
  emptyContent,
  type GuideTheme,
} from "@/lib/guide-schema";

export interface GuideBlockRow {
  id: string;
  section_id: string;
  type: string;
  content: Json;
  position: number;
  visible: boolean;
}

export interface GuideSectionRow {
  id: string;
  guide_id: string;
  type: string;
  title: string | null;
  position: number;
  visible: boolean;
  blocks: GuideBlockRow[];
}

/** Full editor payload: guide, property, sections + blocks, recommendations. */
export const getGuideDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: guide, error } = await supabase
      .from("guides")
      .select(
        "id, title, slug, status, default_language, template_id, theme, cover_image_url, logo_url, welcome_message, host_name, host_avatar_url, updated_at, published_at, property_id, properties(id, name, city, country, address, phone, whatsapp, wifi_name, wifi_password, checkin_time, checkout_time, cover_image_url)",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!guide) throw new Error("Livret introuvable");

    const { data: sections, error: sectionsError } = await supabase
      .from("guide_sections")
      .select("id, guide_id, type, title, position, visible")
      .eq("guide_id", guide.id)
      .order("position", { ascending: true });
    if (sectionsError) throw new Error(sectionsError.message);

    const sectionIds = (sections ?? []).map((section) => section.id);
    let blocks: GuideBlockRow[] = [];
    if (sectionIds.length) {
      const { data: blockRows, error: blocksError } = await supabase
        .from("guide_blocks")
        .select("id, section_id, type, content, position, visible")
        .in("section_id", sectionIds)
        .order("position", { ascending: true });
      if (blocksError) throw new Error(blocksError.message);
      blocks = (blockRows ?? []) as GuideBlockRow[];
    }

    const { data: recommendations } = await supabase
      .from("recommendations")
      .select("*")
      .eq("property_id", guide.property_id)
      .order("position", { ascending: true });

    const { data: templates } = await supabase
      .from("templates")
      .select("id, name, description, configuration")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    return {
      guide,
      sections: (sections ?? []).map((section) => ({
        ...section,
        blocks: blocks.filter((block) => block.section_id === section.id),
      })) as GuideSectionRow[],
      recommendations: recommendations ?? [],
      templates: templates ?? [],
    };
  });

export const updateGuide = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id: string;
      patch: {
        title?: string;
        status?: "draft" | "published" | "archived";
        template_id?: string | null;
        theme?: Partial<GuideTheme>;
        cover_image_url?: string | null;
        logo_url?: string | null;
        welcome_message?: string | null;
        host_name?: string | null;
        host_avatar_url?: string | null;
      };
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = { ...data.patch };
    if (data.patch.status === "published")
      patch['published_at'] = new Date().toISOString();
    if (data.patch.status === "draft") patch['published_at'] = null;

    const { error } = await context.supabase
      .from("guides")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { guideId: string; type: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const def = SECTION_DEF_MAP[data.type];

    const { count } = await supabase
      .from("guide_sections")
      .select("id", { count: "exact", head: true })
      .eq("guide_id", data.guideId);

    const { data: section, error } = await supabase
      .from("guide_sections")
      .insert({
        guide_id: data.guideId,
        type: data.type,
        title: def?.label.fr ?? data.type,
        position: count ?? 0,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const defaults = def?.defaults ?? [];
    if (defaults.length) {
      const { error: blocksError } = await supabase.from("guide_blocks").insert(
        defaults.map((type, index) => ({
          section_id: section.id,
          type,
          content: emptyContent(type) as Json,
          position: index,
        })),
      );
      if (blocksError) throw new Error(blocksError.message);
    }
    return section;
  });

export const updateSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { id: string; patch: { title?: string; visible?: boolean } }) => input,
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("guide_sections")
      .update(data.patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await context.supabase.from("guide_blocks").delete().eq("section_id", data.id);
    const { error } = await context.supabase
      .from("guide_sections")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderSections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ids: string[] }) => input)
  .handler(async ({ data, context }) => {
    await Promise.all(
      data.ids.map((id, index) =>
        context.supabase
          .from("guide_sections")
          .update({ position: index })
          .eq("id", id),
      ),
    );
    return { ok: true };
  });

export const addBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { sectionId: string; type: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { count } = await supabase
      .from("guide_blocks")
      .select("id", { count: "exact", head: true })
      .eq("section_id", data.sectionId);

    const { data: block, error } = await supabase
      .from("guide_blocks")
      .insert({
        section_id: data.sectionId,
        type: data.type,
        content: emptyContent(data.type) as Json,
        position: count ?? 0,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return block;
  });

export const updateBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id: string;
      patch: { content?: Json; visible?: boolean };
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("guide_blocks")
      .update(data.patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("guide_blocks")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: block, error } = await supabase
      .from("guide_blocks")
      .select("section_id, type, content, position, visible")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!block) throw new Error("Bloc introuvable");

    const { data: created, error: insertError } = await supabase
      .from("guide_blocks")
      .insert({
        section_id: block.section_id,
        type: block.type,
        content: block.content,
        visible: block.visible,
        position: block.position + 1,
      })
      .select("id")
      .single();
    if (insertError) throw new Error(insertError.message);
    return created;
  });

export const reorderBlocks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ids: string[] }) => input)
  .handler(async ({ data, context }) => {
    await Promise.all(
      data.ids.map((id, index) =>
        context.supabase.from("guide_blocks").update({ position: index }).eq("id", id),
      ),
    );
    return { ok: true };
  });

export interface RecommendationInput {
  id?: string;
  property_id: string;
  category: string;
  name: string;
  description?: string | null;
  photo_url?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  instagram?: string | null;
  visible?: boolean;
}

export const saveRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RecommendationInput) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { id, ...row } = data;

    if (id) {
      const { error } = await supabase
        .from("recommendations")
        .update(row as never)
        .eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }

    const { count } = await supabase
      .from("recommendations")
      .select("id", { count: "exact", head: true })
      .eq("property_id", data.property_id);

    const { data: created, error } = await supabase
      .from("recommendations")
      .insert({ ...row, position: count ?? 0 } as never)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return created;
  });

export const deleteRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("recommendations")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
