"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import type { Redemption } from "@/lib/admin/adapters";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";

export default function RedemptionsPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/promotions\/. *$/, "");

  const { data, isLoading, isError, refetch } = useQuery<{ redemptions: Redemption[] }>({
    queryKey: adminKeys.billing.campaigns.redemptions(campaignId, {}),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/billing/campaigns/${campaignId}/redemptions`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const redemptions = data?.redemptions ?? [];

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/promotions/${campaignId}`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Campaign
        </Link>
      </div>

      <PageHeader
        title="Redemptions"
        description={`${redemptions.length.toLocaleString()} redemption${redemptions.length !== 1 ? "s" : ""} recorded`}
      />

      {redemptions.length === 0 ? (
        <EmptyState icon={<Users className="h-10 w-10" />} title="No redemptions yet" description="Users who redeem this campaign will appear here." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Reserved At</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Fulfilled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {redemptions.map((r) => (
                <tr key={r.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-[#17171B]">{r.userId}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} size="sm" /></td>
                  <td className="px-4 py-3 text-[#666672]">{r.reservedAt ? formatDateTime(r.reservedAt) : "—"}</td>
                  <td className="px-4 py-3 text-[#666672]">{r.fulfilledAt ? formatDateTime(r.fulfilledAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
