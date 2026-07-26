"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useTransition } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { locales, localeLabels, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({
  variant = "dropdown",
}: {
  variant?: "dropdown" | "pills";
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchTo(newLocale: Locale) {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || `/${newLocale}`;
    startTransition(() => {
      router.push(newPath);
    });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("qaliye-locale", newLocale);
    }
    setIsOpen(false);
  }

  if (variant === "pills") {
    return (
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("language")}>
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => switchTo(l)}
            disabled={isPending}
            aria-current={l === locale}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
              l === locale
                ? "bg-primary text-white"
                : "bg-surface text-text-secondary border border-border hover:border-primary/40"
            }`}
          >
            {localeLabels[l].label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("language")}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-background-soft transition-colors min-h-[44px]"
      >
        <Globe className="w-5 h-5" aria-hidden="true" />
        <span>{localeLabels[locale].label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-lg bg-surface border border-border shadow-lg z-50 py-1"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                onClick={() => switchTo(l)}
                role="option"
                aria-selected={l === locale}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-text-primary hover:bg-background-soft transition-colors min-h-[44px]"
              >
                <span>{localeLabels[l].native}</span>
                {l === locale && <Check className="w-4 h-4 text-primary" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
