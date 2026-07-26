import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/Primitives";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { LifeBuoy, ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "help" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/help`,
      languages: {
        en: "/en/help",
        am: "/am/help",
        ti: "/ti/help",
        om: "/om/help",
      },
    },
  };
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "help" });
  const faqKeys = [1, 2, 3, 4, 5, 6, 7, 8];
  const faqData = faqKeys.map((key) => ({
    question: String(t(`faq.${key}.question`)),
    answer: String(t(`faq.${key}.answer`)),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Qaliye", url: `/${locale}` },
          { name: "Help", url: `/${locale}/help` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HelpContent />
    </>
  );
}

function HelpContent() {
  const t = useTranslations("help");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <div className="mx-auto w-full max-w-[800px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary mb-8">
            {t("faqTitle")}
          </h2>
          <FaqAccordion />
          <div className="mt-12 rounded-lg bg-background-soft border border-border p-8 text-center">
            <LifeBuoy
              className="w-12 h-12 text-primary mx-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-text-secondary mb-6">{t("contactSupport")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors min-h-[44px]"
            >
              {t("contactButton")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
