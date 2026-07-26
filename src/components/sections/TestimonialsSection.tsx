import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/Primitives";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const items = [
    { key: "1" as const },
    { key: "2" as const },
    { key: "3" as const },
  ];

  return (
    <section className="py-16 lg:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <article
              key={item.key}
              className="rounded-2xl bg-surface border border-border p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20 flex flex-col"
            >
              <Quote
                className="w-8 h-8 text-primary/20 mb-4 shrink-0"
                aria-hidden="true"
              />
              <p className="text-base text-text-primary leading-relaxed flex-1 italic">
                &ldquo;{t(`items.${item.key}.quote`)}&rdquo;
              </p>
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold shrink-0">
                  {t(`items.${item.key}.name`).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t(`items.${item.key}.name`)}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {t(`items.${item.key}.location`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
