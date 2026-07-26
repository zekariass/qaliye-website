import { useTranslations } from "next-intl";
import { StoreButtons } from "@/components/ui/StoreButtons";

export function DownloadCTA() {
  const t = useTranslations("downloadCTA");

  return (
    <section
      className="bg-primary-gradient py-16 lg:py-24"
      aria-labelledby="download-cta-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="download-cta-heading"
          className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl tracking-tight"
        >
          {t("title")}
        </h2>
        <p className="mt-4 text-base text-white/90 sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="mt-10 flex justify-center">
          <StoreButtons variant="light" glow />
        </div>
      </div>
    </section>
  );
}
