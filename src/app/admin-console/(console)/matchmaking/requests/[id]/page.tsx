"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative } from "@/lib/admin/dates";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import { RequestStatusBadge, IntroStatusBadge } from "@/components/admin/matchmaking/MmStatusBadges";
import { PreferenceSnapshotGrid } from "@/components/admin/matchmaking/PreferenceSnapshotGrid";
import { NotesList } from "@/components/admin/matchmaking/NotesList";
import { MessageThread } from "@/components/admin/matchmaking/MessageThread";
import { CandidateSearchTab } from "@/components/admin/matchmaking/CandidateSearchTab";
import { MatchmakerNotesEditor } from "@/components/admin/matchmaking/MatchmakerNotesEditor";
import { CreateIntroDialog } from "@/components/admin/matchmaking/CreateIntroDialog";
import type { MmRequest, Introduction } from "@/lib/admin/matchmaking-types";
import { ChevronLeft, Trash2 } from "lucide-react";

type Tab = "snapshot" | "notes" | "messages" | "introductions" | "search" | "mm-notes";

const TABS: { key: Tab; label: string }[] = [
  { key: "snapshot", label: "Preferences" },
  { key: "notes", label: "Internal Notes" },
  { key: "messages", label: "Messages" },
  { key: "introductions", label: "Introductions" },
  { key: "search", label: "Candidate Search" },
  { key: "mm-notes", label: "Matchmaker Notes" },
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-xs text-[#666672] shrink-0 w-44">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");

  const [tab, setTab] = useState<Tab>("snapshot");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [prefilledCandidateId, setPrefilledCandidateId] = useState("");

  const { data: request, isLoading, isError, refetch } = useQuery<MmRequest>({
    queryKey: adminKeys.matchmaking.requests.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${id}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    refetchInterval: 30_000,
  });

  const { data: introductions = [] } = useQuery<Introduction[]>({
    queryKey: adminKeys.matchmaking.introductions.forRequest(id),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${id}/introductions`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: tab === "introductions",
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await parseInternalApiError(res);
        if (err.status === 409) {
          // State already moved — re-fetch
          await queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.requests.detail(id) });
        }
        throw err;
      }
    },
    onSuccess: () => {
      toast.success("Request cancelled (intro/call cascade applied)");
      setCancelOpen(false);
      // Invalidate everything touched by cancel cascade
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.requests.list(0, 50) });
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.requests.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.introductions.forRequest(id) });
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setCancelOpen(false);
    },
  });

  if (isLoading) return <PageSkeleton rows={6} />;
  if (isError || !request) return <ErrorState onRetry={refetch} />;

  const isTerminal = ["COMPLETED", "CANCELLED", "EXPIRED"].includes(request.status);
  const canCancel = !isTerminal;

  function openIntroduce(candidateRequestId: string) {
    setPrefilledCandidateId(candidateRequestId);
    setIntroOpen(true);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-4">
        <Link
          href={`${adminConsolePath}/matchmaking/requests`}
          className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Queue
        </Link>
      </div>

      <PageHeader
        title="Matchmaking Request"
        badge={<RequestStatusBadge status={request.status} />}
        actions={
          canCancel ? (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl"
            >
              <Trash2 className="h-4 w-4" /> Cancel Request
            </button>
          ) : null
        }
      />

      {/* Header details */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-4 mb-4">
        <Row label="Request ID" value={<CopyIdButton id={request.id} />} />
        <Row label="User ID" value={<CopyIdButton id={request.user_id} />} />
        <Row label="Status" value={<RequestStatusBadge status={request.status} />} />
        <Row label="Created" value={formatDateTime(request.created_at)} />
        <Row
          label="Expires"
          value={
            <span title={formatDateTime(request.expires_at)}>
              {formatRelative(request.expires_at)}
            </span>
          }
        />
        {request.completed_at && (
          <Row label="Completed" value={formatDateTime(request.completed_at)} />
        )}
        {request.cancelled_at && (
          <Row label="Cancelled" value={formatDateTime(request.cancelled_at)} />
        )}
        {request.contact_phone && (
          <Row label="Contact Phone" value={request.contact_phone} />
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E5EA] flex gap-1 mb-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-[#666672] hover:text-[#17171B]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-4">
        {tab === "snapshot" && (
          <div>
            <p className="text-xs text-[#9CA3AF] mb-3">
              Frozen at request creation (v{request.preferences_version}) — may differ from live preferences.
            </p>
            <PreferenceSnapshotGrid snapshot={request.preferences_snapshot} />
          </div>
        )}

        {tab === "notes" && <NotesList requestId={id} />}

        {tab === "messages" && <MessageThread requestId={id} />}

        {tab === "introductions" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-[#17171B]">Introductions</h3>
              {!isTerminal && (
                <button
                  type="button"
                  onClick={() => { setPrefilledCandidateId(""); setIntroOpen(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg"
                >
                  + New Introduction
                </button>
              )}
            </div>
            {introductions.length === 0 && (
              <p className="text-sm text-[#9CA3AF] text-center py-4">No introductions yet.</p>
            )}
            {introductions.map((intro) => (
              <div key={intro.id} className="flex items-center gap-3 p-3 border border-[#E5E5EA] rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#9CA3AF]">ID</p>
                  <p className="text-sm font-mono truncate">{intro.id}</p>
                </div>
                <IntroStatusBadge status={intro.status} />
                <Link
                  href={`${adminConsolePath}/matchmaking/introductions/${intro.id}`}
                  className="text-xs text-[#7C3AED] hover:underline shrink-0"
                >
                  Open
                </Link>
              </div>
            ))}
          </div>
        )}

        {tab === "search" && (
          <CandidateSearchTab
            requestId={id}
            snapshot={request.preferences_snapshot}
            adminConsolePath={adminConsolePath}
            onIntroduce={openIntroduce}
            isDisabled={request.status !== "OPEN"}
          />
        )}

        {tab === "mm-notes" && (
          <MatchmakerNotesEditor
            userId={request.user_id}
            initialNotes={request.preferences_snapshot?.matchmaker_notes}
          />
        )}
      </div>

      {/* Cancel dialog */}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel Matchmaking Request"
        description="This will cancel the request and cascade: active introduction cancelled, scheduled call cancelled, partner request released to OPEN, and video escrow refunded. Continue?"
        confirmLabel="Cancel Request"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />

      {/* Create intro dialog */}
      <CreateIntroDialog
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        requesterRequestId={id}
        prefilledCandidateId={prefilledCandidateId}
        requesterSnapshot={request.preferences_snapshot}
        adminConsolePath={adminConsolePath}
      />
    </div>
  );
}
