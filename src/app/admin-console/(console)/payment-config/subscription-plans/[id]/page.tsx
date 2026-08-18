"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import type { SubscriptionPlan } from "@/lib/admin/adapters";
import { Pencil, Trash2, ChevronLeft, X } from "lucide-react";
import Link from "next/link";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

const ACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16815D]";
const INACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#C63B4E]";

function formatPrice(minorUnits: number, currency: string) {
  return `${currency} ${(minorUnits / 100).toFixed(2)}`;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`${INPUT} flex items-center justify-center font-medium ${value ? "text-[#16815D]" : "text-[#9CA3AF]"}`}
    >
      {value ? "Active" : "Inactive"}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-sm text-[#666672] shrink-0 w-40">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

interface EditValues {
  name: string;
  features?: string;
  isActive: boolean;
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: SubscriptionPlan; onSubmit: (v: EditValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [name, setName] = useState(item.name);
  const [features, setFeatures] = useState(item.features ?? "");
  const [isActive, setIsActive] = useState(item.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Subscription Plan</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Plan Code (immutable)</label>
              <input value={item.planCode} disabled className={`${INPUT} font-mono bg-[#F7F7FA] text-[#9CA3AF]`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Billing Interval (immutable)</label>
              <input value={item.billingInterval} disabled className={`${INPUT} bg-[#F7F7FA] text-[#9CA3AF]`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Features</label>
            <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={3} className={INPUT} placeholder='e.g. {"likes":50}' />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Active</label>
            <Toggle value={isActive} onChange={setIsActive} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
          <button
            type="button"
            onClick={() => onSubmit({ name: name.trim(), features: features.trim() || undefined, isActive })}
            disabled={!name.trim() || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/subscription-plans\/.*$/, "");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const detailKey = [...adminKeys.paymentConfig.subscriptionPlans(), "detail", id] as const;

  const { data: item, isLoading, isError, refetch } = useQuery<SubscriptionPlan>({
    queryKey: detailKey,
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/subscription-plans/${id}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (body: EditValues) => {
      const res = await fetch(`/api/internal-admin/payment-config/subscription-plans/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => {
      toast.success("Subscription plan updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.subscriptionPlans() });
      queryClient.invalidateQueries({ queryKey: detailKey });
      setEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/subscription-plans/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to deactivate"); }
    },
    onSuccess: () => {
      toast.success("Subscription plan deactivated");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.subscriptionPlans() });
      setDeleting(false);
      router.push(`${adminConsolePath}/payment-config/subscription-plans`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !item) return <ErrorState onRetry={refetch} />;

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/payment-config/subscription-plans`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Subscription Plans
        </Link>
      </div>

      <PageHeader
        title={item.name}
        badge={
          item.isActive
            ? <span className={ACTIVE_BADGE}>Active</span>
            : <span className={INACTIVE_BADGE}>Inactive</span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666672] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl transition-colors">
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button type="button" onClick={() => setDeleting(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl transition-colors">
              <Trash2 className="h-4 w-4" /> Deactivate
            </button>
          </div>
        }
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        <DetailRow label="Name" value={item.name} />
        <DetailRow label="Plan Code" value={<span className="font-mono">{item.planCode}</span>} />
        <DetailRow label="Country Code" value={<span className="font-mono">{item.countryCode}</span>} />
        <DetailRow label="Plan Kind" value={item.planKind} />
        <DetailRow label="Price" value={<span className="tabular-nums">{formatPrice(item.priceMinorUnits, item.currency)}</span>} />
        <DetailRow label="Currency" value={<span className="font-mono">{item.currency}</span>} />
        <DetailRow label="Billing Interval" value={item.billingInterval} />
        <DetailRow label="Features" value={
          item.features
            ? <pre className="font-mono text-xs bg-[#F7F7FA] rounded-lg p-3 text-left overflow-x-auto max-w-md">{item.features}</pre>
            : "—"
        } />
        <DetailRow label="Status" value={
          item.isActive
            ? <span className={ACTIVE_BADGE}>Active</span>
            : <span className={INACTIVE_BADGE}>Inactive</span>
        } />
        <DetailRow label="ID" value={<CopyIdButton id={item.id} />} />
      </div>

      {editing && (
        <EditModal
          item={item}
          onSubmit={(v) => updateMutation.mutate(v)}
          onCancel={() => setEditing(false)}
          isLoading={updateMutation.isPending}
        />
      )}

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Deactivate subscription plan"
        description={`Deactivate "${item.name}"? Existing subscriptions on this plan will not be affected.`}
        confirmLabel="Deactivate"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
