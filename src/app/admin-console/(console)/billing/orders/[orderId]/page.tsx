"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { Money } from "@/components/admin/shared/Money";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { RefundOrderDialog } from "@/components/admin/billing/RefundOrderDialog";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import type { PaymentOrder } from "@/lib/admin/adapters";
import { CheckCircle, XCircle, RefreshCw, ChevronLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-sm text-[#666672] shrink-0 w-44">{label}</span>
      <span className="text-sm text-[#17171B] text-right">{value ?? "—"}</span>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/billing\/orders\/.*$/, "");
  const queryClient = useQueryClient();

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [approveNote, setApproveNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const { data: order, isLoading, isError, refetch } = useQuery<PaymentOrder>({
    queryKey: adminKeys.billing.orders.detail(orderId),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/billing/orders/${orderId}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/billing/orders/${orderId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(approveNote ? { decisionNote: approveNote } : {}),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Approve failed"); }
    },
    onSuccess: () => {
      toast.success("Order verified and subscription activated");
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.orders.list({}) });
      setApproveOpen(false);
      setApproveNote("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/billing/orders/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rejectReason ? { decisionNote: rejectReason } : {}),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Reject failed"); }
    },
    onSuccess: () => {
      toast.success("Order rejected");
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.orders.list({}) });
      setRejectOpen(false);
      setRejectReason("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !order) return <ErrorState onRetry={refetch} />;

  const REVIEWABLE_STATUSES = ["MANUAL_REVIEW", "RECEIPT_SUBMITTED", "REVIEW_REQUIRED", "VERIFICATION_PENDING"];
  const isReviewable = REVIEWABLE_STATUSES.includes(order.status);
  const isVerified = order.status === "VERIFIED";

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/billing/orders`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>

      <PageHeader
        title={`Order ${order.orderReference}`}
        badge={<StatusBadge status={order.status} />}
        actions={
          <div className="flex items-center gap-2">
            {isReviewable && (
              <>
                <button type="button" onClick={() => setApproveOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#16815D] hover:bg-[#15694E] rounded-xl">
                  <CheckCircle className="h-4 w-4" /> Verify
                </button>
                <button type="button" onClick={() => setRejectOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl">
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </>
            )}
            {isVerified && (
              <button type="button" onClick={() => setRefundOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl">
                <RefreshCw className="h-4 w-4" /> Issue Refund
              </button>
            )}
          </div>
        }
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        <Row label="Order Reference" value={<span className="font-mono">{order.orderReference}</span>} />
        <Row label="Order ID" value={<CopyIdButton id={order.id} />} />
        <Row label="Status" value={<StatusBadge status={order.status} />} />
        <Row label="Amount" value={<Money minorUnits={order.expectedAmountMinorUnits} currency={order.currency} className="font-semibold" />} />
        <Row label="Payment Method" value={order.methodDisplayName ?? order.methodCode ?? "—"} />
        <Row label="User" value={order.userDisplayName ?? order.userId} />
        <Row label="Created" value={formatDateTime(order.createdAt)} />
        {order.updatedAt && <Row label="Updated" value={formatDateTime(order.updatedAt)} />}
        {order.receiptUrl && (
          <Row label="Receipt" value={
            <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#7C3AED] hover:underline text-sm">
              View receipt <ExternalLink className="h-3.5 w-3.5" />
            </a>
          } />
        )}
      </div>

      <ConfirmDialog open={approveOpen} onClose={() => { setApproveOpen(false); setApproveNote(""); }} onConfirm={() => approveMutation.mutate()} title="Verify payment order" description={`Verify order ${order.orderReference} for ${order.userDisplayName ?? "this user"}? This will activate their subscription.`} confirmLabel="Verify" isLoading={approveMutation.isPending}>
        <div className="mt-3">
          <label className="block text-xs font-medium text-[#666672] mb-1">Note (optional)</label>
          <textarea value={approveNote} onChange={(e) => setApproveNote(e.target.value)} placeholder="Add a note about this verification…" rows={2} className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none" />
        </div>
      </ConfirmDialog>

      <ConfirmDialog open={rejectOpen} onClose={() => { setRejectOpen(false); setRejectReason(""); }} onConfirm={() => rejectMutation.mutate()} title="Reject payment order" description={`Reject order ${order.orderReference}? The user will be notified.`} confirmLabel="Reject" variant="danger" isLoading={rejectMutation.isPending}>
        <div className="mt-3">
          <label className="block text-xs font-medium text-[#666672] mb-1">Reason (optional)</label>
          <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Add a reason for rejection…" rows={2} className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none" />
        </div>
      </ConfirmDialog>

      {refundOpen && (
        <RefundOrderDialog
          open={refundOpen}
          onClose={() => setRefundOpen(false)}
          orderId={order.id}
          amountMinorUnits={order.expectedAmountMinorUnits}
          currency={order.currency}
          orderReference={order.orderReference}
          userDisplayName={order.userDisplayName}
        />
      )}
    </div>
  );
}
