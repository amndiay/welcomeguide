import { useState } from "react";
import {
  ChevronLeft,
  Copy,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";
import { editorCopy } from "@/i18n/editorCopy";
import {
  RECOMMENDATION_CATEGORIES,
  SECTION_DEF_MAP,
  type GuideTheme,
} from "@/lib/guide-schema";
import type { GuideSectionRow } from "@/lib/editor.functions";
import { SectionIcon } from "@/components/editor/SectionIcon";

export interface PreviewGuide {
  title: string;
  cover_image_url?: string | null;
  logo_url?: string | null;
  welcome_message?: string | null;
  host_name?: string | null;
  host_avatar_url?: string | null;
}

export interface PreviewRecommendation {
  id: string;
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

export const radius = (theme: GuideTheme) =>
  theme.card_style === "sharp"
    ? "0.25rem"
    : theme.card_style === "flat"
      ? "0.75rem"
      : theme.card_style === "soft"
        ? "1.5rem"
        : "1.25rem";

/** Navigable, themed rendering of a guidebook — used inside the phone frame. */
export function GuidePreview({
  guide,
  theme,
  sections,
  recommendations,
}: {
  guide: PreviewGuide;
  theme: GuideTheme;
  sections: GuideSectionRow[];
  recommendations: PreviewRecommendation[];
}) {
  const { lang } = useLanguage();
  const copy = editorCopy[lang];
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleSections = sections.filter((section) => section.visible);
  const active = visibleSections.find((section) => section.id === activeId) ?? null;

  const coverHeight =
    theme.cover_style === "banner"
      ? "9rem"
      : theme.cover_style === "portrait"
        ? "20rem"
        : theme.cover_style === "minimal"
          ? "0rem"
          : "15rem";

  return (
    <div
      className="min-h-full pb-16"
      style={{
        background: theme.background,
        color: theme.text,
        fontFamily: `${theme.body_font}, system-ui, sans-serif`,
      }}
    >
      {active ? (
        <div className="px-4 pt-14">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="mb-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: theme.primary }}
          >
            <ChevronLeft className="size-4" />
            {guide.title}
          </button>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: `${theme.heading_font}, serif` }}
          >
            {active.title ?? SECTION_DEF_MAP[active.type]?.label[lang] ?? active.type}
          </h2>

          <div className="mt-4 space-y-3">
            {active.type === "local_guide" ? (
              <LocalGuide theme={theme} recommendations={recommendations} lang={lang} />
            ) : null}
            {active.blocks
              .filter((block) => block.visible)
              .map((block) => (
                <BlockView
                  key={block.id}
                  theme={theme}
                  type={block.type}
                  content={(block.content ?? {}) as Record<string, unknown>}
                  copyPassword={copy.copyPassword}
                  passwordCopied={copy.passwordCopied}
                />
              ))}
          </div>
        </div>
      ) : (
        <>
          {theme.cover_style !== "minimal" && (
            <div className="relative" style={{ height: coverHeight }}>
              {guide.cover_image_url ? (
                <img
                  src={guide.cover_image_url}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full" style={{ background: theme.primary }} />
              )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              {guide.logo_url ? (
                <img
                  src={guide.logo_url}
                  alt=""
                  className="absolute top-12 left-4 h-8 w-auto"
                />
              ) : null}
              {guide.host_avatar_url ? (
                <img
                  src={guide.host_avatar_url}
                  alt=""
                  className="absolute -bottom-7 left-1/2 size-16 -translate-x-1/2 rounded-full border-4 object-cover"
                  style={{ borderColor: theme.background }}
                />
              ) : null}
            </div>
          )}

          <div
            className={`px-5 text-center ${guide.host_avatar_url ? "pt-10" : "pt-6"} ${theme.cover_style === "minimal" ? "pt-16" : ""}`}
          >
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: `${theme.heading_font}, serif` }}
            >
              {guide.title}
            </h1>
            {guide.welcome_message ? (
              <p className="mt-2 text-sm opacity-70">{guide.welcome_message}</p>
            ) : null}
            {guide.host_name ? (
              <p
                className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: theme.primary }}
              >
                {guide.host_name}
              </p>
            ) : null}
          </div>

          <div
            className={`mt-6 gap-3 px-4 ${theme.nav_style === "grid" ? "grid grid-cols-2" : "flex flex-col"}`}
          >
            {visibleSections.map((section) => {
              const def = SECTION_DEF_MAP[section.type];
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveId(section.id)}
                  className={`flex items-center gap-3 p-3 text-left text-sm font-semibold transition-transform active:scale-[0.98] ${theme.nav_style === "grid" ? "flex-col items-start gap-2" : ""}`}
                  style={{
                    background: theme.surface,
                    borderRadius: radius(theme),
                    boxShadow:
                      theme.card_style === "flat" ? "none" : "0 8px 24px -18px #0F172A",
                    border: theme.card_style === "flat" ? "1px solid #E2E8F0" : undefined,
                  }}
                >
                  <span
                    className="inline-flex size-9 items-center justify-center rounded-full"
                    style={{ background: `${theme.primary}14`, color: theme.primary }}
                  >
                    <SectionIcon name={def?.icon ?? "Info"} className="size-4" />
                  </span>
                  <span>{section.title ?? def?.label[lang] ?? section.type}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function Card({
  theme,
  children,
}: {
  theme: GuideTheme;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-4 text-sm"
      style={{
        background: theme.surface,
        borderRadius: radius(theme),
        boxShadow: theme.card_style === "flat" ? "none" : "0 10px 30px -24px #0F172A",
        border: theme.card_style === "flat" ? "1px solid #E2E8F0" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function ActionButton({
  theme,
  href,
  onClick,
  children,
}: {
  theme: GuideTheme;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    borderRadius: theme.button_style === "square" ? "0.5rem" : "999px",
    background: theme.button_style === "outline" ? "transparent" : theme.primary,
    color: theme.button_style === "outline" ? theme.primary : "#FFFFFF",
    border: theme.button_style === "outline" ? `1px solid ${theme.primary}` : "none",
  };
  const className =
    "inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold";
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} style={style}>
        {children}
      </a>
    );
  return (
    <button type="button" className={className} style={style} onClick={onClick}>
      {children}
    </button>
  );
}

function Title({ theme, children }: { theme: GuideTheme; children: React.ReactNode }) {
  return (
    <p
      className="mb-1 text-sm font-semibold"
      style={{ fontFamily: `${theme.heading_font}, serif` }}
    >
      {children}
    </p>
  );
}

export function BlockView({
  theme,
  type,
  content,
  copyPassword,
  passwordCopied,
}: {
  theme: GuideTheme;
  type: string;
  content: Record<string, unknown>;
  copyPassword: string;
  passwordCopied: string;
}) {
  const str = (key: string) => {
    const value = content[key];
    return value == null || value === "" ? null : String(value);
  };
  const list = (key: string) =>
    Array.isArray(content[key]) ? (content[key] as unknown[]) : [];

  switch (type) {
    case "text":
      return (
        <Card theme={theme}>
          {str("title") ? <Title theme={theme}>{str("title")}</Title> : null}
          <p className="whitespace-pre-line opacity-80">{str("body")}</p>
        </Card>
      );
    case "image":
      return (
        <div style={{ borderRadius: radius(theme), overflow: "hidden" }}>
          {str("url") ? (
            <img src={str("url")!} alt={str("caption") ?? ""} className="w-full" />
          ) : null}
          {str("caption") ? (
            <p className="mt-1 text-xs opacity-60">{str("caption")}</p>
          ) : null}
        </div>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-2 gap-2">
          {(list("images") as string[])
            .filter(Boolean)
            .map((url, index) => (
              <img
                key={index}
                src={url}
                alt=""
                className="aspect-square w-full object-cover"
                style={{ borderRadius: radius(theme) }}
              />
            ))}
        </div>
      );
    case "video":
      return (
        <Card theme={theme}>
          {str("title") ? <Title theme={theme}>{str("title")}</Title> : null}
          {str("url") ? (
            <ActionButton theme={theme} href={str("url")!}>
              <ExternalLink className="size-3.5" />
              {str("title") ?? "Vidéo"}
            </ActionButton>
          ) : null}
        </Card>
      );
    case "button":
      return (
        <ActionButton theme={theme} href={str("url") ?? "#"}>
          {str("label") ?? "Ouvrir"}
        </ActionButton>
      );
    case "phone":
      return (
        <Card theme={theme}>
          <Title theme={theme}>{str("label") ?? "Téléphone"}</Title>
          <ActionButton theme={theme} href={`tel:${str("number") ?? ""}`}>
            <Phone className="size-3.5" />
            {str("number")}
          </ActionButton>
        </Card>
      );
    case "whatsapp":
      return (
        <Card theme={theme}>
          <Title theme={theme}>{str("label") ?? "WhatsApp"}</Title>
          <ActionButton
            theme={theme}
            href={`https://wa.me/${(str("number") ?? "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(str("message") ?? "")}`}
          >
            <MessageCircle className="size-3.5" />
            {str("number")}
          </ActionButton>
        </Card>
      );
    case "map":
      return (
        <Card theme={theme}>
          <Title theme={theme}>{str("label") ?? "Adresse"}</Title>
          <p className="mb-2 flex items-center gap-1 opacity-75">
            <MapPin className="size-3.5" />
            {str("address")}
          </p>
          <ActionButton
            theme={theme}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              str("latitude") && str("longitude")
                ? `${str("latitude")},${str("longitude")}`
                : (str("address") ?? ""),
            )}`}
          >
            <Navigation className="size-3.5" />
            Itinéraire
          </ActionButton>
        </Card>
      );
    case "faq":
      return (
        <Card theme={theme}>
          {str("title") ? <Title theme={theme}>{str("title")}</Title> : null}
          <div className="space-y-2">
            {(list("items") as { label?: string; value?: string }[]).map(
              (item, index) => (
                <div key={index}>
                  <p className="font-medium">{item?.label}</p>
                  <p className="opacity-70">{item?.value}</p>
                </div>
              ),
            )}
          </div>
        </Card>
      );
    case "hours":
      return (
        <Card theme={theme}>
          {str("title") ? <Title theme={theme}>{str("title")}</Title> : null}
          <ul className="space-y-1">
            {(list("items") as { label?: string; value?: string }[]).map(
              (item, index) => (
                <li key={index} className="flex justify-between gap-3">
                  <span className="opacity-70">{item?.label}</span>
                  <span className="font-medium">{item?.value}</span>
                </li>
              ),
            )}
          </ul>
        </Card>
      );
    case "amenity":
      return (
        <Card theme={theme}>
          <div className="flex gap-3">
            {str("photo_url") ? (
              <img
                src={str("photo_url")!}
                alt=""
                className="size-16 shrink-0 rounded-xl object-cover"
              />
            ) : null}
            <div>
              <Title theme={theme}>{str("name")}</Title>
              <p className="opacity-75">{str("description")}</p>
              {str("video_url") ? (
                <a
                  href={str("video_url")!}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: theme.primary }}
                >
                  <ExternalLink className="size-3" /> Vidéo
                </a>
              ) : null}
            </div>
          </div>
        </Card>
      );
    case "recommendation":
      return (
        <RecommendationCard
          theme={theme}
          item={{
            id: "block",
            category: "",
            name: str("name") ?? "",
            description: str("description"),
            photo_url: str("photo_url"),
            address: str("address"),
            phone: str("phone"),
            whatsapp: str("whatsapp"),
            website: str("website"),
            instagram: str("instagram"),
            latitude: content['latitude'] as number | null,
            longitude: content['longitude'] as number | null,
          }}
        />
      );
    case "notice":
      return (
        <div
          className="p-4 text-sm"
          style={{
            borderRadius: radius(theme),
            background: `${theme.accent}1A`,
            border: `1px solid ${theme.accent}55`,
          }}
        >
          <Title theme={theme}>{str("title") ?? "Important"}</Title>
          <p className="whitespace-pre-line opacity-80">{str("body")}</p>
        </div>
      );
    case "wifi":
      return (
        <Card theme={theme}>
          <Title theme={theme}>Wi-Fi</Title>
          <p className="opacity-70">
            <Wifi className="mr-1 inline size-3.5" />
            {str("network")}
          </p>
          <p className="my-2 font-mono text-base font-semibold">{str("password")}</p>
          <ActionButton
            theme={theme}
            onClick={() => {
              void navigator.clipboard.writeText(str("password") ?? "");
              toast.success(passwordCopied);
            }}
          >
            <Copy className="size-3.5" />
            {copyPassword}
          </ActionButton>
        </Card>
      );
    case "checkin":
    case "checkout": {
      const rows =
        type === "checkin"
          ? [
              ["Heure", str("time")],
              ["Adresse", str("address")],
              ["Instructions", str("instructions")],
              ["Clés", str("keys")],
              ["Parking", str("parking")],
            ]
          : [
              ["Heure", str("time")],
              ["Instructions", str("instructions")],
              ["Clés", str("keys")],
              ["Déchets", str("waste")],
              ["Vaisselle", str("dishes")],
              ["Climatisation", str("ac")],
            ];
      return (
        <Card theme={theme}>
          <div className="space-y-2">
            {rows
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label}>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: theme.primary }}
                  >
                    {label}
                  </p>
                  <p className="whitespace-pre-line opacity-80">{value}</p>
                </div>
              ))}
          </div>
          {str("video_url") ? (
            <div className="mt-3">
              <ActionButton theme={theme} href={str("video_url")!}>
                <ExternalLink className="size-3.5" /> Vidéo
              </ActionButton>
            </div>
          ) : null}
        </Card>
      );
    }
    case "rules":
      return (
        <Card theme={theme}>
          {str("title") ? <Title theme={theme}>{str("title")}</Title> : null}
          <ul className="space-y-1.5">
            {(list("items") as { label?: string; enabled?: boolean }[])
              .filter((item) => item?.enabled)
              .map((item, index) => (
                <li key={index} className="flex items-start gap-2 opacity-80">
                  <span style={{ color: theme.primary }}>•</span>
                  {item.label}
                </li>
              ))}
          </ul>
        </Card>
      );
    default:
      return null;
  }
}

export function LocalGuide({
  theme,
  recommendations,
  lang,
}: {
  theme: GuideTheme;
  recommendations: PreviewRecommendation[];
  lang: "fr" | "en";
}) {
  const visible = recommendations.filter((item) => item.visible !== false);
  const categories = RECOMMENDATION_CATEGORIES.filter((category) =>
    visible.some((item) => item.category === category.value),
  );

  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.value} className="space-y-2">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: theme.primary }}
          >
            {category.label[lang]}
          </p>
          {visible
            .filter((item) => item.category === category.value)
            .map((item) => (
              <RecommendationCard key={item.id} theme={theme} item={item} />
            ))}
        </div>
      ))}
    </div>
  );
}

function RecommendationCard({
  theme,
  item,
}: {
  theme: GuideTheme;
  item: PreviewRecommendation;
}) {
  const mapQuery =
    item.latitude && item.longitude
      ? `${item.latitude},${item.longitude}`
      : (item.address ?? item.name);

  return (
    <Card theme={theme}>
      {item.photo_url ? (
        <img
          src={item.photo_url}
          alt=""
          className="mb-3 h-32 w-full object-cover"
          style={{ borderRadius: radius(theme) }}
        />
      ) : null}
      <Title theme={theme}>{item.name}</Title>
      {item.description ? (
        <p className="opacity-75">{item.description}</p>
      ) : null}
      {item.address ? (
        <p className="mt-1 flex items-center gap-1 text-xs opacity-60">
          <MapPin className="size-3" />
          {item.address}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {item.phone ? (
          <ActionButton theme={theme} href={`tel:${item.phone}`}>
            <Phone className="size-3.5" />
          </ActionButton>
        ) : null}
        {item.whatsapp ? (
          <ActionButton
            theme={theme}
            href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, "")}`}
          >
            <MessageCircle className="size-3.5" />
          </ActionButton>
        ) : null}
        <ActionButton
          theme={theme}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
        >
          <Navigation className="size-3.5" />
        </ActionButton>
        {item.website ? (
          <ActionButton theme={theme} href={item.website}>
            <ExternalLink className="size-3.5" />
          </ActionButton>
        ) : null}
      </div>
    </Card>
  );
}
