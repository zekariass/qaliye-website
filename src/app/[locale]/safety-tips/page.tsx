import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, ProseSection } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SafetyTipsContent } from "@/components/legal/SafetyTipsContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "safetyTips" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/safety-tips`,
      languages: {
        en: "/en/safety-tips",
        am: "/am/safety-tips",
        ti: "/ti/safety-tips",
        om: "/om/safety-tips",
      },
    },
  };
}

export default async function SafetyTipsPage({
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
          { name: "Dating Safety Tips", url: `/${locale}/safety-tips` },
        ]}
      />
      <SafetyTipsContentSection />
    </>
  );
}

function SafetyTipsContentSection() {
  const t = useTranslations("safetyTips");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("lastUpdated")} />
      <ProseSection>
        <SafetyTipsContent />
      </ProseSection>
    </>
  );
}
