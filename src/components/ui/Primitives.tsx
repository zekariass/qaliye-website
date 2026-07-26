import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

export function SectionHeading({
  title,
  subtitle,
  icon: Icon,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignClass} mb-8 lg:mb-12`}>
      {Icon && (
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 ${align === "center" ? "" : ""}`}
        >
          <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-text-secondary sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  benefit,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  benefit?: string;
}) {
  return (
    <article className="group rounded-lg bg-surface border border-border p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/30">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
        <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-3">{description}</p>
      {benefit && (
        <p className="text-sm font-medium text-primary">
          {benefit}
        </p>
      )}
    </article>
  );
}

export function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-lg bg-surface border border-border p-6 shadow-sm">
      <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold text-lg shadow-md">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mt-2 mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-splash py-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base text-text-secondary sm:text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProseSection({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[800px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="prose prose-lg max-w-none">{children}</div>
    </div>
  );
}
