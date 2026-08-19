"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import type { PromotionalCampaign } from "@/lib/admin/adapters";
import { ChevronLeft, Play, Pause, Clock, Users, Pencil, X } from "lucide-react";
import Link from "next/link";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-sm text-[#666672] w-40 shrink-0">{label}</span>
      <span className="text-sm text-[#17171B] text-right">{value ?? "—"}</span>
    </div>
  );
}

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

export default function PromotionDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/promotions\/.*$/, "");
  const queryClient = useQueryClient();

  const [action, setAction] = useState<"activate" | "pause" | "expire" | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    maxRedemptions: "",
    maxRedemptionsPerUser: "",
    priority: "",
    endsAt: "",
    targetGender: "",
  });

  const { data: campaign, isLoading, isError, refetch } = useQuery<PromotionalCampaign>({
    queryKey: adminKeys.billing.campaigns.detail(campaignId),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/billing/campaigns/${campaignId}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const actionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/billing/campaigns/${campaignId}/${action}`, { method: "POST" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Action failed"); }
    },
    onSuccess: () => {
      toast.success(`Campaign ${action}d`);
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.campaigns.detail(campaignId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.campaigns.list({}) });
      setAction(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const editMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      if (editForm.name) payload.name = editForm.name;
      if (editForm.description) payload.description = editForm.description;
      if (editForm.maxRedemptions) payload.maxRedemptions = Number(editForm.maxRedemptions);
      if (editForm.maxRedemptionsPerUser) payload.maxRedemptionsPerUser = Number(editForm.maxRedemptionsPerUser);
      if (editForm.priority) payload.priority = Number(editForm.priority);
      if (editForm.endsAt) payload.endsAt = new Date(editForm.endsAt).toISOString();
      payload.targetGender = editForm.targetGender || null;
      const res = await fetch(`/api/internal-admin/billing/campaigns/${campaignId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Edit failed"); }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Campaign updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.campaigns.detail(campaignId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.campaigns.list({}) });
      setEditOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openEdit() {
    if (!campaign) return;
    setEditForm({
      name: campaign.name,
      description: campaign.description ?? "",
      maxRedemptions: campaign.maxRedemptions?.toString() ?? "",
      maxRedemptionsPerUser: campaign.maxRedemptionsPerUser?.toString() ?? "",
      priority: campaign.priority?.toString() ?? "",
      endsAt: campaign.endsAt ? new Date(campaign.endsAt).toISOString().slice(0, 16) : "",
      targetGender: campaign.targetGender ?? "",
    });
    setEditOpen(true);
  }

  if (isLoading) return <PageSkeleton rows={6} />;
  if (isError || !campaign) return <ErrorState onRetry={refetch} />;

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/promotions`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Promotions
        </Link>
      </div>

      <PageHeader
        title={campaign.name}
        badge={<StatusBadge status={campaign.status} />}
        actions={
          <div className="flex gap-2">
            <Link href={`${adminConsolePath}/promotions/${campaignId}/redemptions`} className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666672] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl">
              <Users className="h-4 w-4" /> Redemptions
            </Link>
            <button type="button" onClick={openEdit} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#7C3AED] border border-[#E5E5EA] bg-white hover:bg-[#F3F0FF] rounded-xl">
              <Pencil className="h-4 w-4" /> Edit
            </button>
            {(campaign.status === "DRAFT" || campaign.status === "PAUSED") && (
              <button type="button" onClick={() => setAction("activate")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#16815D] hover:bg-[#15694E] rounded-xl">
                <Play className="h-4 w-4" /> Activate
              </button>
            )}
            {campaign.status === "ACTIVE" && (
              <button type="button" onClick={() => setAction("pause")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#B7791F] border border-[#FDE68A] bg-[#FFFBEB] hover:bg-[#FEF3C7] rounded-xl">
                <Pause className="h-4 w-4" /> Pause
              </button>
            )}
            {(campaign.status === "ACTIVE" || campaign.status === "PAUSED" || campaign.status === "DRAFT") && (
              <button type="button" onClick={() => setAction("expire")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl">
                <Clock className="h-4 w-4" /> Expire
              </button>
            )}
          </div>
        }
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        <Row label="Campaign Key" value={<span className="font-mono text-xs">{campaign.campaignKey}</span>} />
        {campaign.description && <Row label="Description" value={campaign.description} />}
        <Row label="Status" value={<StatusBadge status={campaign.status} />} />
        <Row label="Trigger Type" value={campaign.triggerType} />
        <Row label="Eligibility" value={campaign.eligibilityType} />
        <Row label="Benefit Type" value={campaign.benefitType} />
        {campaign.subscriptionProductId && <Row label="Target Product Type" value={<span className="text-[#7C3AED] font-medium">Subscription</span>} />}
        {campaign.consumableProductId && <Row label="Target Product Type" value={<span className="text-[#7C3AED] font-medium">Consumable</span>} />}
        {campaign.discountType && <Row label="Discount Type" value={campaign.discountType} />}
        {campaign.discountValue !== undefined && <Row label="Discount Value" value={campaign.discountValue} />}
        {campaign.discountCurrency && <Row label="Currency" value={campaign.discountCurrency} />}
        {campaign.subscriptionProductId && <Row label="Subscription Product" value={<span className="font-mono text-xs">{campaign.subscriptionProductId}</span>} />}
        {campaign.consumableProductId && <Row label="Consumable Product" value={<span className="font-mono text-xs">{campaign.consumableProductId}</span>} />}
        {campaign.countryCode && <Row label="Country" value={campaign.countryCode} />}
        {campaign.durationDays !== undefined && <Row label="Duration (days)" value={campaign.durationDays} />}
        {campaign.newUserWindowDays !== undefined && <Row label="New User Window" value={`${campaign.newUserWindowDays} days`} />}
        <Row label="Redemptions" value={
          <span>{campaign.currentRedemptions?.toLocaleString() ?? "0"}{campaign.maxRedemptions ? ` / ${campaign.maxRedemptions.toLocaleString()}` : " / unlimited"}</span>
        } />
        {campaign.maxRedemptionsPerUser !== undefined && <Row label="Max Per User" value={campaign.maxRedemptionsPerUser} />}
        {campaign.priority !== undefined && <Row label="Priority" value={campaign.priority} />}
        {campaign.targetGender && <Row label="Target Gender" value={campaign.targetGender} />}
        <Row label="Starts At" value={campaign.startsAt ? formatDateTime(campaign.startsAt) : "—"} />
        <Row label="Ends At" value={campaign.endsAt ? formatDateTime(campaign.endsAt) : "—"} />
        <Row label="Reserved" value={campaign.reservedCount ?? 0} />
        <Row label="Fulfilled" value={campaign.fulfilledCount ?? 0} />
        <Row label="Created" value={formatDateTime(campaign.createdAt)} />
        {campaign.updatedAt && <Row label="Updated" value={formatDateTime(campaign.updatedAt)} />}
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#17171B]">Edit Campaign</h2>
              <button type="button" onClick={() => setEditOpen(false)} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#17171B] mb-1.5">Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#17171B] mb-1.5">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className={`${INPUT} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#17171B] mb-1.5">Max Redemptions</label>
                  <input value={editForm.maxRedemptions} onChange={(e) => setEditForm({ ...editForm, maxRedemptions: e.target.value })} type="number" min="1" className={INPUT} placeholder="Unlimited" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17171B] mb-1.5">Max Per User</label>
                  <input value={editForm.maxRedemptionsPerUser} onChange={(e) => setEditForm({ ...editForm, maxRedemptionsPerUser: e.target.value })} type="number" min="1" className={INPUT} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#17171B] mb-1.5">Priority</label>
                  <input value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} type="number" min="0" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17171B] mb-1.5">Target Gender</label>
                  <select value={editForm.targetGender} onChange={(e) => setEditForm({ ...editForm, targetGender: e.target.value })} className={INPUT}>
                    <option value="">All genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#17171B] mb-1.5">Ends At</label>
                <input value={editForm.endsAt} onChange={(e) => setEditForm({ ...editForm, endsAt: e.target.value })} type="datetime-local" className={INPUT} />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
              <button type="button" onClick={() => editMutation.mutate()} disabled={editMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50">
                {editMutation.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {action && (
        <ConfirmDialog
          open={true}
          onClose={() => setAction(null)}
          onConfirm={() => actionMutation.mutate()}
          title={`${action.charAt(0).toUpperCase() + action.slice(1)} campaign`}
          description={action === "expire"
            ? `Permanently expire "${campaign.name}"? No more redemptions will be accepted.`
            : `${action.charAt(0).toUpperCase() + action.slice(1)} "${campaign.name}"?`}
          confirmLabel={action.charAt(0).toUpperCase() + action.slice(1)}
          variant={action === "expire" ? "danger" : "default"}
          isLoading={actionMutation.isPending}
        />
      )}
    </div>
  );
}
