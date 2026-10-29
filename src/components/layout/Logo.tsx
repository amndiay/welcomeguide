import { useLanguage } from "@/i18n/LanguageProvider";

export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();

  return (
    <span className="flex items-center gap-2.5">
      <span className="gradient-primary flex size-9 items-center justify-center rounded-xl text-primary-foreground shadow-soft">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 19V6.5A2.5 2.5 0 0 1 6.5 4H19v13" />
          <path d="M6.5 17H19v3H6.5A2.5 2.5 0 0 1 6.5 17Z" />
          <path d="M10 8h5" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className="text-[1.35rem] text-primary"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Dalal App
          </span>
          <span className="mt-0.5 text-[0.52rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t.site.baseline}
          </span>
        </span>
      )}
    </span>
  );
}
