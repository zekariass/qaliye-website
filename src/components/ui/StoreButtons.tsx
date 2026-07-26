import { STORE_URLS } from "@/lib/constants";
import { Apple, Play } from "lucide-react";
import { useTranslations } from "next-intl";

type Variant = "light" | "dark" | "compact" | "gradient" | "hero";

export function StoreButtons({
  variant = "dark",
  className = "",
  glow = false,
}: {
  variant?: Variant;
  className?: string;
  glow?: boolean;
}) {
  const t = useTranslations("hero");

  const baseClasses =
    "inline-flex items-center gap-2.5 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[52px] px-6 py-3.5";

  const variantClasses: Record<Variant, string> = {
    dark: "bg-black text-white shadow-md hover:shadow-lg",
    light:
      "bg-white text-black border-2 border-primary/20 shadow-md hover:border-primary/40 hover:shadow-lg",
    compact: "bg-black text-white text-sm px-4 py-2 rounded-xl min-h-[44px]",
    gradient:
      "bg-primary-gradient text-white shadow-lg hover:shadow-xl download-glow",
    hero: "bg-primary-gradient text-white shadow-xl download-glow text-base px-7 py-4 min-h-[56px] rounded-2xl",
  };

  const glowClass =
    glow && variant !== "gradient" && variant !== "hero" ? "download-glow" : "";

  const iconSize =
    variant === "hero" ? "h-6 w-6" : variant === "compact" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={STORE_URLS.ios}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses[variant]} ${glowClass}`}
        aria-label={t("downloadIOS")}
      >
        <Apple className={iconSize} aria-hidden="true" />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] font-normal opacity-80">
            {variant === "compact" ? "iOS" : "Download on the"}
          </span>
          <span className={variant === "hero" ? "text-base" : "text-sm"}>
            App Store
          </span>
        </span>
      </a>
      <a
        href={STORE_URLS.android}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses[variant]} ${glowClass}`}
        aria-label={t("downloadAndroid")}
      >
        <Play className={iconSize} aria-hidden="true" />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] font-normal opacity-80">
            {variant === "compact" ? "Android" : "Get it on"}
          </span>
          <span className={variant === "hero" ? "text-base" : "text-sm"}>
            Google Play
          </span>
        </span>
      </a>
    </div>
  );
}
