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
import type { PaymentOffer } from "@/lib/admin/adapters";
import { Pencil, Trash2, ChevronLeft, X } from "lucide-react";
import Link from "next/link";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const SELECT = `${INPUT} bg-white`;

const ACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16815D]";
const INACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#C63B4E]";
const YES_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16815D]";
const NO_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F7F7FA] text-[#666672]";

function Toggle({ value, onChange, labelTrue = "Yes", labelFalse = "No" }: { value: boolean; onChange: (v: boolean) => void; labelTrue?: string; labelFalse?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`${INPUT} flex items-center justify-center font-medium ${value ? "text-[#16815D]" : "text-[#9CA3AF]"}`}
    >
      {value ? labelTrue : labelFalse}
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

interface FormValues {
  subscriptionProductId?: string;
  consumableProductId?: string;
  countryCode: string;
  platform: string;
  currency: string;
  priceMinorUnits: number;
  externalProductId?: string;
  revenuecatOfferingId?: string;
  revenuecatPackageId?: string;
  autoRenew: boolean;
  isActive: boolean;
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: PaymentOffer; onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [subscriptionProductId, setSubscriptionProductId] = useState(item.subscriptionProductId ?? "");
  const [consumableProductId, setConsumableProductId] = useState(item.consumableProductId ?? "");
  const [countryCode, setCountryCode] = useState(item.countryCode);
  const [platform, setPlatform] = useState(item.platform);
  const [currency, setCurrency] = useState(item.currency);
  const [priceMinorUnits, setPriceMinorUnits] = useState(String(item.priceMinorUnits));
  const [externalProductId, setExternalProductId] = useState(item.externalProductId ?? "");
  const [revenuecatOfferingId, setRevenuecatOfferingId] = useState(item.revenuecatOfferingId ?? "");
  const [revenuecatPackageId, setRevenuecatPackageId] = useState(item.revenuecatPackageId ?? "");
  const [autoRenew, setAutoRenew] = useState(item.autoRenew);
  const [isActive, setIsActive] = useState(item.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Payment Offer</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Subscription Product ID</label>
              <input value={subscriptionProductId} onChange={(e) => setSubscriptionProductId(e.target.value)} className={`${INPUT} font-mono`} placeholder="UUID" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Consumable Product ID</label>
              <input value={consumableProductId} onChange={(e) => setConsumableProductId(e.target.value)} className={`${INPUT} font-mono`} placeholder="UUID" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Country Code</label>
              <input value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase().slice(0, 2))} className={`${INPUT} font-mono`} maxLength={2} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={SELECT}>
                <option value="MOBILE">MOBILE</option>
                <option value="WEB">WEB</option>
                <option value="ALL">ALL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Currency</label>
              <input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className={`${INPUT} font-mono`} maxLength={3} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Price (minor units)</label>
            <input value={priceMinorUnits} onChange={(e) => setPriceMinorUnits(e.target.value)} type="number" min="0" className={INPUT} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">External Product ID</label>
              <input value={externalProductId} onChange={(e) => setExternalProductId(e.target.value)} className={`${INPUT} font-mono`} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">RevenueCat Offering ID</label>
              <input value={revenuecatOfferingId} onChange={(e) => setRevenuecatOfferingId(e.target.value)} className={`${INPUT} font-mono`} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">RevenueCat Package ID</label>
              <input value={revenuecatPackageId} onChange={(e) => setRevenuecatPackageId(e.target.value)} className={`${INPUT} font-mono`} placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Auto-Renew</label>
              <Toggle value={autoRenew} onChange={setAutoRenew} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Active</label>
              <Toggle value={isActive} onChange={setIsActive} labelTrue="Active" labelFalse="Inactive" />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
          <button
            type="button"
            onClick={() => onSubmit({ subscriptionProductId: subscriptionProductId.trim() || undefined, consumableProductId: consumableProductId.trim() || undefined, countryCode: countryCode.trim().toUpperCase(), platform, currency: currency.trim().toUpperCase(), priceMinorUnits: Number(priceMinorUnits), externalProductId: externalProductId.trim() || undefined, revenuecatOfferingId: revenuecatOfferingId.trim() || undefined, revenuecatPackageId: revenuecatPackageId.trim() || undefined, autoRenew, isActive })}
            disabled={!countryCode.trim() || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentOfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/payment-offers\/.*$/, "");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const detailKey = [...adminKeys.paymentConfig.paymentOffers(), "detail", id] as const;

  const { data: item, isLoading, isError, refetch } = useQuery<PaymentOffer>({
    queryKey: detailKey,
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-offers/${id}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-offers/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => {
      toast.success("Payment offer updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentOffers() });
      queryClient.invalidateQueries({ queryKey: detailKey });
      setEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-offers/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to deactivate"); }
    },
    onSuccess: () => {
      toast.success("Payment offer deactivated");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentOffers() });
      setDeleting(false);
      router.push(`${adminConsolePath}/payment-config/payment-offers`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !item) return <ErrorState onRetry={refetch} />;

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/payment-config/payment-offers`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Payment Offers
        </Link>
      </div>

      <PageHeader
        title={`${item.countryCode} / ${item.platform}`}
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
        <DetailRow label="Subscription Product ID" value={item.subscriptionProductId ? <CopyIdButton id={item.subscriptionProductId} /> : "—"} />
        <DetailRow label="Consumable Product ID" value={item.consumableProductId ? <CopyIdButton id={item.consumableProductId} /> : "—"} />
        <DetailRow label="Country Code" value={<span className="font-mono">{item.countryCode}</span>} />
        <DetailRow label="Platform" value={item.platform} />
        <DetailRow label="Currency" value={<span className="font-mono">{item.currency}</span>} />
        <DetailRow label="Price" value={<span className="tabular-nums">{item.currency} {(item.priceMinorUnits / 100).toFixed(2)}</span>} />
        <DetailRow label="External Product ID" value={item.externalProductId ? <span className="font-mono">{item.externalProductId}</span> : "—"} />
        <DetailRow label="RevenueCat Offering ID" value={item.revenuecatOfferingId ? <span className="font-mono">{item.revenuecatOfferingId}</span> : "—"} />
        <DetailRow label="RevenueCat Package ID" value={item.revenuecatPackageId ? <span className="font-mono">{item.revenuecatPackageId}</span> : "—"} />
        <DetailRow label="Auto-Renew" value={
          item.autoRenew
            ? <span className={YES_BADGE}>Yes</span>
            : <span className={NO_BADGE}>No</span>
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
        title="Deactivate payment offer"
        description={`Deactivate this offer for ${item.countryCode} / ${item.platform}? Users will no longer see it.`}
        confirmLabel="Deactivate"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
