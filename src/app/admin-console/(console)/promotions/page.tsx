"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDate, formatRelative } from "@/lib/admin/dates";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import type { PromotionalCampaign } from "@/lib/admin/adapters";
import { Plus, Play, Pause, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PAGE_SIZE = 20;

export default function PromotionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/promotions.*$/, "");

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? "";

  const [actionTarget, setActionTarget] = useState<{
    id: string; name: string; action: "activate" | "pause" | "expire";
  } | null>(null);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) { if (v) params.set(k, v); else params.delete(k); }
    params.set("page", "1"); router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.billing.campaigns.list({ page, status }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (page > 1) qs.set("page", String(page));
      qs.set("pageSize", String(PAGE_SIZE));
      if (status) qs.set("status", status);
      const res = await fetch(`/api/internal-admin/billing/campaigns?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    staleTime: 15_000,
  });

  const actionMutation = useMutation({
    mutationFn: async () => {
      if (!actionTarget) return;
      const res = await fetch(`/api/internal-admin/billing/campaigns/${actionTarget.id}/${actionTarget.action}`, { method: "POST" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Action failed"); }
    },
    onSuccess: () => {
      toast.success(`Campaign ${actionTarget?.action}d`);
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.campaigns.list({}) });
      setActionTarget(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const campaigns: PromotionalCampaign[] = Array.isArray(data?.campaigns)
    ? data.campaigns
    : Array.isArray(data?.content)
      ? data.content
      : [];

  const columns: Column<PromotionalCampaign>[] = [
    { key: "name", header: "Name", cell: (c) => (
      <Link href={`${adminConsolePath}/promotions/${c.id}`} className="block group">
        <span className="font-medium text-[#17171B] group-hover:text-[#7C3AED]">{c.name}</span>
        <p className="text-xs font-mono text-[#9CA3AF]">{c.campaignKey}</p>
      </Link>
    )},
    { key: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
    { key: "benefit", header: "Benefit", cell: (c) => <span className="text-sm text-[#666672]">{c.benefitType}</span> },
    { key: "productType", header: "Product", cell: (c) => (
      <span className="text-xs font-medium text-[#7C3AED]">
        {c.consumableProductId ? "Consumable" : c.subscriptionProductId ? "Subscription" : "—"}
      </span>
    )},
    { key: "redemptions", header: "Redemptions", cell: (c) => (
      <span className="text-sm tabular-nums">
        {c.currentRedemptions?.toLocaleString() ?? "—"}
        {c.maxRedemptions ? ` / ${c.maxRedemptions.toLocaleString()}` : ""}
      </span>
    )},
    { key: "dates", header: "Active Period", cell: (c) => (
      <span className="text-xs text-[#666672]">
        {c.startsAt ? formatDate(c.startsAt) : "—"} → {c.endsAt ? formatDate(c.endsAt) : "—"}
      </span>
    )},
    { key: "created", header: "Created", cell: (c) => <span className="text-sm text-[#666672]">{formatRelative(c.createdAt)}</span> },
    { key: "actions", header: "", cell: (c) => (
      <div className="flex gap-1.5">
        <Link href={`${adminConsolePath}/promotions/${c.id}`} className="p-1 text-[#666672] hover:bg-[#F3F0FF] hover:text-[#7C3AED] rounded" title="View details">
          <Eye className="h-3.5 w-3.5" />
        </Link>
        {(c.status === "DRAFT" || c.status === "PAUSED") && (
          <button type="button" onClick={() => setActionTarget({ id: c.id, name: c.name, action: "activate" })} className="p-1 text-[#16815D] hover:bg-[#ECFDF5] rounded" title="Activate"><Play className="h-3.5 w-3.5" /></button>
        )}
        {c.status === "ACTIVE" && (
          <button type="button" onClick={() => setActionTarget({ id: c.id, name: c.name, action: "pause" })} className="p-1 text-[#B7791F] hover:bg-[#FFFBEB] rounded" title="Pause"><Pause className="h-3.5 w-3.5" /></button>
        )}
        {(c.status === "ACTIVE" || c.status === "PAUSED" || c.status === "DRAFT") && (
          <button type="button" onClick={() => setActionTarget({ id: c.id, name: c.name, action: "expire" })} className="p-1 text-[#666672] hover:bg-[#F7F7FA] rounded" title="Expire"><Clock className="h-3.5 w-3.5" /></button>
        )}
      </div>
    ), className: "w-28" },
  ];

  return (
    <div>
      <PageHeader
        title="Promotional Campaigns"
        actions={
          <Link href={`${adminConsolePath}/promotions/new`} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> New Campaign
          </Link>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={status} onChange={(e) => updateParams({ status: e.target.value })} className="px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none cursor-pointer">
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      <AdminDataTable columns={columns} data={campaigns} isLoading={isLoading} isError={isError} onRetry={refetch} keyExtractor={(c) => c.id} emptyTitle="No campaigns" emptyDescription="Create your first promotional campaign." pagination={data?.totalPages > 1 ? { page, totalPages: data.totalPages, onChange: (p) => updateParams({ page: String(p) }) } : undefined} />

      {actionTarget && (
        <ConfirmDialog
          open={true}
          onClose={() => setActionTarget(null)}
          onConfirm={() => actionMutation.mutate()}
          title={`${actionTarget.action.charAt(0).toUpperCase() + actionTarget.action.slice(1)} campaign`}
          description={`${actionTarget.action.charAt(0).toUpperCase() + actionTarget.action.slice(1)} "${actionTarget.name}"?`}
          confirmLabel={actionTarget.action.charAt(0).toUpperCase() + actionTarget.action.slice(1)}
          variant={actionTarget.action === "expire" ? "danger" : "default"}
          isLoading={actionMutation.isPending}
        />
      )}
    </div>
  );
}
