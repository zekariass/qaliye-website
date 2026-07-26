import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/Primitives";
import { ScreenshotMockup } from "@/components/ui/PhoneMockup";

export function Screenshots() {
  const t = useTranslations("screenshots");

  const screenshots = [
    { key: "discovery", variant: "default" as const },
    { key: "match", variant: "match" as const },
    { key: "chat", variant: "chat" as const },
    { key: "profile", variant: "profile" as const },
    { key: "premium", variant: "premium" as const },
  ];

  return (
    <section className="bg-background-lavender py-16 lg:py-24" aria-labelledby="screenshots-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible lg:place-items-center">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.key}
              className="snap-center shrink-0 lg:transition-transform lg:hover:scale-105 lg:duration-300"
            >
              <ScreenshotMockup
                label={t(screenshot.key)}
                variant={screenshot.variant}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
