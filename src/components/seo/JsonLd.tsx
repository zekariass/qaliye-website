import { SITE_URL, STORE_URLS } from "@/lib/constants";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Qaliye",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      "Dating app for Ethiopian and Eritrean singles — meaningful connections rooted in culture, safety, and respect.",
    sameAs: [
      "https://instagram.com/qaliye",
      "https://t.me/qaliye",
      "https://tiktok.com/@qaliye",
      "https://x.com/qaliye",
    ],
  };
  return <JsonLd data={data} />;
}

export function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qaliye",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android",
    url: SITE_URL,
    downloadUrl: [STORE_URLS.ios, STORE_URLS.android],
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    ],
    description:
      "Qaliye is the dating app for Ethiopian and Eritrean singles. Find meaningful connections rooted in shared culture, values, and heritage.",
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return <JsonLd data={data} />;
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
