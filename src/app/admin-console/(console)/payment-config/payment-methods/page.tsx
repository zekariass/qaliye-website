"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { PaymentMethod } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, Wallet, X } from "lucide-react";

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
  countryCode: string;
  platform: string;
  methodCode: string;
  displayName: string;
  paymentChannel: string;
  paymentMethod: string;
  paymentInstructions?: string;
  isActive: boolean;
  displayOrder: number;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [countryCode, setCountryCode] = useState("");
  const [platform, setPlatform] = useState("MOBILE");
  const [methodCode, setMethodCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("MOBILE_MONEY");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("0");

  const valid = countryCode.trim().length === 2 && methodCode.trim() && displayName.trim();

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Payment Method</h3>
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
          <label className="block text-xs font-medium text-[#17171B] mb-1">Method Code *</label>
          <input value={methodCode} onChange={(e) => setMethodCode(e.target.value)} className={`${INPUT} font-mono`} placeholder="e.g. telebirr" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Display Name *</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={INPUT} placeholder="e.g. Telebirr" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Payment Channel</label>
          <select value={paymentChannel} onChange={(e) => setPaymentChannel(e.target.value)} className={SELECT}>
            <option value="MOBILE_MONEY">MOBILE_MONEY</option>
            <option value="ONLINE">ONLINE</option>
            <option value="MANUAL_TRANSFER">MANUAL_TRANSFER</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Payment Method</label>
          <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={INPUT} placeholder="e.g. USSD" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Display Order</label>
          <input value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} type="number" min="0" className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Active</label>
          <Toggle value={isActive} onChange={setIsActive} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#17171B] mb-1">Payment Instructions</label>
        <textarea value={paymentInstructions} onChange={(e) => setPaymentInstructions(e.target.value)} rows={2} className={INPUT} placeholder="Instructions shown to the user after selecting this method" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button
          type="button"
          onClick={() => onSubmit({ countryCode: countryCode.trim().toUpperCase(), platform, methodCode: methodCode.trim(), displayName: displayName.trim(), paymentChannel, paymentMethod: paymentMethod.trim(), paymentInstructions: paymentInstructions.trim() || undefined, isActive, displayOrder: Number(displayOrder) })}
          disabled={!valid || isLoading}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: PaymentMethod; onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [countryCode, setCountryCode] = useState(item.countryCode);
  const [platform, setPlatform] = useState(item.platform);
  const [methodCode, setMethodCode] = useState(item.methodCode);
  const [displayName, setDisplayName] = useState(item.displayName);
  const [paymentChannel, setPaymentChannel] = useState(item.paymentChannel);
  const [paymentMethod, setPaymentMethod] = useState(item.paymentMethod);
  const [paymentInstructions, setPaymentInstructions] = useState(item.paymentInstructions ?? "");
  const [isActive, setIsActive] = useState(item.isActive);
  const [displayOrder, setDisplayOrder] = useState(String(item.displayOrder));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Payment Method</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
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
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Method Code</label>
              <input value={methodCode} onChange={(e) => setMethodCode(e.target.value)} className={`${INPUT} font-mono`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Display Name *</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Payment Channel</label>
            <select value={paymentChannel} onChange={(e) => setPaymentChannel(e.target.value)} className={SELECT}>
              <option value="MOBILE_MONEY">MOBILE_MONEY</option>
              <option value="ONLINE">ONLINE</option>
              <option value="MANUAL_TRANSFER">MANUAL_TRANSFER</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Payment Method</label>
              <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Display Order</label>
              <input value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} type="number" min="0" className={INPUT} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Payment Instructions</label>
            <textarea value={paymentInstructions} onChange={(e) => setPaymentInstructions(e.target.value)} rows={3} className={INPUT} />
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
            onClick={() => onSubmit({ countryCode: countryCode.trim().toUpperCase(), platform, methodCode: methodCode.trim(), displayName: displayName.trim(), paymentChannel, paymentMethod: paymentMethod.trim(), paymentInstructions: paymentInstructions.trim() || undefined, isActive, displayOrder: Number(displayOrder) })}
            disabled={!displayName.trim() || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [deleting, setDeleting] = useState<PaymentMethod | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ items?: PaymentMethod[]; methods?: PaymentMethod[] }>({
    queryKey: adminKeys.paymentConfig.paymentMethods(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/payment-config/payment-methods");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const items: PaymentMethod[] = data?.items ?? data?.methods ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch("/api/internal-admin/payment-config/payment-methods", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Payment method created"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentMethods() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FormValues }) => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-methods/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Payment method updated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentMethods() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-methods/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to deactivate"); }
    },
    onSuccess: () => { toast.success("Payment method deactivated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentMethods() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Payment Methods"
        description="Manage payment methods shown to users by country and platform"
        actions={
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> Add Method
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
        <EmptyState icon={<Wallet className="h-10 w-10" />} title="No payment methods yet" description="Add your first payment method to enable payments." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Method Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Display Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-mono text-xs text-[#17171B]">{item.methodCode}</td>
                  <td className="px-4 py-3 font-medium text-[#17171B]">{item.displayName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]">{item.countryCode}</td>
                  <td className="px-4 py-3 text-[#666672]">{item.platform}</td>
                  <td className="px-4 py-3 text-[#666672]">{item.paymentChannel}</td>
                  <td className="px-4 py-3 tabular-nums text-[#666672]">{item.displayOrder}</td>
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
          title="Deactivate payment method"
          description={`Deactivate "${deleting.displayName}" (${deleting.countryCode})? Users will no longer see this option.`}
          confirmLabel="Deactivate"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
