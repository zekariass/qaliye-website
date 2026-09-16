import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, ProseSection } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ChildSafetyContent } from "@/components/legal/ChildSafetyContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "childSafety" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/child-safety`,
      languages: {
        en: "/en/child-safety",
        am: "/am/child-safety",
        ti: "/ti/child-safety",
        om: "/om/child-safety",
      },
    },
  };
}

export default async function ChildSafetyPage({
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
          { name: "Qal Dating", url: `/${locale}` },
          { name: "Child Safety Standards", url: `/${locale}/child-safety` },
        ]}
      />
      <ChildSafetyContentSection />
    </>
  );
}

function ChildSafetyContentSection() {
  const t = useTranslations("childSafety");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("lastUpdated")} />
      <ProseSection>
        <ChildSafetyContent />
      </ProseSection>
    </>
  );
}
