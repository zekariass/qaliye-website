"use client";

import { useState, useEffect } from "react";
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
import { InternalApiError, parseInternalApiError } from "@/lib/admin/errors";
import type { IdentityReview } from "@/lib/admin/adapters";
import { ShieldCheck, ShieldX, ZoomIn, X, User, AlertCircle, Loader2 } from "lucide-react";

const PAGE_SIZE = 20;

interface ReviewDialogState {
  review: IdentityReview;
  action: "approve" | "reject";
}

// ── Image with loading/error states ───────────────────────────────────────────
function ReviewImage({ src, alt, label }: { src?: string; alt: string; label: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (!src) { setStatus("error"); return; }
    setStatus("loading");
  }, [src]);

  return (
    <div>
      <p className="text-xs font-medium text-[#666672] mb-2 uppercase tracking-wider">{label}</p>
      <div className="aspect-[3/4] bg-[#F7F7FA] rounded-xl overflow-hidden border border-[#E5E5EA] relative">
        {src && status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#D1D5DB] animate-spin" />
          </div>
        )}
        {src && status !== "error" && (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        )}
        {(!src || status === "error") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#D1D5DB]">
            {src ? (
              <>
                <AlertCircle className="h-8 w-8" />
                <p className="text-xs text-[#9CA3AF]">Failed to load</p>
              </>
            ) : (
              <User className="h-16 w-16" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Review Modal ──────────────────────────────────────────────────────────────
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

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      {/* Backdrop click target */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
      >
        {/* Header — fixed */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E5EA] shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[#17171B]">Identity Review</h2>
            <p className="text-sm text-[#666672] mt-0.5 truncate">
              {review.displayName ?? "Unknown user"} — {review.gender ?? "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#666672] hover:text-[#17171B] hover:bg-[#F7F7FA] rounded-lg shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Photos — stack on mobile, side-by-side on sm+ */}
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReviewImage
              src={review.selfieUrl}
              alt="User selfie"
              label="Selfie"
            />
            <ReviewImage
              src={review.profilePhotoUrl}
              alt="Profile photo"
              label="Profile Photo"
            />
          </div>

          {/* Note */}
          <div className="px-4 sm:px-5 pb-3">
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the audit log..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none"
            />
          </div>
        </div>

        {/* Footer — fixed */}
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-t border-[#E5E5EA] shrink-0">
          <CopyIdButton id={review.userId} label="User ID" />
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => onReject(note.trim() || undefined)}
            disabled={isLoading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldX className="h-4 w-4" />
            Reject
          </button>
          <button
            type="button"
            onClick={() => onApprove(note.trim() || undefined)}
            disabled={isLoading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-white bg-[#16815D] hover:bg-[#15694E] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="h-4 w-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function IdentityReviewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page") ?? "1");
  const [selected, setSelected] = useState<IdentityReview | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ReviewDialogState | null>(null);
  const [pendingNote, setPendingNote] = useState<string | undefined>();

  const signInPath = `${pathname.replace(/\/identity-reviews.*$/, "")}/sign-in`;

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: adminKeys.identityReviews.list({ page }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (page > 1) qs.set("page", String(page));
      qs.set("pageSize", String(PAGE_SIZE));
      const res = await fetch(`/api/internal-admin/identity-reviews?${qs}`);
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json() as Promise<{ items: IdentityReview[]; total: number; page: number; pageSize: number }>;
    },
    staleTime: 30_000,
  });

  // Redirect on 401
  useEffect(() => {
    if (error instanceof InternalApiError && error.status === 401) {
      router.push(signInPath);
    }
  }, [error, router, signInPath]);

  const reviewMutation = useMutation({
    mutationFn: async ({ review, action, note }: { review: IdentityReview; action: "approve" | "reject"; note?: string }) => {
      const res = await fetch(`/api/internal-admin/identity-reviews/${review.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw await parseInternalApiError(res);
      return { action };
    },
    onSuccess: ({ action }) => {
      toast.success(`Review ${action}d successfully`);
      queryClient.invalidateQueries({ queryKey: adminKeys.identityReviews.list({}) });
      setSelected(null);
      setConfirmDialog(null);
      setPendingNote(undefined);
    },
    onError: (err: Error) => {
      if (err instanceof InternalApiError) {
        if (err.status === 401) { router.push(signInPath); return; }
        if (err.code === "FORBIDDEN") { toast.error("You do not have permission to perform this action."); return; }
      }
      toast.error(err.message);
    },
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
