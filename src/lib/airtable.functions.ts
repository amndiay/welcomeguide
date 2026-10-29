import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Airtable is the hospitality back-office: the Dalal team curates places and
 * editorial content there, the app reads it through the Lovable connector
 * gateway (never from the browser, so the credentials stay server-side).
 */
const GATEWAY_URL = "https://connector-gateway.lovable.dev/airtable";
const BASE_NAME = "DalalDB";

export interface Place {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  priceRange: string | null;
  photo: string | null;
  featured: boolean;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: string | null;
  language: string | null;
  content: string | null;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

function gatewayHeaders() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const airtableKey = process.env["AIRTABLE_API_KEY"];
  if (!lovableKey || !airtableKey) {
    throw new Error("Airtable n'est pas connecté à ce projet.");
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": airtableKey,
  };
}

async function airtableFetch(path: string): Promise<unknown> {
  const response = await fetch(`${GATEWAY_URL}${path}`, {
    headers: gatewayHeaders(),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Airtable request failed [${response.status}]: ${body}`);
    throw new Error(`Airtable a répondu ${response.status}: ${body}`);
  }
  return response.json();
}

async function resolveBaseId(): Promise<string> {
  const payload = (await airtableFetch("/v0/meta/bases")) as {
    bases?: { id: string; name: string }[];
  };
  const bases = payload.bases ?? [];
  const match = bases.find((base) => base.name === BASE_NAME) ?? bases[0];
  if (!match) throw new Error("Aucune base Airtable accessible.");
  return match.id;
}

const str = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value : null;

function toPlace(record: AirtableRecord): Place {
  const f = record.fields;
  return {
    id: record.id,
    name: str(f["Name"]) ?? "Sans nom",
    category: str(f["Category"]),
    city: str(f["City"]),
    country: str(f["Country"]),
    description: str(f["Description"]),
    address: str(f["Address"]),
    phone: str(f["Phone"]),
    website: str(f["Website"]),
    priceRange: str(f["PriceRange"]),
    photo: str(f["Photo"]),
    featured: f["Featured"] === true,
  };
}

/** Curated places from Airtable, optionally filtered by category or city. */
export const listPlaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { category?: string; city?: string } | undefined) => ({
    category: input?.category?.trim() || undefined,
    city: input?.city?.trim() || undefined,
  }))
  .handler(async ({ data }): Promise<Place[]> => {
    const baseId = await resolveBaseId();
    const params = new URLSearchParams({ maxRecords: "100" });

    const filters = [`{Status} = 'Published'`];
    if (data.category) filters.push(`{Category} = '${data.category.replace(/'/g, "")}'`);
    if (data.city) filters.push(`{City} = '${data.city.replace(/'/g, "")}'`);
    params.set("filterByFormula", `AND(${filters.join(",")})`);

    const payload = (await airtableFetch(
      `/v0/${baseId}/PLACES?${params.toString()}`,
    )) as { records?: AirtableRecord[] };

    return (payload.records ?? []).map(toPlace);
  });

/** Editorial content blocks maintained by the Dalal team in Airtable. */
export const listContentTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ContentTemplate[]> => {
    const baseId = await resolveBaseId();
    const payload = (await airtableFetch(
      `/v0/${baseId}/CONTENT_TEMPLATES?maxRecords=100`,
    )) as { records?: AirtableRecord[] };

    return (payload.records ?? []).map((record) => ({
      id: record.id,
      name: str(record.fields["Name"]) ?? "Sans nom",
      type: str(record.fields["Type"]),
      language: str(record.fields["Language"]),
      content: str(record.fields["Content"]),
    }));
  });
