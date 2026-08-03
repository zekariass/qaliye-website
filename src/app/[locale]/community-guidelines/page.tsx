import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, ProseSection } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CommunityGuidelinesContent } from "@/components/legal/CommunityGuidelinesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "communityGuidelines" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/community-guidelines`,
      languages: {
        en: "/en/community-guidelines",
        am: "/am/community-guidelines",
        ti: "/ti/community-guidelines",
        om: "/om/community-guidelines",
      },
    },
  };
}

export default async function CommunityGuidelinesPage({
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
          { name: "Community Guidelines", url: `/${locale}/community-guidelines` },
        ]}
      />
      <CommunityGuidelinesContentSection />
    </>
  );
}

function CommunityGuidelinesContentSection() {
  const t = useTranslations("communityGuidelines");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("lastUpdated")} />
      <ProseSection>
        <CommunityGuidelinesContent />
      </ProseSection>
    </>
  );
}
