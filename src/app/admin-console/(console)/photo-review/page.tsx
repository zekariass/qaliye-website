"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatRelative } from "@/lib/admin/dates";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { Camera, ZoomIn, X, CheckCircle, XCircle } from "lucide-react";

interface PhotoItem {
  id: string;
  userId: string;
  displayName?: string;
  imageUrl: string;
  createdAt: string;
  moderationStatus: string;
}

interface PhotoCounts {
  pending?: number;
  manualReview?: number;
  approved?: number;
  rejected?: number;
}

function PhotoViewer({
  photo,
  onClose,
  onApprove,
  onReject,
  approvePending,
  rejectPending,
}: {
  photo: PhotoItem;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  approvePending: boolean;
  rejectPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <button
        type="button"
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="relative aspect-square bg-gray-900 flex items-center justify-center">
            <img
              src={photo.imageUrl}
              alt="User photo for review"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "";
              }}
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#17171B]">
                  {photo.displayName ?? "Unknown user"}
                </p>
                <CopyIdButton id={photo.userId} label="User ID" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${photo.moderationStatus === "MANUAL_REVIEW" ? "bg-[#FFFBEB] text-[#B7791F] border border-[#FDE68A]" : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"}`}>
                  {photo.moderationStatus === "MANUAL_REVIEW" ? "Manual Review" : "Pending"}
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  {formatRelative(photo.createdAt)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onApprove}
                disabled={approvePending || rejectPending}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#16815D] hover:bg-[#15694E] rounded-xl shadow-sm transition-all hover:shadow-md active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <CheckCircle className="h-5 w-5" />
                {approvePending ? "Approving..." : "Approve"}
              </button>
              <button
                type="button"
                onClick={onReject}
                disabled={approvePending || rejectPending}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl shadow-sm transition-all hover:shadow-md active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <XCircle className="h-5 w-5" />
                {rejectPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PhotoReviewPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PhotoItem | null>(null);
  const queryClient = useQueryClient();

  const { data: counts } = useQuery<PhotoCounts>({
    queryKey: adminKeys.moderation.counts(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/moderation/counts");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const { data, isLoading, isError, refetch } = useQuery<{ photos: PhotoItem[] }>({
    queryKey: adminKeys.moderation.reviewQueue({}),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/moderation/review-queue");
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: adminKeys.moderation.reviewQueue({}) });
    queryClient.invalidateQueries({ queryKey: adminKeys.moderation.counts() });
  };

  const approveMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const res = await fetch(`/api/internal-admin/moderation/photos/${photoId}/approve`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? `Approve failed (${res.status})`);
      }
    },
    onSuccess: () => {
      toast.success("Photo approved");
      invalidateAll();
      setSelectedPhoto(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ photoId, reason }: { photoId: string; reason?: string }) => {
      const res = await fetch(`/api/internal-admin/moderation/photos/${photoId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? `Reject failed (${res.status})`);
      }
    },
    onSuccess: () => {
      toast.success("Photo rejected");
      invalidateAll();
      setRejectTarget(null);
      setSelectedPhoto(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const photos = data?.photos ?? [];

  return (
    <div>
      <PageHeader
        title="Photo Review"
        description="Review photos pending moderation"
        badge={
          <div className="flex items-center gap-2">
            {counts?.pending !== undefined && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-full">
                {counts.pending} pending
              </span>
            )}
            {counts?.manualReview !== undefined && counts.manualReview > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[#FFFBEB] text-[#B7791F] border border-[#FDE68A] rounded-full">
                {counts.manualReview} manual review
              </span>
            )}
          </div>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#E5E5EA] rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && photos.length === 0 && (
        <EmptyState
          icon={<Camera className="h-10 w-10" />}
          title="No photos pending review"
          description="All caught up! No photos are currently awaiting moderation."
        />
      )}

      {!isLoading && !isError && photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square bg-[#F7F7FA] rounded-xl overflow-hidden border border-[#E5E5EA] hover:border-[#7C3AED] transition-colors"
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className="absolute inset-0 w-full h-full"
                aria-label="View photo"
              >
                <img
                  src={photo.imageUrl}
                  alt="User photo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="h-8 w-8 text-white drop-shadow" />
                </div>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pointer-events-none">
                <p className="text-xs font-medium text-white truncate">
                  {photo.displayName ?? "Unknown"}
                </p>
                <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-white/20 text-white backdrop-blur-sm">
                  {photo.moderationStatus === "MANUAL_REVIEW" ? "Manual Review" : "Pending"}
                </span>
              </div>
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => approveMutation.mutate(photo.id)}
                  disabled={approveMutation.isPending}
                  className="p-2 rounded-lg bg-white/95 hover:bg-white shadow-md text-[#16815D] transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  aria-label="Approve photo"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRejectTarget(photo)}
                  disabled={rejectMutation.isPending}
                  className="p-2 rounded-lg bg-white/95 hover:bg-white shadow-md text-[#C63B4E] transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  aria-label="Reject photo"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onApprove={() => approveMutation.mutate(selectedPhoto.id)}
          onReject={() => setRejectTarget(selectedPhoto)}
          approvePending={approveMutation.isPending}
          rejectPending={rejectMutation.isPending}
        />
      )}

      {rejectTarget && (
        <ConfirmDialog
          open={true}
          onClose={() => setRejectTarget(null)}
          onConfirm={() => rejectMutation.mutate({ photoId: rejectTarget.id })}
          title="Reject photo"
          description={`Reject this photo from ${rejectTarget.displayName ?? "this user"}? The photo will be marked as rejected and the user will need to upload a new one.`}
          confirmLabel="Reject"
          variant="danger"
          isLoading={rejectMutation.isPending}
        />
      )}
    </div>
  );
}
