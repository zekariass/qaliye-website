import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, ProseSection } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        en: "/en/terms",
        am: "/am/terms",
        ti: "/ti/terms",
        om: "/om/terms",
      },
    },
  };
}

export default async function TermsPage({
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
          { name: "Terms & Conditions", url: `/${locale}/terms` },
        ]}
      />
      <TermsContent />
    </>
  );
}

function TermsContent() {
  const t = useTranslations("terms");
  const sectionKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("lastUpdated")} />
      <ProseSection>
        <p className="text-text-secondary leading-relaxed mb-8">{t("intro")}</p>
        {sectionKeys.map((key) => (
          <section key={key} className="space-y-3 mb-8">
            <h2 className="text-xl font-bold text-text-primary">
              {key}. {t(`sections.${key}.title`)}
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {t(`sections.${key}.body`)}
            </p>
          </section>
        ))}
      </ProseSection>
    </>
  );
}
