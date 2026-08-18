"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { SubscriptionPlan } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, CreditCard, X, Eye } from "lucide-react";
import Link from "next/link";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const SELECT = `${INPUT} bg-white`;

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

interface CreateValues {
  name: string;
  planCode: string;
  countryCode: string;
  planKind: string;
  priceMinorUnits: number;
  currency: string;
  billingInterval: string;
  features?: string;
  isActive: boolean;
}

interface EditValues {
  name: string;
  features?: string;
  isActive: boolean;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: CreateValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [name, setName] = useState("");
  const [planCode, setPlanCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [planKind, setPlanKind] = useState("PAID");
  const [priceMinorUnits, setPriceMinorUnits] = useState("0");
  const [currency, setCurrency] = useState("ETB");
  const [billingInterval, setBillingInterval] = useState("MONTHLY");
  const [features, setFeatures] = useState("");
  const [isActive, setIsActive] = useState(true);

  const valid = name.trim() && planCode.trim() && countryCode.trim().length === 2;

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Subscription Plan</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="e.g. Gold Monthly" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Plan Code *</label>
          <input value={planCode} onChange={(e) => setPlanCode(e.target.value.toUpperCase())} className={`${INPUT} font-mono`} placeholder="e.g. GOLD_MONTHLY" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Country Code *</label>
          <input value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase().slice(0, 2))} className={`${INPUT} font-mono`} placeholder="ET" maxLength={2} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Plan Kind</label>
          <select value={planKind} onChange={(e) => setPlanKind(e.target.value)} className={SELECT}>
            <option value="PAID">PAID</option>
            <option value="FREE">FREE</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Billing Interval</label>
          <select value={billingInterval} onChange={(e) => setBillingInterval(e.target.value)} className={SELECT}>
            <option value="MONTHLY">MONTHLY</option>
            <option value="YEARLY">YEARLY</option>
            <option value="WEEKLY">WEEKLY</option>
            <option value="DAILY">DAILY</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Price (minor units)</label>
          <input value={priceMinorUnits} onChange={(e) => setPriceMinorUnits(e.target.value)} type="number" min="0" className={INPUT} placeholder="e.g. 49900" />
          <p className="mt-1 text-xs text-[#9CA3AF]">In cents/smallest unit</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Currency</label>
          <input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className={`${INPUT} font-mono`} placeholder="ETB" maxLength={3} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Active</label>
          <Toggle value={isActive} onChange={setIsActive} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#17171B] mb-1">Features (optional JSON/text)</label>
        <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={2} className={INPUT} placeholder='e.g. {"likes":50}' />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button
          type="button"
          onClick={() => onSubmit({ name: name.trim(), planCode: planCode.trim(), countryCode: countryCode.trim().toUpperCase(), planKind, priceMinorUnits: Number(priceMinorUnits), currency: currency.trim().toUpperCase(), billingInterval, features: features.trim() || undefined, isActive })}
          disabled={!valid || isLoading}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
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

export default function SubscriptionPlansPage() {
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/.*$/, "");
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [deleting, setDeleting] = useState<SubscriptionPlan | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ items?: SubscriptionPlan[]; plans?: SubscriptionPlan[] }>({
    queryKey: adminKeys.paymentConfig.subscriptionPlans(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/payment-config/subscription-plans");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const items: SubscriptionPlan[] = data?.items ?? data?.plans ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: CreateValues) => {
      const res = await fetch("/api/internal-admin/payment-config/subscription-plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Subscription plan created"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.subscriptionPlans() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: EditValues }) => {
      const res = await fetch(`/api/internal-admin/payment-config/subscription-plans/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Subscription plan updated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.subscriptionPlans() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/payment-config/subscription-plans/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to deactivate"); }
    },
    onSuccess: () => { toast.success("Subscription plan deactivated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.subscriptionPlans() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Subscription Plans"
        description="Manage subscription plans available in each country"
        actions={
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> Add Plan
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
        <EmptyState icon={<CreditCard className="h-10 w-10" />} title="No subscription plans yet" description="Add your first subscription plan to get started." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Plan Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Kind</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Interval</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-medium text-[#17171B]">
                    <Link href={`${adminConsolePath}/payment-config/subscription-plans/${item.id}`} className="hover:text-[#7C3AED] hover:underline">
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]">{item.planCode}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]">{item.countryCode}</td>
                  <td className="px-4 py-3 text-[#666672]">{item.planKind}</td>
                  <td className="px-4 py-3 tabular-nums text-[#666672]">{formatPrice(item.priceMinorUnits, item.currency)}</td>
                  <td className="px-4 py-3 text-[#666672]">{item.billingInterval}</td>
                  <td className="px-4 py-3">
                    {item.isActive
                      ? <span className={ACTIVE_BADGE}>Active</span>
                      : <span className={INACTIVE_BADGE}>Inactive</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <Link href={`${adminConsolePath}/payment-config/subscription-plans/${item.id}`} className="p-1.5 text-[#666672] hover:text-[#7C3AED] hover:bg-[#EDE2FF] rounded-lg" title="View details"><Eye className="h-3.5 w-3.5" /></Link>
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
          title="Deactivate subscription plan"
          description={`Deactivate "${deleting.name}"? Existing subscriptions on this plan will not be affected.`}
          confirmLabel="Deactivate"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
