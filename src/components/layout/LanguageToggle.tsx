import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/** FR / EN switcher for the whole site. */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card p-1",
        className,
      )}
      role="group"
      aria-label={lang === "fr" ? "Choisir la langue" : "Choose language"}
    >
      <Languages className="ml-1.5 size-3.5 text-muted-foreground" aria-hidden />
      {(["fr", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors",
            lang === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
