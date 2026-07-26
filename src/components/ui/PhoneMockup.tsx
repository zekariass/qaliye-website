import { type ReactNode } from "react";

export function PhoneMockup({
  children,
  label,
}: {
  children?: ReactNode;
  label?: string;
}) {
  return (
    <div
      className="relative mx-auto"
      role="img"
      aria-label={label}
    >
      <div className="relative w-[280px] h-[560px] rounded-[2.5rem] border-8 border-gray-900 bg-gray-900 shadow-xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10" />
        <div className="w-full h-full bg-gradient-to-b from-background-soft to-background-lavender rounded-[2rem] overflow-hidden">
          {children ?? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary-gradient mx-auto flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">Q</span>
                </div>
                <p className="text-sm text-text-secondary">Qaliye</p>
                <div className="space-y-2">
                  <div className="h-3 bg-primary/20 rounded-full w-32 mx-auto" />
                  <div className="h-3 bg-primary/10 rounded-full w-24 mx-auto" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ScreenshotMockup({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "match" | "chat" | "profile" | "premium";
}) {
  const colors: Record<string, string> = {
    default: "from-primary/20 to-primary-light/20",
    match: "from-secondary/30 to-primary/30",
    chat: "from-primary-light/20 to-background-lavender",
    profile: "from-background-soft to-primary/10",
    premium: "from-primary to-primary-dark",
  };

  return (
    <PhoneMockup label={label}>
      <div className={`h-full bg-gradient-to-b ${colors[variant]} p-4 flex flex-col gap-3`}>
        <div className="flex items-center justify-between pt-6">
          <div className="w-8 h-8 rounded-full bg-white/40" />
          <div className="w-16 h-2 rounded-full bg-white/30" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-text-secondary text-center px-4">{label}</span>
        </div>
        <div className="flex justify-center gap-4 pb-4">
          <div className="w-10 h-10 rounded-full bg-white/40" />
          <div className="w-10 h-10 rounded-full bg-secondary/40" />
          <div className="w-10 h-10 rounded-full bg-white/40" />
        </div>
      </div>
    </PhoneMockup>
  );
}
