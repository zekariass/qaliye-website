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
import type { FeatureAction } from "@/lib/admin/adapters";
import { Pencil, Trash2, ChevronLeft, X } from "lucide-react";
import Link from "next/link";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const SELECT = `${INPUT} bg-white`;

const TYPE_COLORS: Record<string, string> = {
  ACTION: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EDE2FF] text-[#7C3AED]",
  VIEW: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#3B82F6]",
  BOOST: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF7ED] text-[#F59E0B]",
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-sm text-[#666672] shrink-0 w-40">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

interface FormValues {
  code: string;
  name: string;
  type: string;
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: FeatureAction; onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [code, setCode] = useState(item.code);
  const [name, setName] = useState(item.name);
  const [type, setType] = useState(item.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Feature Action</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className={`${INPUT} font-mono`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={SELECT}>
              <option value="ACTION">ACTION</option>
              <option value="VIEW">VIEW</option>
              <option value="BOOST">BOOST</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
          <button
            type="button"
            onClick={() => onSubmit({ code: code.trim(), name: name.trim(), type })}
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

export default function FeatureActionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/feature-actions\/.*$/, "");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const detailKey = [...adminKeys.paymentConfig.featureActions(), "detail", id] as const;

  const { data: item, isLoading, isError, refetch } = useQuery<FeatureAction>({
    queryKey: detailKey,
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/feature-actions/${id}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch(`/api/internal-admin/payment-config/feature-actions/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => {
      toast.success("Feature action updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.featureActions() });
      queryClient.invalidateQueries({ queryKey: detailKey });
      setEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/payment-config/feature-actions/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to delete"); }
    },
    onSuccess: () => {
      toast.success("Feature action deleted");
      queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.featureActions() });
      setDeleting(false);
      router.push(`${adminConsolePath}/payment-config/feature-actions`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !item) return <ErrorState onRetry={refetch} />;

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/payment-config/feature-actions`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Feature Actions
        </Link>
      </div>

      <PageHeader
        title={item.code}
        badge={<span className={TYPE_COLORS[item.type] ?? TYPE_COLORS["ACTION"]}>{item.type}</span>}
        actions={
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666672] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl transition-colors">
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button type="button" onClick={() => setDeleting(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl transition-colors">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        <DetailRow label="Code" value={<span className="font-mono">{item.code}</span>} />
        <DetailRow label="Name" value={item.name} />
        <DetailRow label="Type" value={<span className={TYPE_COLORS[item.type] ?? TYPE_COLORS["ACTION"]}>{item.type}</span>} />
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
        title="Delete feature action"
        description={`Permanently delete "${item.name}" (${item.code})? Any plan limits referencing this action must be removed first.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
