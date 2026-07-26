import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  description?: string;
  href?: string;
  alert?: boolean;
}

export function MetricCard({
  title,
  value,
  icon,
  iconBgClass,
  iconColorClass,
  description,
  href,
  alert = false,
}: MetricCardProps) {
  const content = (
    <div
      className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-shadow ${
        alert ? "border-[#FECDD3] shadow-sm" : "border-[#E5E5EA] hover:shadow-sm"
      }`}
    >
      <div
        className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClass}`}
      >
        <span className={iconColorClass}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#666672] truncate">{title}</p>
        <p
          className={`mt-0.5 text-2xl font-bold tabular-nums ${
            alert ? "text-[#C63B4E]" : "text-[#17171B]"
          }`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-[#9CA3AF] truncate">{description}</p>
        )}
      </div>
      {href && (
        <ArrowRight className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-1" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
