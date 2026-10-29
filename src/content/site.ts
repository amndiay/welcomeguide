import type { Copy } from "@/i18n/copy";

export const site = {
  name: "Dalal",
  email: "bonjour@dalal.app",
} as const;

/** Nav items reference a key in the translated `nav` dictionary. */
export const mainNav = [
  { key: "home", to: "/" },
  { key: "features", to: "/fonctionnalites" },
  { key: "pricing", to: "/tarifs" },
  { key: "example", to: "/exemple" },
] as const satisfies readonly { key: keyof Copy["nav"]; to: string }[];

export const footerNav = [
  { key: "product", to: "/fonctionnalites" },
  { key: "pricing", to: "/tarifs" },
  { key: "faq", to: "/faq" },
  { key: "contact", to: "/contact" },
  { key: "terms", to: "/conditions" },
  { key: "privacy", to: "/confidentialite" },
] as const satisfies readonly { key: keyof Copy["footer"]; to: string }[];
