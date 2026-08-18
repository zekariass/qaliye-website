"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { CountrySetting } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, Globe, X } from "lucide-react";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

const YES_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#16815D]";
const NO_BADGE = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#C63B4E]";

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

interface FormValues {
  countryCode: string;
  subscriptionEnabled: boolean;
  creditsEnabled: boolean;
  identityVerificationRequired: boolean;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [countryCode, setCountryCode] = useState("");
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [creditsEnabled, setCreditsEnabled] = useState(false);
  const [identityVerificationRequired, setIdentityVerificationRequired] = useState(false);

  const valid = countryCode.trim().length === 2;

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Country Setting</h3>
      <div>
        <label className="block text-xs font-medium text-[#17171B] mb-1">Country Code *</label>
        <input value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase().slice(0, 2))} className={`${INPUT} font-mono w-32`} placeholder="e.g. ET" maxLength={2} />
        <p className="mt-1 text-xs text-[#9CA3AF]">2-letter ISO country code</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Subscriptions Enabled</label>
          <Toggle value={subscriptionEnabled} onChange={setSubscriptionEnabled} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Credits Enabled</label>
          <Toggle value={creditsEnabled} onChange={setCreditsEnabled} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Identity Verification Required</label>
          <Toggle value={identityVerificationRequired} onChange={setIdentityVerificationRequired} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button
          type="button"
          onClick={() => onSubmit({ countryCode: countryCode.trim().toUpperCase(), subscriptionEnabled, creditsEnabled, identityVerificationRequired })}
          disabled={!valid || isLoading}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: CountrySetting; onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(item.subscriptionEnabled);
  const [creditsEnabled, setCreditsEnabled] = useState(item.creditsEnabled);
  const [identityVerificationRequired, setIdentityVerificationRequired] = useState(item.identityVerificationRequired);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Country Setting</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Country Code (immutable)</label>
            <input value={item.countryCode} disabled className={`${INPUT} font-mono bg-[#F7F7FA] text-[#9CA3AF] w-32`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Subscriptions Enabled</label>
            <Toggle value={subscriptionEnabled} onChange={setSubscriptionEnabled} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Credits Enabled</label>
            <Toggle value={creditsEnabled} onChange={setCreditsEnabled} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Identity Verification Required</label>
            <Toggle value={identityVerificationRequired} onChange={setIdentityVerificationRequired} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
          <button
            type="button"
            onClick={() => onSubmit({ countryCode: item.countryCode, subscriptionEnabled, creditsEnabled, identityVerificationRequired })}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CountrySettingsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<CountrySetting | null>(null);
  const [deleting, setDeleting] = useState<CountrySetting | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ items?: CountrySetting[]; settings?: CountrySetting[] }>({
    queryKey: adminKeys.paymentConfig.countrySettings(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/payment-config/country-settings");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const items: CountrySetting[] = data?.items ?? data?.settings ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch("/api/internal-admin/payment-config/country-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Country setting created"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.countrySettings() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FormValues }) => {
      const res = await fetch(`/api/internal-admin/payment-config/country-settings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Country setting updated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.countrySettings() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/payment-config/country-settings/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to delete"); }
    },
    onSuccess: () => { toast.success("Country setting deleted"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.countrySettings() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Country Settings"
        description="Configure payment feature availability per country"
        actions={
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> Add Country
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
        <EmptyState icon={<Globe className="h-10 w-10" />} title="No country settings yet" description="Add settings for each country where payments are enabled." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Subscriptions</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Credits</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Identity Verification</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-[#17171B]">{item.countryCode}</td>
                  <td className="px-4 py-3">
                    {item.subscriptionEnabled
                      ? <span className={YES_BADGE}>Enabled</span>
                      : <span className={NO_BADGE}>Disabled</span>}
                  </td>
                  <td className="px-4 py-3">
                    {item.creditsEnabled
                      ? <span className={YES_BADGE}>Enabled</span>
                      : <span className={NO_BADGE}>Disabled</span>}
                  </td>
                  <td className="px-4 py-3">
                    {item.identityVerificationRequired
                      ? <span className={YES_BADGE}>Required</span>
                      : <span className={NO_BADGE}>Not required</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
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
          title="Delete country setting"
          description={`Permanently delete settings for "${deleting.countryCode}"? This will disable all payment features for this country.`}
          confirmLabel="Delete"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
