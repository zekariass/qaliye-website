import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AttentionCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  description: string;
  href: string;
  variant?: "warning" | "danger" | "info";
}

const VARIANT_STYLES = {
  warning: {
    bg: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
    icon: "bg-[#FEF3C7] text-[#B7791F]",
    badge: "bg-[#FDE68A] text-[#B7791F]",
    title: "text-[#B7791F]",
  },
  danger: {
    bg: "bg-[#FFF1F2]",
    border: "border-[#FECDD3]",
    icon: "bg-[#FFF1F2] text-[#C63B4E]",
    badge: "bg-[#FECDD3] text-[#C63B4E]",
    title: "text-[#C63B4E]",
  },
  info: {
    bg: "bg-[#EFF6FF]",
    border: "border-[#BFDBFE]",
    icon: "bg-[#DBEAFE] text-[#2563EB]",
    badge: "bg-[#BFDBFE] text-[#2563EB]",
    title: "text-[#2563EB]",
  },
};

export function AttentionCard({
  title,
  count,
  icon,
  description,
  href,
  variant = "warning",
}: AttentionCardProps) {
  const s = VARIANT_STYLES[variant];

  return (
    <Link
      href={href}
      className={`block rounded-xl border p-4 ${s.bg} ${s.border} hover:shadow-sm transition-shadow focus-visible:ring-2 focus-visible:ring-[#7C3AED]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-lg ${s.icon}`}>
            {icon}
          </div>
          <div>
            <p className={`text-sm font-semibold ${s.title}`}>{title}</p>
            <p className="mt-0.5 text-xs text-[#666672]">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-full ${s.badge}`}>
            {count.toLocaleString()}
          </span>
          <ArrowRight className="h-4 w-4 text-[#9CA3AF]" />
        </div>
      </div>
    </Link>
  );
}
