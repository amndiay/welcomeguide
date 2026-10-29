/**
 * Shared, client-safe schema for the Dalal guidebook editor.
 * Sections describe the guest navigation; blocks describe the content.
 * Every block type is described by a list of fields so the editor and the
 * preview stay in sync automatically when a new type is added.
 */

export type Lang2 = "fr" | "en";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "tel"
  | "time"
  | "number"
  | "image"
  | "list"
  | "pairs"
  | "rules"
  | "select";

export interface FieldDef {
  key: string;
  type: FieldType;
  label: Record<Lang2, string>;
  placeholder?: string;
  options?: { value: string; label: Record<Lang2, string> }[];
}

export interface BlockDef {
  type: string;
  icon: string;
  label: Record<Lang2, string>;
  fields: FieldDef[];
}

const f = (
  key: string,
  type: FieldType,
  fr: string,
  en: string,
  placeholder?: string,
): FieldDef => ({
  key,
  type,
  label: { fr, en },
  ...(placeholder ? { placeholder } : {}),
});

export const BLOCK_DEFS: BlockDef[] = [
  {
    type: "text",
    icon: "AlignLeft",
    label: { fr: "Texte", en: "Text" },
    fields: [
      f("title", "text", "Titre", "Title"),
      f("body", "textarea", "Contenu", "Content"),
    ],
  },
  {
    type: "image",
    icon: "Image",
    label: { fr: "Image", en: "Image" },
    fields: [
      f("url", "image", "Image", "Image"),
      f("caption", "text", "Légende", "Caption"),
    ],
  },
  {
    type: "gallery",
    icon: "Images",
    label: { fr: "Galerie", en: "Gallery" },
    fields: [
      f("images", "list", "Images (URL)", "Images (URL)"),
      f("caption", "text", "Légende", "Caption"),
    ],
  },
  {
    type: "video",
    icon: "Video",
    label: { fr: "Vidéo", en: "Video" },
    fields: [
      f("url", "url", "Lien de la vidéo", "Video link"),
      f("title", "text", "Titre", "Title"),
    ],
  },
  {
    type: "button",
    icon: "MousePointerClick",
    label: { fr: "Bouton", en: "Button" },
    fields: [
      f("label", "text", "Libellé", "Label"),
      f("url", "url", "Lien", "Link"),
    ],
  },
  {
    type: "phone",
    icon: "Phone",
    label: { fr: "Téléphone", en: "Phone" },
    fields: [
      f("label", "text", "Libellé", "Label"),
      f("number", "tel", "Numéro", "Number"),
    ],
  },
  {
    type: "whatsapp",
    icon: "MessageCircle",
    label: { fr: "WhatsApp", en: "WhatsApp" },
    fields: [
      f("label", "text", "Libellé", "Label"),
      f("number", "tel", "Numéro", "Number"),
      f("message", "text", "Message pré-rempli", "Prefilled message"),
    ],
  },
  {
    type: "map",
    icon: "Map",
    label: { fr: "Carte", en: "Map" },
    fields: [
      f("label", "text", "Libellé", "Label"),
      f("address", "text", "Adresse", "Address"),
      f("latitude", "number", "Latitude", "Latitude"),
      f("longitude", "number", "Longitude", "Longitude"),
    ],
  },
  {
    type: "faq",
    icon: "HelpCircle",
    label: { fr: "FAQ", en: "FAQ" },
    fields: [
      f("title", "text", "Titre", "Title"),
      f("items", "pairs", "Questions / réponses", "Questions / answers"),
    ],
  },
  {
    type: "amenity",
    icon: "Sofa",
    label: { fr: "Équipement", en: "Amenity" },
    fields: [
      f("name", "text", "Nom", "Name"),
      f("description", "textarea", "Description", "Description"),
      f("photo_url", "image", "Photo", "Photo"),
      f("video_url", "url", "Vidéo", "Video"),
    ],
  },
  {
    type: "recommendation",
    icon: "Star",
    label: { fr: "Recommandation", en: "Recommendation" },
    fields: [
      f("name", "text", "Nom", "Name"),
      f("description", "textarea", "Description", "Description"),
      f("photo_url", "image", "Photo", "Photo"),
      f("address", "text", "Adresse", "Address"),
      f("latitude", "number", "Latitude", "Latitude"),
      f("longitude", "number", "Longitude", "Longitude"),
      f("phone", "tel", "Téléphone", "Phone"),
      f("whatsapp", "tel", "WhatsApp", "WhatsApp"),
      f("website", "url", "Site web", "Website"),
      f("instagram", "text", "Instagram", "Instagram"),
    ],
  },
  {
    type: "hours",
    icon: "Clock",
    label: { fr: "Horaires", en: "Hours" },
    fields: [
      f("title", "text", "Titre", "Title"),
      f("items", "pairs", "Horaires", "Hours"),
    ],
  },
  {
    type: "notice",
    icon: "AlertTriangle",
    label: { fr: "Information importante", en: "Important notice" },
    fields: [
      f("title", "text", "Titre", "Title"),
      f("body", "textarea", "Message", "Message"),
    ],
  },
  {
    type: "wifi",
    icon: "Wifi",
    label: { fr: "Wi-Fi", en: "Wi-Fi" },
    fields: [
      f("network", "text", "Nom du réseau", "Network name"),
      f("password", "text", "Mot de passe", "Password"),
    ],
  },
  {
    type: "checkin",
    icon: "LogIn",
    label: { fr: "Arrivée", en: "Check-in" },
    fields: [
      f("time", "time", "Heure d'arrivée", "Check-in time"),
      f("address", "text", "Adresse", "Address"),
      f("instructions", "textarea", "Instructions", "Instructions"),
      f("keys", "textarea", "Récupération des clés", "Key pickup"),
      f("parking", "textarea", "Parking", "Parking"),
      f("video_url", "url", "Vidéo", "Video"),
    ],
  },
  {
    type: "checkout",
    icon: "LogOut",
    label: { fr: "Départ", en: "Check-out" },
    fields: [
      f("time", "time", "Heure de départ", "Check-out time"),
      f("instructions", "textarea", "Instructions", "Instructions"),
      f("keys", "textarea", "Clés", "Keys"),
      f("waste", "textarea", "Déchets", "Waste"),
      f("dishes", "textarea", "Vaisselle", "Dishes"),
      f("ac", "textarea", "Climatisation", "Air conditioning"),
    ],
  },
  {
    type: "rules",
    icon: "ScrollText",
    label: { fr: "Règles de la maison", en: "House rules" },
    fields: [
      f("title", "text", "Titre", "Title"),
      f("items", "rules", "Règles", "Rules"),
    ],
  },
];

export const BLOCK_DEF_MAP: Record<string, BlockDef> = Object.fromEntries(
  BLOCK_DEFS.map((def) => [def.type, def]),
);

/** Rules the host can simply switch on or off. */
export const DEFAULT_RULES: { label: Record<Lang2, string> }[] = [
  { label: { fr: "Non-fumeur", en: "No smoking" } },
  { label: { fr: "Animaux non admis", en: "No pets" } },
  { label: { fr: "Pas de fête ni d'événement", en: "No parties or events" } },
  { label: { fr: "Calme entre 22h et 8h", en: "Quiet hours 10pm – 8am" } },
  { label: { fr: "Chaussures à retirer", en: "Please remove shoes" } },
  { label: { fr: "Visiteurs non déclarés interdits", en: "No unregistered guests" } },
  { label: { fr: "Merci de trier les déchets", en: "Please sort the waste" } },
];

export interface SectionDef {
  type: string;
  icon: string;
  label: Record<Lang2, string>;
  /** Blocks created automatically with the section. */
  defaults: string[];
}

export const SECTION_DEFS: SectionDef[] = [
  {
    type: "welcome",
    icon: "Sparkles",
    label: { fr: "Bienvenue", en: "Welcome" },
    defaults: ["text"],
  },
  {
    type: "essentials",
    icon: "Info",
    label: { fr: "Informations essentielles", en: "Essentials" },
    defaults: ["text", "hours"],
  },
  {
    type: "checkin",
    icon: "LogIn",
    label: { fr: "Check-in", en: "Check-in" },
    defaults: ["checkin"],
  },
  { type: "wifi", icon: "Wifi", label: { fr: "Wi-Fi", en: "Wi-Fi" }, defaults: ["wifi"] },
  {
    type: "home",
    icon: "Home",
    label: { fr: "Le logement", en: "The home" },
    defaults: ["text", "gallery"],
  },
  {
    type: "amenities",
    icon: "Sofa",
    label: { fr: "Équipements", en: "Amenities" },
    defaults: ["amenity"],
  },
  {
    type: "house_rules",
    icon: "ScrollText",
    label: { fr: "Règles de la maison", en: "House rules" },
    defaults: ["rules"],
  },
  {
    type: "local_guide",
    icon: "MapPin",
    label: { fr: "Guide local", en: "Local guide" },
    defaults: [],
  },
  {
    type: "contacts",
    icon: "Phone",
    label: { fr: "Numéros utiles", en: "Useful numbers" },
    defaults: ["phone", "whatsapp"],
  },
  {
    type: "checkout",
    icon: "LogOut",
    label: { fr: "Check-out", en: "Check-out" },
    defaults: ["checkout"],
  },
];

export const SECTION_DEF_MAP: Record<string, SectionDef> = Object.fromEntries(
  SECTION_DEFS.map((def) => [def.type, def]),
);

export const RECOMMENDATION_CATEGORIES: {
  value: string;
  label: Record<Lang2, string>;
}[] = [
  { value: "restaurants", label: { fr: "Restaurants", en: "Restaurants" } },
  { value: "cafes", label: { fr: "Cafés", en: "Cafés" } },
  { value: "supermarkets", label: { fr: "Supermarchés", en: "Supermarkets" } },
  { value: "beaches", label: { fr: "Plages", en: "Beaches" } },
  { value: "activities", label: { fr: "Activités", en: "Activities" } },
  { value: "culture", label: { fr: "Culture", en: "Culture" } },
  { value: "shopping", label: { fr: "Shopping", en: "Shopping" } },
  { value: "transport", label: { fr: "Transport", en: "Transport" } },
  { value: "health", label: { fr: "Santé", en: "Health" } },
];

/** Visual theme of a guidebook. Merged over the template configuration. */
export interface GuideTheme {
  template?: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  heading_font: string;
  body_font: string;
  card_style: "rounded" | "soft" | "sharp" | "flat";
  button_style: "pill" | "square" | "outline";
  cover_style: "full" | "banner" | "portrait" | "minimal";
  nav_style: "grid" | "list";
}

export const DEFAULT_THEME: GuideTheme = {
  template: "modern",
  primary: "#1B4FA0",
  accent: "#3B82F6",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  heading_font: "Inter",
  body_font: "Inter",
  card_style: "rounded",
  button_style: "pill",
  cover_style: "full",
  nav_style: "grid",
};

export function mergeTheme(value: unknown): GuideTheme {
  const theme = (value ?? {}) as Partial<GuideTheme>;
  return { ...DEFAULT_THEME, ...theme };
}

export function emptyContent(type: string): Record<string, unknown> {
  const def = BLOCK_DEF_MAP[type];
  if (!def) return {};
  const content: Record<string, unknown> = {};
  for (const field of def.fields) {
    if (field.type === "list") content[field.key] = [];
    else if (field.type === "pairs") content[field.key] = [];
    else if (field.type === "rules")
      content[field.key] = DEFAULT_RULES.map((rule) => ({
        label: rule.label.fr,
        enabled: false,
      }));
    else content[field.key] = "";
  }
  return content;
}
