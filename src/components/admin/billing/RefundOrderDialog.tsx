"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, AlertTriangle } from "lucide-react";
import { Money } from "@/components/admin/shared/Money";
import { adminKeys } from "@/lib/admin/query-keys";

interface RefundOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  amountMinorUnits: number;
  currency: string;
  orderReference: string;
  userDisplayName?: string;
}

export function RefundOrderDialog({
  open,
  onClose,
  orderId,
  amountMinorUnits,
  currency,
  orderReference,
  userDisplayName,
}: RefundOrderDialogProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/billing/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? err.message ?? `Refund failed (${res.status})`);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(`Refund issued for order ${orderReference}`);
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.orders.list({}) });
      queryClient.invalidateQueries({ queryKey: adminKeys.billing.orders.detail(orderId) });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!open) return null;

  const canConfirm = confirmed === "REFUND" && !mutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mx-4">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1 text-[#666672] hover:text-[#17171B] rounded-lg">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3 mb-5">
          <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F2]">
            <AlertTriangle className="h-5 w-5 text-[#C63B4E]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#17171B]">Issue refund</h2>
            <p className="mt-1 text-sm text-[#666672]">This will reverse the payment and cancel any associated subscription or credits.</p>
          </div>
        </div>

        <div className="bg-[#F7F7FA] rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#666672]">Order</span>
            <span className="font-mono font-medium text-[#17171B]">{orderReference}</span>
          </div>
          {userDisplayName && (
            <div className="flex justify-between">
              <span className="text-[#666672]">User</span>
              <span className="text-[#17171B]">{userDisplayName}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[#E5E5EA] pt-2 mt-2">
            <span className="text-[#666672]">Refund amount</span>
            <Money minorUnits={amountMinorUnits} currency={currency} className="font-semibold text-[#C63B4E]" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Reason <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none"
              placeholder="Reason for refund…"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">
              Type <span className="font-mono font-bold">REFUND</span> to confirm
            </label>
            <input
              type="text"
              value={confirmed}
              onChange={(e) => setConfirmed(e.target.value)}
              placeholder="REFUND"
              className="w-full px-3 py-2 text-sm font-mono border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C63B4E]/30 focus:border-[#C63B4E]"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={mutation.isPending} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">Cancel</button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={!canConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-[#C63B4E] hover:bg-[#B03040] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Processing…" : "Issue refund"}
          </button>
        </div>
      </div>
    </div>
  );
}
