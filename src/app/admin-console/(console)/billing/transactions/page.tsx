"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative } from "@/lib/admin/dates";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { Money } from "@/components/admin/shared/Money";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Drawer } from "@/components/admin/shared/Drawer";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import type { ManualTransaction } from "@/lib/admin/adapters";
import { Info } from "lucide-react";

const PAGE_SIZE = 20;

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? "";

  const [selected, setSelected] = useState<ManualTransaction | null>(null);
  const [reviewAction, setReviewAction] = useState<"COMPLETED" | "FAILED" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) { if (v) params.set(k, v); else params.delete(k); }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.transactions.list({ page, status }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (page > 1) qs.set("page", String(page));
      qs.set("pageSize", String(PAGE_SIZE));
      if (status) qs.set("status", status);
      const res = await fetch(`/api/internal-admin/transactions?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json() as Promise<{ transactions: ManualTransaction[]; totalPages: number; totalItems: number }>;
    },
    staleTime: 15_000,
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!selected || !reviewAction) return;
      const res = await fetch(`/api/internal-admin/transactions/${selected.transactionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: reviewAction, adminNotes: adminNotes.trim() || undefined }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Review failed"); }
    },
    onSuccess: () => {
      toast.success(`Transaction marked as ${reviewAction?.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions.list({}) });
      setSelected(null);
      setReviewAction(null);
      setAdminNotes("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const columns: Column<ManualTransaction>[] = [
    {
      key: "id",
      header: "Transaction",
      cell: (t) => (
        <div>
          <p className="font-mono text-xs text-[#666672]">{t.transactionId.slice(0, 12)}…</p>
          <p className="text-sm text-[#17171B]">{t.provider}</p>
        </div>
      ),
    },
    { key: "user", header: "User", cell: (t) => <span className="text-sm">{t.userDisplayName ?? t.userId}</span> },
    { key: "amount", header: "Amount", cell: (t) => <Money minorUnits={t.amountCents} currency={t.currency ?? "ETB"} className="text-sm" /> },
    { key: "purpose", header: "Purpose", cell: (t) => <span className="text-sm text-[#666672]">{t.paymentPurpose ?? "—"}</span> },
    { key: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
    { key: "date", header: "Date", cell: (t) => <span className="text-sm text-[#666672]" title={formatDateTime(t.createdAt)}>{formatRelative(t.createdAt)}</span> },
    { key: "actions", header: "", cell: (t) => t.status === "PENDING" ? (
      <button type="button" onClick={() => setSelected(t)} className="text-xs text-[#7C3AED] hover:underline">Review</button>
    ) : null, className: "w-16" },
  ];

  return (
    <div>
      <PageHeader title="Manual Transactions" description="Review manually submitted payment receipts" />

      <div className="flex gap-3 mb-4">
        <select value={status} onChange={(e) => updateParams({ status: e.target.value })} className="px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none cursor-pointer">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <AdminDataTable columns={columns} data={data?.transactions} isLoading={isLoading} isError={isError} onRetry={refetch} keyExtractor={(t) => t.transactionId} emptyTitle="No transactions" pagination={data ? { page, totalPages: data.totalPages, totalItems: data.totalItems, pageSize: PAGE_SIZE, onChange: (p) => updateParams({ page: String(p) }) } : undefined} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Review Transaction" description="Mark this transaction as completed or failed." footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setSelected(null)} className="px-3 py-2 text-sm text-[#666672] bg-[#F7F7FA] rounded-lg">Cancel</button>
          <button type="button" onClick={() => setReviewAction("FAILED")} className="px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white rounded-lg hover:bg-[#FFF1F2]">Mark Failed</button>
          <button type="button" onClick={() => setReviewAction("COMPLETED")} className="px-3 py-2 text-sm font-medium text-white bg-[#16815D] rounded-lg hover:bg-[#15694E]">Mark Completed</button>
        </div>
      }>
        {selected && (
          <div className="space-y-4">
            <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-start gap-2">
              <Info className="h-4 w-4 text-[#B7791F] shrink-0 mt-0.5" />
              <p className="text-xs text-[#B7791F]">Receipt images are not directly viewable — the receipt URL is a storage path, not a signed URL. Contact engineering for secure access.</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#666672]">Provider</span><span className="font-medium">{selected.provider}</span></div>
              <div className="flex justify-between"><span className="text-[#666672]">Amount</span><Money minorUnits={selected.amountCents} currency={selected.currency ?? "ETB"} /></div>
              <div className="flex justify-between"><span className="text-[#666672]">Purpose</span><span>{selected.paymentPurpose ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-[#666672]">Plan</span><span>{selected.planCode ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-[#666672]">User</span><span>{selected.userDisplayName ?? selected.userId}</span></div>
              <div className="flex justify-between"><span className="text-[#666672]">Submitted</span><span>{formatDateTime(selected.createdAt)}</span></div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">Admin notes <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none" placeholder="Internal notes…" />
            </div>
          </div>
        )}
      </Drawer>

      {reviewAction && selected && (
        <ConfirmDialog
          open={true}
          onClose={() => setReviewAction(null)}
          onConfirm={() => reviewMutation.mutate()}
          title={`Mark as ${reviewAction.toLowerCase()}`}
          description={`Are you sure you want to mark this transaction as ${reviewAction.toLowerCase()}?${reviewAction === "COMPLETED" ? " This will activate the user's subscription." : ""}`}
          confirmLabel={`Mark ${reviewAction.toLowerCase()}`}
          variant={reviewAction === "FAILED" ? "danger" : "default"}
          isLoading={reviewMutation.isPending}
        />
      )}
    </div>
  );
}
