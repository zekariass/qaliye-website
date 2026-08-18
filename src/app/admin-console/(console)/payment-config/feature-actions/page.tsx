"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { FeatureAction } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, Zap, X, Eye } from "lucide-react";
import Link from "next/link";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const SELECT = `${INPUT} bg-white`;

const TYPE_COLORS: Record<string, string> = {
  ACTION: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EDE2FF] text-[#7C3AED]",
  VIEW: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#3B82F6]",
  BOOST: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF7ED] text-[#F59E0B]",
};

interface FormValues {
  code: string;
  name: string;
  type: string;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("ACTION");

  const valid = code.trim() && name.trim();

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Feature Action</h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Code *</label>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className={`${INPUT} font-mono`} placeholder="e.g. LIKE" />
          <p className="mt-1 text-xs text-[#9CA3AF]">Uppercase, e.g. LIKE, VIEW_PROFILE</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="e.g. Like Profile" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={SELECT}>
            <option value="ACTION">ACTION</option>
            <option value="VIEW">VIEW</option>
            <option value="BOOST">BOOST</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button
          type="button"
          onClick={() => onSubmit({ code: code.trim(), name: name.trim(), type })}
          disabled={!valid || isLoading}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
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
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Code (immutable)</label>
            <input value={code} disabled className={`${INPUT} font-mono bg-[#F7F7FA] text-[#9CA3AF]`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Type (immutable)</label>
            <input value={type} disabled className={`${INPUT} bg-[#F7F7FA] text-[#9CA3AF]`} />
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

export default function FeatureActionsPage() {
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/.*$/, "");
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<FeatureAction | null>(null);
  const [deleting, setDeleting] = useState<FeatureAction | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ items?: FeatureAction[]; featureActions?: FeatureAction[] }>({
    queryKey: adminKeys.paymentConfig.featureActions(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/payment-config/feature-actions");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const items: FeatureAction[] = data?.items ?? data?.featureActions ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch("/api/internal-admin/payment-config/feature-actions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Feature action created"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.featureActions() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FormValues }) => {
      const res = await fetch(`/api/internal-admin/payment-config/feature-actions/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Feature action updated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.featureActions() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/payment-config/feature-actions/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to delete"); }
    },
    onSuccess: () => { toast.success("Feature action deleted"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.featureActions() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Feature Actions"
        description="Define trackable feature actions that can have limits and credit costs"
        actions={
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> Add Action
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
        <EmptyState icon={<Zap className="h-10 w-10" />} title="No feature actions yet" description="Add feature actions to configure plan limits and credit costs." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-mono text-xs text-[#17171B]">
                    <Link href={`${adminConsolePath}/payment-config/feature-actions/${item.id}`} className="hover:text-[#7C3AED] hover:underline">
                      {item.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#17171B]">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className={TYPE_COLORS[item.type] ?? TYPE_COLORS["ACTION"]}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <Link href={`${adminConsolePath}/payment-config/feature-actions/${item.id}`} className="p-1.5 text-[#666672] hover:text-[#7C3AED] hover:bg-[#EDE2FF] rounded-lg" title="View details"><Eye className="h-3.5 w-3.5" /></Link>
                      <button type="button" onClick={() => setEditing(item)} className="p-1.5 text-[#666672] hover:text-[#7C3AED] hover:bg-[#EDE2FF] rounded-lg" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => setDeleting(item)} className="p-1.5 text-[#666672] hover:text-[#C63B4E] hover:bg-[#FFF1F2] rounded-lg" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
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
          title="Delete feature action"
          description={`Permanently delete "${deleting.name}" (${deleting.code})? Any plan limits referencing this action must be removed first.`}
          confirmLabel="Delete"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
