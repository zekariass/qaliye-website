"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatRelative, formatDateTime } from "@/lib/admin/dates";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import type { IdentityReview } from "@/lib/admin/adapters";
import { ShieldCheck, ShieldX, ZoomIn, X, User } from "lucide-react";

const PAGE_SIZE = 20;

interface ReviewDialogState {
  review: IdentityReview;
  action: "approve" | "reject";
}

function ReviewModal({
  review,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  review: IdentityReview;
  onClose: () => void;
  onApprove: (note?: string) => void;
  onReject: (note?: string) => void;
  isLoading: boolean;
}) {
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5EA]">
          <div>
            <h2 className="text-base font-semibold text-[#17171B]">Identity Review</h2>
            <p className="text-sm text-[#666672] mt-0.5">
              {review.displayName ?? "Unknown user"} — {review.gender ?? "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#666672] hover:text-[#17171B] hover:bg-[#F7F7FA] rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-[#666672] mb-2 uppercase tracking-wider">Selfie</p>
            <div className="aspect-[3/4] bg-[#F7F7FA] rounded-xl overflow-hidden border border-[#E5E5EA]">
              {review.selfiePath ? (
                <img
                  src={review.selfiePath}
                  alt="User selfie"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User className="h-16 w-16 text-[#D1D5DB]" />
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[#666672] mb-2 uppercase tracking-wider">Profile Photo</p>
            <div className="aspect-[3/4] bg-[#F7F7FA] rounded-xl overflow-hidden border border-[#E5E5EA]">
              {review.profilePhotoPath ? (
                <img
                  src={review.profilePhotoPath}
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User className="h-16 w-16 text-[#D1D5DB]" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 pb-2">
          <label className="block text-xs font-medium text-[#17171B] mb-1.5">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the audit log..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 p-5 pt-3 border-t border-[#E5E5EA]">
          <CopyIdButton id={review.userId} label="User ID" />
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => onReject(note.trim() || undefined)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldX className="h-4 w-4" />
            Reject
          </button>
          <button
            type="button"
            onClick={() => onApprove(note.trim() || undefined)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#16815D] hover:bg-[#15694E] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="h-4 w-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IdentityReviewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page") ?? "1");
  const [selected, setSelected] = useState<IdentityReview | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ReviewDialogState | null>(null);
  const [pendingNote, setPendingNote] = useState<string | undefined>();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.identityReviews.list({ page }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (page > 1) qs.set("page", String(page));
      qs.set("pageSize", String(PAGE_SIZE));
      const res = await fetch(`/api/internal-admin/identity-reviews?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json() as Promise<{ items: IdentityReview[]; total: number; page: number; page_size: number }>;
    },
    staleTime: 30_000,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ review, action, note }: { review: IdentityReview; action: "approve" | "reject"; note?: string }) => {
      const res = await fetch(`/api/internal-admin/identity-reviews/${review.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? `${action} failed`);
      }
      return { action };
    },
    onSuccess: ({ action }) => {
      toast.success(`Review ${action}d successfully`);
      queryClient.invalidateQueries({ queryKey: adminKeys.identityReviews.list({}) });
      setSelected(null);
      setConfirmDialog(null);
      setPendingNote(undefined);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const columns: Column<IdentityReview>[] = [
    {
      key: "user",
      header: "User",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#EDE2FF] flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#17171B]">{r.displayName ?? "Unknown"}</p>
            <CopyIdButton id={r.userId} />
          </div>
        </div>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      cell: (r) => (
        <span className="text-sm text-[#666672]">{r.gender ?? "—"}</span>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      cell: (r) => (
        <span className="text-sm text-[#666672]" title={formatDateTime(r.createdAt)}>
          {formatRelative(r.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <button
          type="button"
          onClick={() => setSelected(r)}
          className="flex items-center gap-1.5 text-xs text-[#7C3AED] hover:underline"
        >
          <ZoomIn className="h-3.5 w-3.5" />
          Review
        </button>
      ),
      className: "w-20",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Identity Reviews"
        description="Review and approve or reject user identity verifications"
        badge={
          total > 0 ? (
            <span className="px-2 py-0.5 text-xs font-medium bg-[#FFFBEB] text-[#B7791F] border border-[#FDE68A] rounded-full">
              {total} pending
            </span>
          ) : undefined
        }
      />

      <AdminDataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        keyExtractor={(r) => r.id}
        emptyTitle="No pending reviews"
        emptyDescription="All identity verification requests have been processed."
        pagination={
          totalPages > 1
            ? { page, totalPages, totalItems: total, pageSize: PAGE_SIZE, onChange: (p) => updateParams({ page: String(p) }) }
            : undefined
        }
      />

      {selected && (
        <ReviewModal
          review={selected}
          onClose={() => setSelected(null)}
          onApprove={(note) => {
            setPendingNote(note);
            setConfirmDialog({ review: selected, action: "approve" });
          }}
          onReject={(note) => {
            setPendingNote(note);
            setConfirmDialog({ review: selected, action: "reject" });
          }}
          isLoading={reviewMutation.isPending}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          open={true}
          onClose={() => { setConfirmDialog(null); setPendingNote(undefined); }}
          onConfirm={() => reviewMutation.mutate({ review: confirmDialog.review, action: confirmDialog.action, note: pendingNote })}
          title={confirmDialog.action === "approve" ? "Approve identity verification" : "Reject identity verification"}
          description={
            confirmDialog.action === "approve"
              ? `Approve the identity verification for ${confirmDialog.review.displayName ?? "this user"}? This will mark the user as verified.`
              : `Reject the identity verification for ${confirmDialog.review.displayName ?? "this user"}? The user will need to resubmit.`
          }
          confirmLabel={confirmDialog.action === "approve" ? "Approve" : "Reject"}
          variant={confirmDialog.action === "approve" ? "default" : "danger"}
          isLoading={reviewMutation.isPending}
        />
      )}
    </div>
  );
}
