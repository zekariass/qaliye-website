import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/Primitives";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { UserPlus, Search, MessageCircle, Heart } from "lucide-react";
import { type LucideIcon } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    { icon: UserPlus, key: "1" },
    { icon: Search, key: "2" },
    { icon: MessageCircle, key: "3" },
    { icon: Heart, key: "4" },
  ] as const;

  return (
    <section
      className="bg-background-soft py-16 lg:py-24"
      aria-labelledby="howitworks-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        {/* Timeline layout */}
        <div className="relative pt-8">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-secondary/20" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.key}
                number={parseInt(step.key)}
                icon={step.icon}
                title={t(`steps.${step.key}.title`)}
                description={t(`steps.${step.key}.description`)}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <StoreButtons variant="gradient" />
        </div>
      </div>
    </section>
  );
}

function TimelineStep({
  number,
  icon: Icon,
  title,
  description,
  isLast,
}: {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <div className="relative">
      {/* Number + icon circle */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-surface border-2 border-primary/20 shadow-md flex items-center justify-center">
            <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold text-sm shadow-md">
            {number}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mt-5 mb-2">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">{description}</p>
      </div>

      {/* Arrow connector for mobile vertical */}
      {!isLast && (
        <div className="hidden sm:block lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-6 bg-border" aria-hidden="true" />
      )}
    </div>
  );
}
