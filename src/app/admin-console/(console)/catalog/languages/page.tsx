"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { CatalogItem } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, Globe, X } from "lucide-react";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

interface CreateValues {
  code: string;
  countryCode: string;
  name: string;
  nativeName?: string;
  sortOrder: number;
}

interface EditValues {
  name: string;
  nativeName?: string;
  isActive: boolean;
  sortOrder: number;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: CreateValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [code, setCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [name, setName] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const valid = code.trim() && countryCode.trim().length === 2 && name.trim() && sortOrder.trim();

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Language</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="e.g. Amharic" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Code *</label>
          <input value={code} onChange={(e) => setCode(e.target.value.toLowerCase())} className={`${INPUT} font-mono`} placeholder="e.g. amharic" />
          <p className="mt-1 text-xs text-[#9CA3AF]">Lowercase letters, numbers, - and _</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Country Code *</label>
          <input value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase().slice(0, 2))} className={`${INPUT} font-mono`} placeholder="e.g. ET" maxLength={2} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Native Name</label>
          <input value={nativeName} onChange={(e) => setNativeName(e.target.value)} className={INPUT} placeholder="e.g. አማርኛ" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Sort Order *</label>
          <input value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} type="number" min="0" className={INPUT} placeholder="0" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button type="button" onClick={() => onSubmit({ code: code.trim(), countryCode: countryCode.trim().toUpperCase(), name: name.trim(), nativeName: nativeName.trim() || undefined, sortOrder: Number(sortOrder) })} disabled={!valid || isLoading} className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50">
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: CatalogItem; onSubmit: (v: EditValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [name, setName] = useState(item.name);
  const [nativeName, setNativeName] = useState(item.nativeName ?? "");
  const [isActive, setIsActive] = useState(item.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(String(item.sortOrder ?? 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Language</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Code (immutable)</label>
              <input value={item.code ?? ""} disabled className={`${INPUT} font-mono bg-[#F7F7FA] text-[#9CA3AF]`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Country (immutable)</label>
              <input value={item.countryCode ?? ""} disabled className={`${INPUT} font-mono bg-[#F7F7FA] text-[#9CA3AF]`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Native Name</label>
            <input value={nativeName} onChange={(e) => setNativeName(e.target.value)} className={INPUT} placeholder="e.g. አማርኛ" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Sort Order</label>
              <input value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} type="number" min="0" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Active</label>
              <button type="button" onClick={() => setIsActive(!isActive)} className={`${INPUT} flex items-center justify-center ${isActive ? "text-[#16815D]" : "text-[#9CA3AF]"}`}>
                {isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
          <button type="button" onClick={() => onSubmit({ name: name.trim(), nativeName: nativeName.trim() || undefined, isActive, sortOrder: Number(sortOrder) })} disabled={!name.trim() || isLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50">
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LanguagesPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [deleting, setDeleting] = useState<CatalogItem | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ languages?: CatalogItem[]; items?: CatalogItem[] }>({
    queryKey: adminKeys.catalog.languages(),
    queryFn: async () => { const res = await fetch("/api/internal-admin/catalog/languages"); if (!res.ok) throw new Error(`${res.status}`); return res.json(); },
  });

  const items: CatalogItem[] = data?.languages ?? data?.items ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: CreateValues) => {
      const res = await fetch("/api/internal-admin/catalog/languages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Language added"); queryClient.invalidateQueries({ queryKey: adminKeys.catalog.languages() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: EditValues }) => {
      const res = await fetch(`/api/internal-admin/catalog/languages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Language updated"); queryClient.invalidateQueries({ queryKey: adminKeys.catalog.languages() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/catalog/languages/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to delete"); }
    },
    onSuccess: () => { toast.success("Language deactivated"); queryClient.invalidateQueries({ queryKey: adminKeys.catalog.languages() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Languages" description="Manage supported languages in the catalog" actions={
        <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
          <Plus className="h-4 w-4" /> Add Language
        </button>
      } />

      {showCreate && <CreateForm onSubmit={(v) => createMutation.mutate(v)} onCancel={() => setShowCreate(false)} isLoading={createMutation.isPending} />}
      {editing && <EditModal item={editing} onSubmit={(v) => updateMutation.mutate({ id: editing.id, body: v })} onCancel={() => setEditing(null)} isLoading={updateMutation.isPending} />}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-[#E5E5EA] rounded-xl animate-pulse" />)}</div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState icon={<Globe className="h-10 w-10" />} title="No languages yet" description="Add your first language to the catalog." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Native Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Sort</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-medium text-[#17171B]">{item.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]">{item.code ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]">{item.countryCode ?? "—"}</td>
                  <td className="px-4 py-3 text-[#666672]">{item.nativeName ?? "—"}</td>
                  <td className="px-4 py-3 text-[#666672] tabular-nums">{item.sortOrder ?? 0}</td>
                  <td className="px-4 py-3">
                    {item.isActive === false
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#C63B4E]">Inactive</span>
                      : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16815D]">Active</span>}
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
          title="Deactivate language"
          description={`Deactivate "${deleting.name}"? It will be hidden from user-facing endpoints but existing references are preserved.`}
          confirmLabel="Deactivate"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
