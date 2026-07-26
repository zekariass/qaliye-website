import { defineRouting } from "next-intl/routing";

export const locales = ["en", "am", "ti", "om"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, { code: string; native: string; label: string }> = {
  en: { code: "en", native: "English", label: "EN" },
  am: { code: "am", native: "አማርኛ", label: "አማ" },
  ti: { code: "ti", native: "ትግርኛ", label: "ትግ" },
  om: { code: "om", native: "Afaan Oromoo", label: "Orom" },
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
