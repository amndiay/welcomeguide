import { useLanguage } from "@/i18n/LanguageProvider";
import { appCopy, type AppCopy } from "@/i18n/appCopy";

/** Copy dictionary for the authenticated SaaS area. */
export function useAppCopy(): AppCopy {
  const { lang } = useLanguage();
  return appCopy[lang];
}
