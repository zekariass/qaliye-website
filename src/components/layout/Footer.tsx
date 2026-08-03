import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Camera, Send, Music2, AtSign } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { StoreButtons } from "@/components/ui/StoreButtons";

export function Footer() {
  const t = useTranslations();
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  const pageLinks = [
    { href: "/about", label: tNav("about") },
    { href: "/features", label: tNav("features") },
    { href: "/help", label: tNav("help") },
    { href: "/contact", label: tNav("contact") },
  ] as const;

  const legalLinks = [
    { href: "/privacy", label: tFooter("privacy") },
    { href: "/terms", label: tFooter("terms") },
    { href: "/community-guidelines", label: tFooter("communityGuidelines") },
    { href: "/safety-tips", label: tFooter("safetyTips") },
    { href: "/account-deletion", label: tFooter("accountDeletion") },
  ] as const;

  const socialLinks = [
    { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: Camera },
    { href: SOCIAL_LINKS.telegram, label: "Telegram", icon: Send },
    { href: SOCIAL_LINKS.tiktok, label: "TikTok", icon: Music2 },
    { href: SOCIAL_LINKS.twitter, label: "X/Twitter", icon: AtSign },
  ] as const;

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-gradient">
                <Heart className="w-5 h-5 text-white" aria-hidden="true" />
              </span>
              <span>{t("site.name")}</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              {tFooter("brandDescription")}
            </p>
            <StoreButtons variant="compact" />
          </div>

          <nav aria-label={tFooter("pages")}>
            <h2 className="text-sm font-semibold text-text-primary mb-4">
              {tFooter("pages")}
            </h2>
            <ul className="space-y-2">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={tFooter("legal")}>
            <h2 className="text-sm font-semibold text-text-primary mb-4">
              {tFooter("legal")}
            </h2>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">
              {tFooter("social")}
            </h2>
            <ul className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-background-soft text-text-secondary hover:text-primary hover:border-primary/30 border border-transparent transition-colors min-h-[44px] min-w-[44px]"
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <div>
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                {tFooter("language")}
              </h2>
              <LanguageSwitcher variant="pills" />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-text-secondary">
            {tFooter("copyright", { madeWith: tFooter("madeWith") })}
          </p>
        </div>
      </div>
    </footer>
  );
}
