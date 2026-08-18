"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Subscription Plans", slug: "subscription-plans" },
  { label: "Subscription Products", slug: "subscription-products" },
  { label: "Consumable Products", slug: "consumable-products" },
  { label: "Payment Offers", slug: "payment-offers" },
  { label: "Payment Methods", slug: "payment-methods" },
  { label: "Plan Limits & Costs", slug: "plan-limit-costs" },
  { label: "Feature Actions", slug: "feature-actions" },
  { label: "Country Settings", slug: "country-settings" },
];

export default function PaymentConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Extract the path up to and including /payment-config
  const basePath = pathname.replace(/\/payment-config.*$/, "/payment-config");

  return (
    <div className="flex gap-6 min-h-0">
      {/* Left sidebar nav */}
      <aside className="w-48 flex-shrink-0">
        <div className="bg-white border border-[#E5E5EA] rounded-xl p-2 sticky top-0">
          <p className="px-3 py-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Payment Config
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map(({ label, slug }) => {
              const href = `${basePath}/${slug}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={slug}
                  href={href}
                  className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#F3F0FF] text-[#7C3AED] font-medium"
                      : "text-[#666672] hover:text-[#17171B] hover:bg-[#F7F7FA]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
