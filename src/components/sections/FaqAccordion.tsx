"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function FaqAccordion() {
  const t = useTranslations("help");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqKeys = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-4">
      {faqKeys.map((key, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={key}
            className="rounded-lg bg-surface border border-border overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left min-h-[44px] hover:bg-background-soft transition-colors"
            >
              <span className="text-base font-semibold text-text-primary">
                {t(`faq.${key}.question`)}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-text-secondary shrink-0 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`faq.${key}.answer`)}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
