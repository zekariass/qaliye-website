import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Primitives";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Trash2, Mail, Settings, ShieldAlert, Clock, ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accountDeletion" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/account-deletion`,
      languages: {
        en: "/en/account-deletion",
        am: "/am/account-deletion",
        ti: "/ti/account-deletion",
        om: "/om/account-deletion",
      },
    },
  };
}

export default async function AccountDeletionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Qaliye", url: `/${locale}` },
          { name: "Account Deletion", url: `/${locale}/account-deletion` },
        ]}
      />
      <AccountDeletionContent />
    </>
  );
}

function AccountDeletionContent() {
  const t = useTranslations("accountDeletion");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16">
        <div className="mx-auto w-full max-w-[800px] px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Intro */}
          <div className="rounded-lg bg-surface border border-border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                <ShieldAlert className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">
                  {t("introTitle")}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {t("introBody")}
                </p>
              </div>
            </div>
          </div>

          {/* Option 1: In-app */}
          <div className="rounded-lg bg-surface border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Settings className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary">
                {t("inAppTitle")}
              </h2>
            </div>
            <p className="text-text-secondary leading-relaxed mb-4">
              {t("inAppDescription")}
            </p>
            <div className="rounded-md bg-background-soft border border-border px-4 py-3">
              <p className="text-sm font-medium text-text-primary">
                {t("inAppSteps")}
              </p>
            </div>
          </div>

          {/* Option 2: Email */}
          <div className="rounded-lg bg-surface border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary">
                {t("emailTitle")}
              </h2>
            </div>
            <p className="text-text-secondary leading-relaxed mb-4">
              {t("emailDescription")}
            </p>
            <a
              href="mailto:support@qaliye.com?subject=Account%20Deletion%20Request"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors min-h-[44px]"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {t("emailButton")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* What happens */}
          <div className="rounded-lg bg-surface border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary">
                {t("processTitle")}
              </h2>
            </div>
            <ul className="space-y-3">
              {["step1", "step2", "step3", "step4"].map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <Trash2 className="w-4 h-4 text-primary mt-1 shrink-0" aria-hidden="true" />
                  <span className="text-text-secondary leading-relaxed">
                    {t(`process.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* In-app data management */}
          <div className="rounded-lg bg-surface border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Trash2 className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary">
                {t("dataManagementTitle")}
              </h2>
            </div>
            <p className="text-text-secondary leading-relaxed mb-3">
              {t("dataManagementBody")}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <Trash2 className="w-4 h-4 text-primary mt-1 shrink-0" aria-hidden="true" />
                <span className="text-text-secondary leading-relaxed">
                  {t("dataManagement.photos")}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Trash2 className="w-4 h-4 text-primary mt-1 shrink-0" aria-hidden="true" />
                <span className="text-text-secondary leading-relaxed">
                  {t("dataManagement.messages")}
                </span>
              </li>
            </ul>
          </div>

          {/* Note */}
          <div className="rounded-lg bg-background-soft border border-border p-6">
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("note")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
