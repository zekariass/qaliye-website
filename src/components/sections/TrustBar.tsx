import { useTranslations } from "next-intl";
import { BadgeCheck, ShieldCheck, Languages, Heart } from "lucide-react";

export function TrustBar() {
  const t = useTranslations("trustBar");
  const tStats = useTranslations("stats");

  const items = [
    { icon: BadgeCheck, label: t("verifiedProfiles") },
    { icon: ShieldCheck, label: t("privacyFirst") },
    { icon: Languages, label: t("fourLanguages") },
    { icon: Heart, label: t("culturallyAligned") },
  ] as const;

  const stats = [
    { value: "10K+", label: tStats("profiles") },
    { value: "4", label: tStats("languages") },
    { value: "30+", label: tStats("countries") },
    { value: "100%", label: tStats("safety") },
  ] as const;

  return (
    <section className="bg-surface border-y border-border" aria-label="Trust indicators">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        {/* Trust badges */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.label}
                className="flex items-center gap-3 justify-center text-center sm:justify-start"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <Icon className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-text-primary">{item.label}</span>
              </li>
            );
          })}
        </ul>

        {/* Stats band */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold gradient-text sm:text-4xl">{stat.value}</p>
              <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
