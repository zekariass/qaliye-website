import { useTranslations } from "next-intl";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { Heart, Sparkles, Download, BadgeCheck, ShieldCheck, Star } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="bg-splash relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Decorative gradient blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Qaliye</span>
            </div>
            <h1
              id="hero-heading"
              className="text-4xl font-bold text-text-primary sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]"
            >
              {t("headline")}
            </h1>
            <p className="text-base text-text-secondary sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("subheadline")}
            </p>

            {/* Trust badges row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                <BadgeCheck className="w-4 h-4 text-verified" aria-hidden="true" />
                {t("downloadIOS")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                <ShieldCheck className="w-4 h-4 text-success" aria-hidden="true" />
                {t("downloadAndroid")}
              </span>
            </div>

            {/* Download buttons */}
            <div className="flex justify-center lg:justify-start pt-2">
              <StoreButtons variant="hero" />
            </div>
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary badge-bounce">
                <Download className="w-4 h-4 text-primary" aria-hidden="true" />
                {t("downloadIOS")} · {t("downloadAndroid")}
              </span>
            </div>
          </div>

          {/* Right: Phone mockup with floating accents */}
          <div className="flex justify-center lg:justify-end relative">
            {/* Floating rating badge */}
            <div className="absolute -top-4 left-4 z-20 rounded-xl bg-surface shadow-lg border border-border px-4 py-2 hidden sm:block">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-warning fill-warning" aria-hidden="true" />
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">4.8 · App Store</p>
            </div>

            {/* Floating match badge */}
            <div className="absolute bottom-12 -right-2 z-20 rounded-xl bg-romantic-gradient shadow-lg px-4 py-3 text-white hidden sm:block">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold">It&apos;s a match!</p>
                  <p className="text-xs text-white/80">You both liked each other</p>
                </div>
              </div>
            </div>

            <PhoneMockup label={t("phoneAlt")}>
              <div className="h-full bg-gradient-to-b from-primary/20 to-secondary/20 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pt-6">
                  <div className="w-8 h-8 rounded-full bg-white/50" />
                  <div className="w-16 h-2 rounded-full bg-white/40" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-32 h-44 rounded-2xl bg-white/40 shadow-lg flex items-center justify-center">
                    <Heart className="w-12 h-12 text-secondary" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex justify-center gap-4 pb-4">
                  <div className="w-10 h-10 rounded-full bg-white/50" />
                  <div className="w-10 h-10 rounded-full bg-secondary/50" />
                  <div className="w-10 h-10 rounded-full bg-white/50" />
                </div>
              </div>
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
