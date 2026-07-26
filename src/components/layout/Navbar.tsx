"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import { Menu, X, Heart, Download } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { STORE_URLS } from "@/lib/constants";

export function Navbar() {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/features", label: t("features") },
    { href: "/help", label: t("help") },
    { href: "/contact", label: t("contact") },
  ] as const;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
      <nav
        className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-text-primary"
            aria-label={tSite("name")}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-gradient">
              <Heart className="w-5 h-5 text-white" aria-hidden="true" />
            </span>
            <span>{tSite("name")}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-text-primary hover:bg-background-soft"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <div className="relative group">
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 min-h-[44px] download-glow"
                aria-haspopup="menu"
                aria-label="Download Qaliye app"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                <a
                  href={STORE_URLS.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background-soft transition-colors min-h-[44px]"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white">
                    <span className="text-xs font-bold">iOS</span>
                  </span>
                  <span className="text-sm font-medium text-text-primary">App Store</span>
                </a>
                <a
                  href={STORE_URLS.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background-soft transition-colors min-h-[44px]"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white">
                    <span className="text-[10px] font-bold">Android</span>
                  </span>
                  <span className="text-sm font-medium text-text-primary">Google Play</span>
                </a>
              </div>
            </div>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-text-primary hover:bg-background-soft min-h-[44px] min-w-[44px]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("close") : t("menu")}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border py-4 space-y-1">
            <div className="px-3 py-3 flex gap-2">
              <a
                href={STORE_URLS.ios}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold py-3 min-h-[44px] shadow-md"
              >
                <Download className="w-4 h-4" />
                App Store
              </a>
              <a
                href={STORE_URLS.android}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold py-3 min-h-[44px] shadow-md"
              >
                <Download className="w-4 h-4" />
                Google Play
              </a>
            </div>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors min-h-[44px] ${
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-text-primary hover:bg-background-soft"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
