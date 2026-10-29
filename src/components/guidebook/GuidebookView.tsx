import { useEffect, useState } from "react";
import {
  Bus,
  ClipboardCheck,
  Facebook,
  Heart,
  Info,
  Instagram,
  Luggage,
  MapPin,
  Phone,
  Sparkles,
  Wifi,
  Youtube,
} from "lucide-react";
import type { Guidebook, GuidebookSectionKind } from "@/types/guidebook";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";

const SECTION_ICONS: Record<GuidebookSectionKind, typeof Wifi> = {
  welcome: Heart,
  checkin: ClipboardCheck,
  wifi: Wifi,
  house_rules: Info,
  amenities: Sparkles,
  local_guide: MapPin,
  checkout: Luggage,
  contacts: Phone,
};

/** Guest-facing rendering of a published guidebook. */
export function GuidebookView({
  guidebook,
  variant = "default",
}: {
  guidebook: Guidebook;
  variant?: "default" | "framed";
}) {
  const { property, sections } = guidebook;
  const isFramed = variant === "framed";
  const [openId, setOpenId] = useState<string | null>(null);
  const { lang, toggleLang, t } = useLanguage();

  const openSection = sections.find((section) => section.id === openId);
  const OpenIcon = openSection
    ? (SECTION_ICONS[openSection.kind] ?? Info)
    : null;

  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!openId) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-md pb-10 sm:px-4",
        isFramed && "relative max-w-none pb-0 sm:px-0",
      )}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden bg-card shadow-soft sm:rounded-[2.5rem] sm:border sm:border-border",
          isFramed && "rounded-none border-0 shadow-none sm:rounded-none",
        )}
      >
        {/* Cover */}
        <header className="relative h-52 w-full sm:h-60">
          {property.coverImageUrl && (
            <img
              src={property.coverImageUrl}
              alt={`${property.name} — ${property.city}`}
              className="h-full w-full object-cover"
              width={800}
              height={400}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* Host avatar overlay */}
          {property.host && (
            <div className="absolute -bottom-7 left-6 flex items-end gap-4">
              <div className="relative">
                {property.host.avatarUrl && (
                  <img
                    src={property.host.avatarUrl}
                    alt={`${t.guidebook.hostLabel}, ${property.host.name}`}
                    className="size-20 rounded-2xl border-4 border-white object-cover shadow-lift"
                    width={200}
                    height={200}
                  />
                )}
                <span
                  className="absolute -top-1.5 -right-1.5 size-5 rounded-full border-2 border-white bg-emerald-500"
                  aria-label={t.guidebook.hostAvailable}
                />
              </div>
              <div className="mb-7 text-white">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
                  {t.guidebook.hostLabel}
                </p>
                <p className="text-xl font-bold drop-shadow">
                  {property.host.name}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="grow px-6 pt-12 pb-6">
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight text-primary">
              {t.guidebook.welcomePrefix} {property.city}
            </h1>
            {property.tagline && (
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {property.tagline}
              </p>
            )}
          </div>

          {/* Section tiles */}
          <div className="grid grid-cols-2 gap-4">
            {sections.map((section) => {
              const Icon = SECTION_ICONS[section.kind] ?? Info;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setOpenId(section.id)}
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-border bg-guide-tile p-6 transition-all duration-300 hover:shadow-soft active:scale-95"
                >
                  <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm transition-shadow group-hover:shadow-md">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-xs font-bold tracking-wider text-primary uppercase">
                    {section.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 pt-8 pb-10 text-center">
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-2.5 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              {lang === "en"
                ? t.guidebook.toggleToFrench
                : t.guidebook.toggleToEnglish}
            </button>
          </div>

          <p className="mb-6 font-script text-4xl tracking-wide text-primary">
            Dalal
          </p>

          <div className="mb-6 flex items-center justify-center gap-8">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Youtube className="size-5" />
            </a>
          </div>

          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {t.guidebook.madeWith} <span aria-hidden="true">❤️</span> in Dakar{" "}
            <span aria-hidden="true">🇸🇳</span>
          </p>
        </footer>
      </div>

      {/* Section modal (bottom sheet) */}
      {openSection && OpenIcon && (
        <div
          className="fixed inset-0 z-60 flex items-end justify-center bg-primary/40 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={openSection.title}
          onClick={() => setOpenId(null)}
        >
          <div
            className="reveal-sheet w-full max-w-md rounded-t-[3rem] bg-card p-8 pb-10 shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Pull indicator */}
            <div className="mx-auto mb-8 h-1 w-12 rounded-full bg-border" />

            <div className="mb-8 flex items-center gap-5">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl border border-border bg-guide-tile text-primary">
                <OpenIcon className="size-8" />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-primary">
                  {openSection.title}
                </h2>
                {openSection.summary && (
                  <p className="text-sm font-medium text-muted-foreground">
                    {openSection.summary}
                  </p>
                )}
              </div>
            </div>

            <dl className="mb-10 space-y-6">
              {openSection.items.map((item) => (
                <div key={item.label}>
                  <dt className="mb-1.5 block text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    {item.label}
                  </dt>
                  <dd className="text-base leading-snug font-semibold text-card-foreground">
                    {item.value}
                  </dd>
                  {item.hint && (
                    <dd className="mt-1 text-sm font-medium text-accent italic">
                      {item.hint}
                    </dd>
                  )}
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => setOpenId(null)}
              className={cn(
                "w-full cursor-pointer rounded-[1.5rem] bg-primary py-4 text-center text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-lift transition-colors hover:bg-primary-deep",
              )}
            >
              {t.guidebook.close}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
