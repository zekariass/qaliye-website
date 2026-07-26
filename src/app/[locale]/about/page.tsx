import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, ProseSection } from "@/components/ui/Primitives";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ShieldCheck, Heart, Lock, Users } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: "/en/about",
        am: "/am/about",
        ti: "/ti/about",
        om: "/om/about",
      },
    },
  };
}

export default async function AboutPage({
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
          { name: "About", url: `/${locale}/about` },
        ]}
      />
      <AboutContent />
      <DownloadCTA />
    </>
  );
}

function AboutContent() {
  const t = useTranslations("about");

  const values = [
    { icon: ShieldCheck, key: "trust" },
    { icon: Heart, key: "culture" },
    { icon: Lock, key: "privacy" },
    { icon: Users, key: "respect" },
  ] as const;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ProseSection>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">{t("mission.title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("mission.body")}</p>
        </section>
        <section className="space-y-6 mt-12">
          <h2 className="text-2xl font-bold text-text-primary">{t("audience.title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("audience.body")}</p>
        </section>
        <section className="space-y-6 mt-12">
          <h2 className="text-2xl font-bold text-text-primary">{t("value.title")}</h2>
          <p className="text-text-secondary leading-relaxed">{t("value.body")}</p>
        </section>
      </ProseSection>
      <section className="bg-background-soft py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-10">
            {t("values.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.key}
                  className="rounded-lg bg-surface border border-border p-6 shadow-sm text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`values.items.${value.key}.title`)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(`values.items.${value.key}.description`)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
