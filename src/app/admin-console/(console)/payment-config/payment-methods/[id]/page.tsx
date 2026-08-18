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
import type { PaymentMethod } from "@/lib/admin/adapters";
import { Pencil, Trash2, ChevronLeft, X, ExternalLink } from "lucide-react";
import Link from "next/link";

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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-sm text-[#666672] shrink-0 w-40">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
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

export default function PaymentMethodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/payment-methods\/.*$/, "");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const detailKey = [...adminKeys.paymentConfig.paymentMethods(), "detail", id] as const;

  const { data: item, isLoading, isError, refetch } = useQuery<PaymentMethod>({
    queryKey: detailKey,
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-methods/${id}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-methods/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => {
      toast.success("Payment method updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentMethods() });
      queryClient.invalidateQueries({ queryKey: detailKey });
      setEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/payment-methods/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to deactivate"); }
    },
    onSuccess: () => {
      toast.success("Payment method deactivated");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.paymentMethods() });
      setDeleting(false);
      router.push(`${adminConsolePath}/payment-config/payment-methods`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !item) return <ErrorState onRetry={refetch} />;

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/payment-config/payment-methods`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Payment Methods
        </Link>
      </div>

      <PageHeader
        title={item.displayName}
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
        <DetailRow label="Method Code" value={<span className="font-mono">{item.methodCode}</span>} />
        <DetailRow label="Display Name" value={item.displayName} />
        <DetailRow label="Country Code" value={<span className="font-mono">{item.countryCode}</span>} />
        <DetailRow label="Platform" value={item.platform} />
        <DetailRow label="Payment Channel" value={item.paymentChannel} />
        <DetailRow label="Payment Method" value={item.paymentMethod} />
        <DetailRow label="Display Order" value={<span className="tabular-nums">{item.displayOrder}</span>} />
        <DetailRow label="Payment Instructions" value={
          item.paymentInstructions
            ? <div className="text-left whitespace-pre-wrap">{item.paymentInstructions}</div>
            : "—"
        } />
        <DetailRow label="Metadata" value={
          item.metadata
            ? <pre className="font-mono text-xs bg-[#F7F7FA] rounded-lg p-3 text-left overflow-x-auto max-w-md">{item.metadata}</pre>
            : "—"
        } />
        <DetailRow label="Verification Params" value={
          item.verificationParams
            ? <pre className="font-mono text-xs bg-[#F7F7FA] rounded-lg p-3 text-left overflow-x-auto max-w-md">{item.verificationParams}</pre>
            : "—"
        } />
        <DetailRow label="Logo URL" value={
          item.logoUrl
            ? <a href={item.logoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#7C3AED] hover:underline text-sm">
                {item.logoUrl} <ExternalLink className="h-3.5 w-3.5" />
              </a>
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
        title="Deactivate payment method"
        description={`Deactivate "${item.displayName}" (${item.countryCode})? Users will no longer see this option.`}
        confirmLabel="Deactivate"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
