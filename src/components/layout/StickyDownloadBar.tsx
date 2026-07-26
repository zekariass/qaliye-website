"use client";

import { useState, useEffect } from "react";
import { STORE_URLS } from "@/lib/constants";
import { Apple, Play, X } from "lucide-react";

export function StickyDownloadBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(138,44,255,0.1)] p-3 lg:p-4">
      <div className="mx-auto w-full max-w-[1200px] flex items-center gap-3">
        <button
          onClick={() => setDismissed(true)}
          aria-label="Close"
          className="p-1.5 text-text-secondary shrink-0 rounded-lg hover:bg-background-soft"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 flex gap-2 sm:gap-3 max-w-md mx-auto">
          <a
            href={STORE_URLS.ios}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-gradient text-white text-sm font-semibold py-3 min-h-[44px] shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <Apple className="w-5 h-5" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[9px] font-normal opacity-80">Download on the</span>
              <span>App Store</span>
            </span>
          </a>
          <a
            href={STORE_URLS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-gradient text-white text-sm font-semibold py-3 min-h-[44px] shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[9px] font-normal opacity-80">Get it on</span>
              <span>Google Play</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
