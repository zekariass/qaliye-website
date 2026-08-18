"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { ConsumableProduct } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, Zap, X } from "lucide-react";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const SELECT = `${INPUT} bg-white`;

const ACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16815D]";
const INACTIVE_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#C63B4E]";

function Toggle({ value, onChange, labelTrue = "Active", labelFalse = "Inactive" }: { value: boolean; onChange: (v: boolean) => void; labelTrue?: string; labelFalse?: string }) {
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

interface FormValues {
  productCode: string;
  name: string;
  entitlementType: string;
  quantityGranted: number;
  expiresAfterDays?: number;
  isActive: boolean;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [productCode, setProductCode] = useState("");
  const [name, setName] = useState("");
  const [entitlementType, setEntitlementType] = useState("CREDIT_PURCHASE");
  const [quantityGranted, setQuantityGranted] = useState("1");
  const [expiresAfterDays, setExpiresAfterDays] = useState("");
  const [isActive, setIsActive] = useState(true);

  const valid = productCode.trim() && name.trim();

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Consumable Product</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Product Code *</label>
          <input value={productCode} onChange={(e) => setProductCode(e.target.value)} className={`${INPUT} font-mono`} placeholder="e.g. com.app.credits.100" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="e.g. 100 Credits" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Entitlement Type</label>
          <select value={entitlementType} onChange={(e) => setEntitlementType(e.target.value)} className={SELECT}>
            <option value="CREDIT_PURCHASE">CREDIT_PURCHASE</option>
            <option value="BOOST">BOOST</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Quantity Granted</label>
          <input value={quantityGranted} onChange={(e) => setQuantityGranted(e.target.value)} type="number" min="1" className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Expires After (days)</label>
          <input value={expiresAfterDays} onChange={(e) => setExpiresAfterDays(e.target.value)} type="number" min="1" className={INPUT} placeholder="Optional" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Active</label>
          <Toggle value={isActive} onChange={setIsActive} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button
          type="button"
          onClick={() => onSubmit({ productCode: productCode.trim(), name: name.trim(), entitlementType, quantityGranted: Number(quantityGranted), expiresAfterDays: expiresAfterDays ? Number(expiresAfterDays) : undefined, isActive })}
          disabled={!valid || isLoading}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: ConsumableProduct; onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [productCode, setProductCode] = useState(item.productCode);
  const [name, setName] = useState(item.name);
  const [entitlementType, setEntitlementType] = useState(item.entitlementType);
  const [quantityGranted, setQuantityGranted] = useState(String(item.quantityGranted));
  const [expiresAfterDays, setExpiresAfterDays] = useState(item.expiresAfterDays != null ? String(item.expiresAfterDays) : "");
  const [isActive, setIsActive] = useState(item.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Consumable Product</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Product Code</label>
            <input value={productCode} onChange={(e) => setProductCode(e.target.value)} className={`${INPUT} font-mono`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Entitlement Type</label>
            <select value={entitlementType} onChange={(e) => setEntitlementType(e.target.value)} className={SELECT}>
              <option value="CREDIT_PURCHASE">CREDIT_PURCHASE</option>
              <option value="BOOST">BOOST</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Quantity Granted</label>
              <input value={quantityGranted} onChange={(e) => setQuantityGranted(e.target.value)} type="number" min="1" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Expires After (days)</label>
              <input value={expiresAfterDays} onChange={(e) => setExpiresAfterDays(e.target.value)} type="number" min="1" className={INPUT} placeholder="Optional" />
            </div>
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
            onClick={() => onSubmit({ productCode: productCode.trim(), name: name.trim(), entitlementType, quantityGranted: Number(quantityGranted), expiresAfterDays: expiresAfterDays ? Number(expiresAfterDays) : undefined, isActive })}
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

export default function ConsumableProductsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<ConsumableProduct | null>(null);
  const [deleting, setDeleting] = useState<ConsumableProduct | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ items?: ConsumableProduct[]; products?: ConsumableProduct[] }>({
    queryKey: adminKeys.paymentConfig.consumableProducts(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/payment-config/consumable-products");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const items: ConsumableProduct[] = data?.items ?? data?.products ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch("/api/internal-admin/payment-config/consumable-products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Consumable product created"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.consumableProducts() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FormValues }) => {
      const res = await fetch(`/api/internal-admin/payment-config/consumable-products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Consumable product updated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.consumableProducts() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/payment-config/consumable-products/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to deactivate"); }
    },
    onSuccess: () => { toast.success("Consumable product deactivated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.consumableProducts() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Consumable Products"
        description="Manage one-time purchasable products like credit packs"
        actions={
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> Add Product
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
        <EmptyState icon={<Zap className="h-10 w-10" />} title="No consumable products yet" description="Add your first consumable product to get started." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Product Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Expires (days)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-mono text-xs text-[#17171B]">{item.productCode}</td>
                  <td className="px-4 py-3 font-medium text-[#17171B]">{item.name}</td>
                  <td className="px-4 py-3 text-[#666672]">{item.entitlementType}</td>
                  <td className="px-4 py-3 tabular-nums text-[#666672]">{item.quantityGranted}</td>
                  <td className="px-4 py-3 tabular-nums text-[#666672]">{item.expiresAfterDays ?? "—"}</td>
                  <td className="px-4 py-3">
                    {item.isActive
                      ? <span className={ACTIVE_BADGE}>Active</span>
                      : <span className={INACTIVE_BADGE}>Inactive</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
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
          title="Deactivate consumable product"
          description={`Deactivate "${deleting.name}"? It will no longer be available for purchase.`}
          confirmLabel="Deactivate"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
