"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { PaymentOffer } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, Tag, X, Eye } from "lucide-react";
import Link from "next/link";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const SELECT = `${INPUT} bg-white`;

const ACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16815D]";
const INACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#C63B4E]";

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

function truncateId(id?: string) {
  if (!id) return "—";
  return id.slice(0, 8) + "…";
}

interface FormValues {
  subscriptionProductId?: string;
  consumableProductId?: string;
  countryCode: string;
  platform: string;
  currency: string;
  priceMinorUnits: number;
  autoRenew: boolean;
  isActive: boolean;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [subscriptionProductId, setSubscriptionProductId] = useState("");
  const [consumableProductId, setConsumableProductId] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [platform, setPlatform] = useState("MOBILE");
  const [currency, setCurrency] = useState("ETB");
  const [priceMinorUnits, setPriceMinorUnits] = useState("0");
  const [autoRenew, setAutoRenew] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const valid = countryCode.trim().length === 2;

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Payment Offer</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Subscription Product ID</label>
          <input value={subscriptionProductId} onChange={(e) => setSubscriptionProductId(e.target.value)} className={`${INPUT} font-mono`} placeholder="UUID (optional)" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Consumable Product ID</label>
          <input value={consumableProductId} onChange={(e) => setConsumableProductId(e.target.value)} className={`${INPUT} font-mono`} placeholder="UUID (optional)" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Country Code *</label>
          <input value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase().slice(0, 2))} className={`${INPUT} font-mono`} placeholder="ET" maxLength={2} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={SELECT}>
            <option value="MOBILE">MOBILE</option>
            <option value="WEB">WEB</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Currency</label>
          <input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className={`${INPUT} font-mono`} placeholder="ETB" maxLength={3} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Price (minor units)</label>
          <input value={priceMinorUnits} onChange={(e) => setPriceMinorUnits(e.target.value)} type="number" min="0" className={INPUT} placeholder="e.g. 49900" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Auto-Renew</label>
          <Toggle value={autoRenew} onChange={setAutoRenew} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Active</label>
          <Toggle value={isActive} onChange={setIsActive} labelTrue="Active" labelFalse="Inactive" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button
          type="button"
          onClick={() => onSubmit({
            subscriptionProductId: subscriptionProductId.trim() || undefined,
            consumableProductId: consumableProductId.trim() || undefined,
            countryCode: countryCode.trim().toUpperCase(),
            platform,
            currency: currency.trim().toUpperCase(),
            priceMinorUnits: Number(priceMinorUnits),
            autoRenew,
            isActive,
          })}
          disabled={!valid || isLoading}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: PaymentOffer; onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [subscriptionProductId, setSubscriptionProductId] = useState(item.subscriptionProductId ?? "");
  const [consumableProductId, setConsumableProductId] = useState(item.consumableProductId ?? "");
  const [countryCode, setCountryCode] = useState(item.countryCode);
  const [platform, setPlatform] = useState(item.platform);
  const [currency, setCurrency] = useState(item.currency);
  const [priceMinorUnits, setPriceMinorUnits] = useState(String(item.priceMinorUnits));
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
            onClick={() => onSubmit({ subscriptionProductId: subscriptionProductId.trim() || undefined, consumableProductId: consumableProductId.trim() || undefined, countryCode: countryCode.trim().toUpperCase(), platform, currency: currency.trim().toUpperCase(), priceMinorUnits: Number(priceMinorUnits), autoRenew, isActive })}
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

export default function PaymentOffersPage() {
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/.*$/, "");
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<PaymentOffer | null>(null);
  const [deleting, setDeleting] = useState<PaymentOffer | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ items?: PaymentOffer[]; offers?: PaymentOffer[] }>({
    queryKey: adminKeys.paymentConfig.paymentOffers(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/payment-config/payment-offers");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const items: PaymentOffer[] = data?.items ?? data?.offers ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch("/api/internal-admin/payment-config/payment-offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Payment offer created"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentOffers() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FormValues }) => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-offers/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Payment offer updated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentOffers() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-offers/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to deactivate"); }
    },
    onSuccess: () => { toast.success("Payment offer deactivated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentOffers() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Payment Offers"
        description="Manage pricing offers available to users by country and platform"
        actions={
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> Add Offer
          </button>
        }
      />

      {showCreate && <CreateForm onSubmit={(v) => createMutation.mutate(v)} onCancel={() => setShowCreate(false)} isLoading={createMutation.isPending} />}
      {editing && <EditModal item={editing} onSubmit={(v) => updateMutation.mutate({ id: editing.id, body: v })} onCancel={() => setEditing(null)} isLoading={updateMutation.isPending} />}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-[#E5E5EA] rounded-xl animate-pulse" />)}</div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState icon={<Tag className="h-10 w-10" />} title="No payment offers yet" description="Add your first payment offer to enable purchases." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Auto-Renew</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Sub. Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-mono text-xs text-[#17171B]">
                    <Link href={`${adminConsolePath}/payment-config/payment-offers/${item.id}`} className="hover:text-[#7C3AED] hover:underline">
                      {item.countryCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#666672]">{item.platform}</td>
                  <td className="px-4 py-3 tabular-nums text-[#666672]">{item.currency} {(item.priceMinorUnits / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {item.autoRenew
                      ? <span className={ACTIVE_BADGE}>Yes</span>
                      : <span className={INACTIVE_BADGE}>No</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]" title={item.subscriptionProductId}>{truncateId(item.subscriptionProductId)}</td>
                  <td className="px-4 py-3">
                    {item.isActive
                      ? <span className={ACTIVE_BADGE}>Active</span>
                      : <span className={INACTIVE_BADGE}>Inactive</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <Link href={`${adminConsolePath}/payment-config/payment-offers/${item.id}`} className="p-1.5 text-[#666672] hover:text-[#7C3AED] hover:bg-[#EDE2FF] rounded-lg" title="View details"><Eye className="h-3.5 w-3.5" /></Link>
                      <button type="button" onClick={() => setEditing(item)} className="p-1.5 text-[#666672] hover:text-[#7C3AED] hover:bg-[#EDE2FF] rounded-lg" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => setDeleting(item)} className="p-1.5 text-[#666672] hover:text-[#C63B4E] hover:bg-[#FFF1F2] rounded-lg" title="Deactivate"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeleting(null)}
          onConfirm={() => deleteMutation.mutate(deleting.id)}
          title="Deactivate payment offer"
          description={`Deactivate this offer for ${deleting.countryCode} / ${deleting.platform}? Users will no longer see it.`}
          confirmLabel="Deactivate"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
