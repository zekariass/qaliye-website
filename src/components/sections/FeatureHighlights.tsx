import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/Primitives";
import {
  Compass,
  UserCircle,
  SlidersHorizontal,
  MapPin,
  MessageCircle,
  Heart,
  ArrowRight,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export function FeatureHighlights() {
  const t = useTranslations("features");

  const features = [
    { icon: Compass, key: "discovery" },
    { icon: UserCircle, key: "profiles" },
    { icon: SlidersHorizontal, key: "preferences" },
    { icon: MapPin, key: "location" },
    { icon: MessageCircle, key: "chat" },
    { icon: Heart, key: "matches" },
  ] as const;

  return (
    <section className="py-16 lg:py-24" aria-labelledby="features-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        {/* Bento grid: 2 large cards + 4 compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First two: large feature cards */}
          {features.slice(0, 2).map((feature) => (
            <LargeFeatureCard
              key={feature.key}
              icon={feature.icon}
              title={t(`core.${feature.key}.title`)}
              description={t(`core.${feature.key}.description`)}
              benefit={t(`core.${feature.key}.benefit`)}
            />
          ))}

          {/* Remaining four: compact cards in a 2x2 sub-grid */}
          {features.slice(2).map((feature) => (
            <CompactFeatureCard
              key={feature.key}
              icon={feature.icon}
              title={t(`core.${feature.key}.title`)}
              benefit={t(`core.${feature.key}.benefit`)}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors min-h-[44px] shadow-md hover:shadow-lg"
          >
            {t("viewAllFeatures")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LargeFeatureCard({
  icon: Icon,
  title,
  description,
  benefit,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
}) {
  return (
    <article className="group rounded-2xl bg-surface border border-border p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/30 md:col-span-1 lg:col-span-1 lg:row-span-2 flex flex-col">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-gradient mb-5 shadow-md">
        <Icon className="w-7 h-7 text-white" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{description}</p>
      <div className="rounded-xl bg-primary/5 px-4 py-3">
        <p className="text-sm font-medium text-primary">{benefit}</p>
      </div>
    </article>
  );
}

function CompactFeatureCard({
  icon: Icon,
  title,
  benefit,
}: {
  icon: LucideIcon;
  title: string;
  benefit: string;
}) {
  return (
    <article className="group rounded-xl bg-surface border border-border p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 flex items-start gap-4">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{benefit}</p>
      </div>
    </article>
  );
}
