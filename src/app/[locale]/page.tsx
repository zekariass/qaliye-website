import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { FeatureHighlights } from "@/components/sections/FeatureHighlights";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Screenshots } from "@/components/sections/Screenshots";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const tHero = await getTranslations({ locale, namespace: "hero" });

  return {
    title: `${t("name")} — ${t("tagline")}`,
    description: tHero("subheadline"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        am: "/am",
        ti: "/ti",
        om: "/om",
      },
    },
  };
}

export default async function HomePage({
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
        ]}
      />
      <Hero />
      <TrustBar />
      <FeatureHighlights />
      <HowItWorks />
      <Screenshots />
      <TestimonialsSection />
      <DownloadCTA />
    </>
  );
}
