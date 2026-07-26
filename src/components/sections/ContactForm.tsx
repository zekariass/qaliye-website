"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FORMSPREE_ENDPOINT, CONTACT_EMAIL } from "@/lib/constants";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-lg bg-surface border border-border p-6 lg:p-8 shadow-sm">
      {status === "success" ? (
        <div className="text-center py-8">
          <CheckCircle
            className="w-12 h-12 text-success mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-text-primary font-medium">{t("form.success")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">
              {t("form.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder={t("form.namePlaceholder")}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
              {t("form.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder={t("form.emailPlaceholder")}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1.5">
              {t("form.subject")}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder={t("form.subjectPlaceholder")}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1.5">
              {t("form.message")}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder={t("form.messagePlaceholder")}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>
          {status === "error" && (
            <div className="flex items-center gap-2 text-danger text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t("form.error")}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 min-h-[44px]"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {status === "sending" ? t("form.sending") : t("form.submit")}
          </button>
        </form>
      )}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-primary transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
