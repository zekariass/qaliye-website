import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, ProseSection } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { TermsOfUseContent } from "@/components/legal/TermsOfUseContent";

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
          { name: "Qal Dating", url: `/${locale}` },
          { name: "Terms of Use", url: `/${locale}/terms` },
        ]}
      />
      <TermsContent />
    </>
  );
}

function TermsContent() {
  const t = useTranslations("terms");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("lastUpdated")} />
      <ProseSection>
        <TermsOfUseContent />
      </ProseSection>
    </>
  );
}
