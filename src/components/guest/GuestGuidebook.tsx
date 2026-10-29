import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Copy,
  LogIn,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import {
  BlockView,
  LocalGuide,
  radius,
  type PreviewRecommendation,
} from "@/components/editor/GuidePreview";
import { SectionIcon } from "@/components/editor/SectionIcon";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useLanguage } from "@/i18n/LanguageProvider";
import { editorCopy } from "@/i18n/editorCopy";
import { guestCopy } from "@/i18n/guestCopy";
import { SECTION_DEF_MAP, mergeTheme } from "@/lib/guide-schema";
import type { PublicGuide } from "@/lib/public-guide.functions";

function digits(value?: string | null) {
  return (value ?? "").replace(/[^0-9]/g, "");
}

/** Mobile-first, premium guest-facing rendering of a published guidebook. */
export function GuestGuidebook({ guide }: { guide: PublicGuide }) {
  const { lang } = useLanguage();
  const copy = guestCopy[lang];
  const editor = editorCopy[lang];
  const theme = useMemo(() => mergeTheme(guide.theme), [guide.theme]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const property = guide.property;
  const active = guide.sections.find((section) => section.id === activeId) ?? null;

  useEffect(() => {
    if (active) window.scrollTo({ top: 0 });
  }, [active]);

  const wifiSection = guide.sections.find(
    (section) => section.type === "wifi" || section.blocks.some((b) => b.type === "wifi"),
  );
  const checkinSection = guide.sections.find(
    (section) =>
      section.type === "checkin" || section.blocks.some((b) => b.type === "checkin"),
  );

  const mapsHref = property?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${property.address} ${property.city ?? ""}`.trim(),
      )}`
    : null;
  const whatsappHref = digits(property?.whatsapp)
    ? `https://wa.me/${digits(property?.whatsapp)}?text=${encodeURIComponent(copy.whatsappMessage)}`
    : null;
  const phoneHref = property?.phone ? `tel:${property.phone}` : null;

  const quickActions = [
    mapsHref ? { key: "map", label: copy.directions, icon: Navigation, href: mapsHref } : null,
    whatsappHref
      ? { key: "wa", label: copy.whatsapp, icon: MessageCircle, href: whatsappHref }
      : null,
    phoneHref ? { key: "tel", label: copy.call, icon: Phone, href: phoneHref } : null,
    wifiSection
      ? {
          key: "wifi",
          label: copy.wifi,
          icon: Wifi,
          onClick: () => setActiveId(wifiSection.id),
        }
      : null,
    checkinSection
      ? {
          key: "checkin",
          label: copy.checkin,
          icon: LogIn,
          onClick: () => setActiveId(checkinSection.id),
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon: typeof Wifi;
    href?: string;
    onClick?: () => void;
  }[];

  const cardRadius = radius(theme);

  return (
    <div
      className="min-h-dvh pb-16"
      style={{
        background: theme.background,
        color: theme.text,
        fontFamily: `${theme.body_font}, system-ui, sans-serif`,
      }}
    >
      <div className="mx-auto w-full max-w-md">
        {active ? (
          <section className="px-4 pt-6">
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="mb-4 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold tracking-wide uppercase"
              style={{ color: theme.primary }}
            >
              <ChevronLeft className="size-4" />
              {copy.back}
            </button>
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: `${theme.heading_font}, serif` }}
            >
              {active.title ?? SECTION_DEF_MAP[active.type]?.label[lang] ?? active.type}
            </h1>
            <div className="mt-4 space-y-3">
              {active.type === "local_guide" ? (
                <LocalGuide
                  theme={theme}
                  lang={lang}
                  recommendations={guide.recommendations as PreviewRecommendation[]}
                />
              ) : null}
              {active.blocks.map((block) => (
                <BlockView
                  key={block.id}
                  theme={theme}
                  type={block.type}
                  content={(block.content ?? {}) as Record<string, unknown>}
                  copyPassword={editor.copyPassword}
                  passwordCopied={editor.passwordCopied}
                />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Header / cover */}
            <header className="relative">
              {guide.cover_image_url ? (
                <img
                  src={guide.cover_image_url}
                  alt={`${guide.title}${property?.city ? ` — ${property.city}` : ""}`}
                  className="h-64 w-full object-cover"
                  width={800}
                  height={512}
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div className="h-40 w-full" style={{ background: theme.primary }} />
              )}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute top-4 right-4">
                <LanguageToggle />
              </div>
              {guide.logo_url ? (
                <img
                  src={guide.logo_url}
                  alt=""
                  className="absolute top-4 left-4 h-8 w-auto"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h1
                  className="text-2xl font-bold drop-shadow"
                  style={{ fontFamily: `${theme.heading_font}, serif` }}
                >
                  {property?.name ?? guide.title}
                </h1>
                {property?.city ? (
                  <p className="mt-0.5 flex items-center gap-1 text-sm font-medium opacity-90">
                    <MapPin className="size-3.5" />
                    {property.city}
                    {property.country ? `, ${property.country}` : ""}
                  </p>
                ) : null}
              </div>
            </header>

            {/* Host + welcome */}
            <div className="px-5 pt-5">
              {guide.host_avatar_url || guide.host_name ? (
                <div className="flex items-center gap-3">
                  {guide.host_avatar_url ? (
                    <img
                      src={guide.host_avatar_url}
                      alt={guide.host_name ?? copy.hostLabel}
                      className="size-12 rounded-full object-cover"
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div>
                    <p
                      className="text-[10px] font-bold tracking-[0.2em] uppercase"
                      style={{ color: theme.primary }}
                    >
                      {copy.hostLabel}
                    </p>
                    <p className="text-sm font-semibold">{guide.host_name}</p>
                  </div>
                </div>
              ) : null}
              {guide.welcome_message ? (
                <p className="mt-4 text-sm leading-relaxed opacity-75">
                  {guide.welcome_message}
                </p>
              ) : null}
            </div>

            {/* Quick actions */}
            {quickActions.length > 0 && (
              <section className="mt-6 px-4">
                <p
                  className="mb-2 px-1 text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: theme.primary }}
                >
                  {copy.quickActions}
                </p>
                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                  {quickActions.map((action) => {
                    const inner = (
                      <>
                        <action.icon className="size-5" />
                        <span className="text-[11px] font-semibold">{action.label}</span>
                      </>
                    );
                    const style = {
                      background: theme.surface,
                      borderRadius: cardRadius,
                      color: theme.primary,
                    };
                    const className =
                      "flex min-w-[76px] shrink-0 cursor-pointer flex-col items-center gap-1.5 px-3 py-3 shadow-sm transition-transform active:scale-95";
                    return action.href ? (
                      <a
                        key={action.key}
                        href={action.href}
                        target={action.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className={className}
                        style={style}
                      >
                        {inner}
                      </a>
                    ) : (
                      <button
                        key={action.key}
                        type="button"
                        onClick={action.onClick}
                        className={className}
                        style={style}
                      >
                        {inner}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Essentials */}
            {(property?.wifi_password ||
              property?.checkin_time ||
              property?.address) && (
              <section className="mt-5 px-4">
                <div
                  className="space-y-3 p-4 text-sm"
                  style={{ background: theme.surface, borderRadius: cardRadius }}
                >
                  {property?.wifi_name || property?.wifi_password ? (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase opacity-50">
                          {copy.wifi}
                        </p>
                        <p className="font-semibold">{property.wifi_name}</p>
                        {property.wifi_password ? (
                          <p className="font-mono text-sm">{property.wifi_password}</p>
                        ) : null}
                      </div>
                      {property.wifi_password ? (
                        <button
                          type="button"
                          onClick={() => {
                            void navigator.clipboard.writeText(
                              property.wifi_password ?? "",
                            );
                            toast.success(copy.copied);
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                          style={{ background: `${theme.primary}14`, color: theme.primary }}
                        >
                          <Copy className="size-3.5" />
                          {copy.copy}
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                  {property?.checkin_time || property?.checkout_time ? (
                    <div className="flex gap-6">
                      {property.checkin_time ? (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase opacity-50">
                            {copy.checkinTime}
                          </p>
                          <p className="font-semibold">{property.checkin_time}</p>
                        </div>
                      ) : null}
                      {property.checkout_time ? (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase opacity-50">
                            {copy.checkoutTime}
                          </p>
                          <p className="font-semibold">{property.checkout_time}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {property?.address ? (
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase opacity-50">
                        {copy.address}
                      </p>
                      <p className="font-medium">{property.address}</p>
                    </div>
                  ) : null}
                </div>
              </section>
            )}

            {/* Sections */}
            <nav className="mt-6 px-4">
              <p
                className="mb-2 px-1 text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: theme.primary }}
              >
                {copy.sections}
              </p>
              <div
                className={`gap-3 ${theme.nav_style === "list" ? "flex flex-col" : "grid grid-cols-2"}`}
              >
                {guide.sections.map((section) => {
                  const def = SECTION_DEF_MAP[section.type];
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveId(section.id)}
                      className={`flex cursor-pointer items-center gap-3 p-4 text-left text-sm font-semibold shadow-sm transition-transform active:scale-[0.98] ${theme.nav_style === "list" ? "" : "flex-col items-start gap-2"}`}
                      style={{ background: theme.surface, borderRadius: cardRadius }}
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
            </nav>

            <footer className="mt-10 px-4 text-center">
              <p className="font-script text-3xl" style={{ color: theme.primary }}>
                Dalal
              </p>
              <p className="mt-1 text-[10px] font-semibold tracking-widest uppercase opacity-50">
                {copy.poweredBy}
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
