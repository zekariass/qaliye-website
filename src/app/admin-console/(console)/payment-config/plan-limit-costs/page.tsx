"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import type { PlanLimitCost } from "@/lib/admin/adapters";
import { Plus, Pencil, Trash2, Settings, X, Eye } from "lucide-react";
import Link from "next/link";

const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";
const SELECT = `${INPUT} bg-white`;

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

function truncateId(id: string) {
  return id.slice(0, 8) + "…";
}

interface FormValues {
  subscriptionPlanId: string;
  featureActionId: string;
  memberCreditCost: number;
  actualCreditCost: number;
  limitValue: number;
  periodType: string;
  applyCreditAfterLimit: boolean;
}

function CreateForm({ onSubmit, onCancel, isLoading }: { onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [subscriptionPlanId, setSubscriptionPlanId] = useState("");
  const [featureActionId, setFeatureActionId] = useState("");
  const [memberCreditCost, setMemberCreditCost] = useState("0");
  const [actualCreditCost, setActualCreditCost] = useState("0");
  const [limitValue, setLimitValue] = useState("0");
  const [periodType, setPeriodType] = useState("DAY");
  const [applyCreditAfterLimit, setApplyCreditAfterLimit] = useState(false);

  const valid = subscriptionPlanId.trim() && featureActionId.trim();

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 mb-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Add Plan Limit & Cost</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Subscription Plan ID (UUID) *</label>
          <input value={subscriptionPlanId} onChange={(e) => setSubscriptionPlanId(e.target.value)} className={`${INPUT} font-mono`} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Feature Action ID (UUID) *</label>
          <input value={featureActionId} onChange={(e) => setFeatureActionId(e.target.value)} className={`${INPUT} font-mono`} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Member Credit Cost</label>
          <input value={memberCreditCost} onChange={(e) => setMemberCreditCost(e.target.value)} type="number" min="0" className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Actual Credit Cost</label>
          <input value={actualCreditCost} onChange={(e) => setActualCreditCost(e.target.value)} type="number" min="0" className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Limit Value</label>
          <input value={limitValue} onChange={(e) => setLimitValue(e.target.value)} type="number" min="0" className={INPUT} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Period Type</label>
          <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className={SELECT}>
            <option value="DAY">DAY</option>
            <option value="WEEK">WEEK</option>
            <option value="MONTH">MONTH</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1">Apply Credit After Limit</label>
          <Toggle value={applyCreditAfterLimit} onChange={setApplyCreditAfterLimit} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg hover:bg-[#E5E5EA]">Cancel</button>
        <button
          type="button"
          onClick={() => onSubmit({ subscriptionPlanId: subscriptionPlanId.trim(), featureActionId: featureActionId.trim(), memberCreditCost: Number(memberCreditCost), actualCreditCost: Number(actualCreditCost), limitValue: Number(limitValue), periodType, applyCreditAfterLimit })}
          disabled={!valid || isLoading}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function EditModal({ item, onSubmit, onCancel, isLoading }: { item: PlanLimitCost; onSubmit: (v: FormValues) => void; onCancel: () => void; isLoading: boolean }) {
  const [memberCreditCost, setMemberCreditCost] = useState(String(item.memberCreditCost));
  const [actualCreditCost, setActualCreditCost] = useState(String(item.actualCreditCost));
  const [limitValue, setLimitValue] = useState(String(item.limitValue));
  const [periodType, setPeriodType] = useState(item.periodType);
  const [applyCreditAfterLimit, setApplyCreditAfterLimit] = useState(item.applyCreditAfterLimit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#17171B]">Edit Plan Limit & Cost</h2>
          <button type="button" onClick={onCancel} className="p-1 text-[#666672] hover:text-[#17171B] rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Plan ID (immutable)</label>
              <input value={truncateId(item.subscriptionPlanId)} disabled className={`${INPUT} font-mono bg-[#F7F7FA] text-[#9CA3AF]`} title={item.subscriptionPlanId} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Feature Action ID (immutable)</label>
              <input value={truncateId(item.featureActionId)} disabled className={`${INPUT} font-mono bg-[#F7F7FA] text-[#9CA3AF]`} title={item.featureActionId} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Member Credit Cost</label>
              <input value={memberCreditCost} onChange={(e) => setMemberCreditCost(e.target.value)} type="number" min="0" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Actual Credit Cost</label>
              <input value={actualCreditCost} onChange={(e) => setActualCreditCost(e.target.value)} type="number" min="0" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Limit Value</label>
              <input value={limitValue} onChange={(e) => setLimitValue(e.target.value)} type="number" min="0" className={INPUT} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Period Type</label>
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className={SELECT}>
                <option value="DAY">DAY</option>
                <option value="WEEK">WEEK</option>
                <option value="MONTH">MONTH</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Apply Credit After Limit</label>
              <Toggle value={applyCreditAfterLimit} onChange={setApplyCreditAfterLimit} />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
          <button
            type="button"
            onClick={() => onSubmit({ subscriptionPlanId: item.subscriptionPlanId, featureActionId: item.featureActionId, memberCreditCost: Number(memberCreditCost), actualCreditCost: Number(actualCreditCost), limitValue: Number(limitValue), periodType, applyCreditAfterLimit })}
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

export default function PlanLimitCostsPage() {
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/payment-config\/.*$/, "");
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<PlanLimitCost | null>(null);
  const [deleting, setDeleting] = useState<PlanLimitCost | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<{ items?: PlanLimitCost[]; limitCosts?: PlanLimitCost[] }>({
    queryKey: adminKeys.paymentConfig.planLimitCosts(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/payment-config/plan-limit-costs");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const items: PlanLimitCost[] = data?.items ?? data?.limitCosts ?? [];

  const createMutation = useMutation({
    mutationFn: async (body: FormValues) => {
      const res = await fetch("/api/internal-admin/payment-config/plan-limit-costs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create"); }
    },
    onSuccess: () => { toast.success("Plan limit & cost created"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.planLimitCosts() }); setShowCreate(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FormValues }) => {
      const res = await fetch(`/api/internal-admin/payment-config/plan-limit-costs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update"); }
    },
    onSuccess: () => { toast.success("Plan limit & cost updated"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.planLimitCosts() }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/internal-admin/payment-config/plan-limit-costs/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to delete"); }
    },
    onSuccess: () => { toast.success("Plan limit & cost deleted"); queryClient.invalidateQueries({ queryKey: adminKeys.paymentConfig.planLimitCosts() }); setDeleting(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Plan Limits & Costs"
        description="Configure feature usage limits and credit costs per subscription plan"
        actions={
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> Add Limit
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
        <EmptyState icon={<Settings className="h-10 w-10" />} title="No plan limits yet" description="Add limits and credit costs for each plan's features." />
      ) : (
        <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="bg-[#F7F7FA] border-b border-[#E5E5EA]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Plan ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Feature Action ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Limit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Member Cost</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Actual Cost</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#666672] uppercase tracking-wider">Credit After Limit</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F7FA]">
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]" title={item.subscriptionPlanId}>
                    <Link href={`${adminConsolePath}/payment-config/plan-limit-costs/${item.id}`} className="hover:text-[#7C3AED] hover:underline">
                      {truncateId(item.subscriptionPlanId)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#666672]" title={item.featureActionId}>{truncateId(item.featureActionId)}</td>
                  <td className="px-4 py-3 tabular-nums text-[#17171B]">{item.limitValue}</td>
                  <td className="px-4 py-3 text-[#666672]">{item.periodType}</td>
                  <td className="px-4 py-3 tabular-nums text-[#666672]">{item.memberCreditCost}</td>
                  <td className="px-4 py-3 tabular-nums text-[#666672]">{item.actualCreditCost}</td>
                  <td className="px-4 py-3">
                    {item.applyCreditAfterLimit
                      ? <span className={YES_BADGE}>Yes</span>
                      : <span className={NO_BADGE}>No</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <Link href={`${adminConsolePath}/payment-config/plan-limit-costs/${item.id}`} className="p-1.5 text-[#666672] hover:text-[#7C3AED] hover:bg-[#EDE2FF] rounded-lg" title="View details"><Eye className="h-3.5 w-3.5" /></Link>
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
          title="Delete plan limit & cost"
          description={`Permanently delete this limit configuration? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
