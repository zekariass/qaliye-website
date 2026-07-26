import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader, SectionHeading, FeatureCard } from "@/components/ui/Primitives";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import {
  Compass,
  UserCircle,
  SlidersHorizontal,
  MapPin,
  MessageCircle,
  Heart,
  BadgeCheck,
  ShieldCheck,
  Ban,
  EyeOff,
  Lock,
  Trash2,
  Eye,
  Filter,
  Infinity,
  Star,
  TrendingUp,
  Undo2,
  Mic,
  Languages,
  Bell,
  Headphones,
  Gift,
  CreditCard,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "features" });
  return {
    title: t("sectionTitle"),
    description: t("sectionSubtitle"),
    alternates: {
      canonical: `/${locale}/features`,
      languages: {
        en: "/en/features",
        am: "/am/features",
        ti: "/ti/features",
        om: "/om/features",
      },
    },
  };
}

export default async function FeaturesPage({
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
          { name: "Features", url: `/${locale}/features` },
        ]}
      />
      <FeaturesContent />
      <DownloadCTA />
    </>
  );
}

function FeaturesContent() {
  const t = useTranslations("features");

  const coreFeatures = [
    { icon: Compass, key: "discovery" },
    { icon: UserCircle, key: "profiles" },
    { icon: SlidersHorizontal, key: "preferences" },
    { icon: MapPin, key: "location" },
    { icon: MessageCircle, key: "chat" },
    { icon: Heart, key: "matches" },
  ] as const;

  const safetyFeatures = [
    { icon: BadgeCheck, key: "verification" },
    { icon: ShieldCheck, key: "photoModeration" },
    { icon: Ban, key: "blockReport" },
    { icon: EyeOff, key: "incognito" },
    { icon: Lock, key: "dataSecurity" },
    { icon: Trash2, key: "accountDeletion" },
  ] as const;

  const premiumFeatures = [
    { icon: Eye, key: "seeWhoLiked" },
    { icon: Filter, key: "advancedFilters" },
    { icon: Infinity, key: "unlimitedLikes" },
    { icon: Star, key: "superLikes" },
    { icon: TrendingUp, key: "boost" },
    { icon: Undo2, key: "rewind" },
    { icon: Mic, key: "chatQuotas" },
  ] as const;

  const additionalFeatures = [
    { icon: Languages, key: "languages" },
    { icon: Bell, key: "notifications" },
    { icon: Headphones, key: "inAppSupport" },
    { icon: Gift, key: "promotions" },
    { icon: CreditCard, key: "localPayments" },
  ] as const;

  return (
    <>
      <PageHeader title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />

      <section className="py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((f) => (
              <FeatureCard
                key={f.key}
                icon={f.icon}
                title={t(`core.${f.key}.title`)}
                description={t(`core.${f.key}.description`)}
                benefit={t(`core.${f.key}.benefit`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-soft py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t("safety.sectionTitle")} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyFeatures.map((f) => (
              <FeatureCard
                key={f.key}
                icon={f.icon}
                title={t(`safety.${f.key}.title`)}
                description={t(`safety.${f.key}.description`)}
                benefit={t(`safety.${f.key}.benefit`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("premium.sectionTitle")}
            subtitle={t("premium.sectionSubtitle")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((f) => (
              <FeatureCard
                key={f.key}
                icon={f.icon}
                title={t(`premium.${f.key}.title`)}
                description={t(`premium.${f.key}.description`)}
                benefit={t(`premium.${f.key}.benefit`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-soft py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t("additional.sectionTitle")} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((f) => (
              <FeatureCard
                key={f.key}
                icon={f.icon}
                title={t(`additional.${f.key}.title`)}
                description={t(`additional.${f.key}.description`)}
                benefit={t(`additional.${f.key}.benefit`)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
