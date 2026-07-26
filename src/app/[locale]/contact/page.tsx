import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Primitives";
import { ContactForm } from "@/components/sections/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SOCIAL_LINKS, CONTACT_EMAIL } from "@/lib/constants";
import { Camera, Send, Music2, AtSign, Mail, Headphones } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: "/en/contact",
        am: "/am/contact",
        ti: "/ti/contact",
        om: "/om/contact",
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Qaliye", url: `/${locale}` },
          { name: "Contact", url: `/${locale}/contact` },
        ]}
      />
      <ContactContent />
    </>
  );
}

function ContactContent() {
  const t = useTranslations("contact");

  const socialLinks = [
    { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: Camera },
    { href: SOCIAL_LINKS.telegram, label: "Telegram", icon: Send },
    { href: SOCIAL_LINKS.tiktok, label: "TikTok", icon: Music2 },
    { href: SOCIAL_LINKS.twitter, label: "X/Twitter", icon: AtSign },
  ] as const;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ContactForm />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  {t("emailLabel")}
                </h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  {t("socialLabel")}
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
                          className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-background-soft text-text-secondary hover:text-primary hover:border-primary/30 border border-transparent transition-colors min-h-[44px] min-w-[44px]"
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="rounded-lg bg-background-soft border border-border p-6">
                <Headphones
                  className="w-8 h-8 text-primary mb-3"
                  aria-hidden="true"
                />
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t("inAppSupport")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
