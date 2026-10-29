import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PropertyType =
  | "apartment"
  | "villa"
  | "house"
  | "studio"
  | "room"
  | "other";
export type PropertyStatus = "draft" | "active" | "archived";

export interface PropertyInput {
  name: string;
  type: PropertyType;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  description?: string | null;
  coverImagePath?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  wifiName?: string | null;
  wifiPassword?: string | null;
  checkinTime?: string | null;
  checkoutTime?: string | null;
  status?: PropertyStatus;
}

const clean = (value: string | null | undefined, max = 300) =>
  value == null || value.trim() === "" ? null : value.trim().slice(0, max);

function toRow(input: PropertyInput) {
  return {
    name: input.name.trim().slice(0, 140),
    type: input.type,
    address: clean(input.address),
    city: clean(input.city, 120),
    country: clean(input.country, 120),
    description: clean(input.description, 2000),
    cover_image_url: clean(input.coverImagePath, 400),
    phone: clean(input.phone, 40),
    whatsapp: clean(input.whatsapp, 40),
    wifi_name: clean(input.wifiName, 120),
    wifi_password: clean(input.wifiPassword, 120),
    checkin_time: clean(input.checkinTime, 40),
    checkout_time: clean(input.checkoutTime, 40),
    status: input.status ?? "draft",
  };
}

export const listProperties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("properties")
      .select(
        "id, name, type, city, country, status, cover_image_url, updated_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getProperty = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data, context }) => {
    const { data: property, error } = await context.supabase
      .from("properties")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!property) throw new Error("Logement introuvable");
    return property;
  });

export const createProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: PropertyInput) => input)
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile?.organization_id) throw new Error("Aucune organisation");

    const { data: created, error } = await context.supabase
      .from("properties")
      .insert({ ...toRow(data), organization_id: profile.organization_id })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: created.id };
  });

export const updateProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: PropertyInput & { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const { error } = await context.supabase
      .from("properties")
      .update(toRow(rest))
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setPropertyStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: PropertyStatus }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("properties")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("properties")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Short-lived signed URL for a private property image path. */
export const getImageUrl = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { path: string }) => ({ path: String(input.path) }))
  .handler(async ({ data, context }) => {
    if (/^https?:\/\//.test(data.path)) return { url: data.path };
    const { data: signed, error } = await context.supabase.storage
      .from("property-images")
      .createSignedUrl(data.path, 3600);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });
