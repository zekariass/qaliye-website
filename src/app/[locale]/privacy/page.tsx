import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, ProseSection } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: "/en/privacy",
        am: "/am/privacy",
        ti: "/ti/privacy",
        om: "/om/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
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
          { name: "Privacy Policy", url: `/${locale}/privacy` },
        ]}
      />
      <PrivacyContent />
    </>
  );
}

function PrivacyContent() {
  const t = useTranslations("privacy");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("lastUpdated")} />
      <ProseSection>
        <PrivacyPolicyContent />
      </ProseSection>
    </>
  );
}
