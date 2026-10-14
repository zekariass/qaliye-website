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
import { IntroStatusBadge } from "@/components/admin/matchmaking/MmStatusBadges";
import { VideoCallPanel } from "@/components/admin/matchmaking/VideoCallPanel";
import type { Introduction, VideoCall } from "@/lib/admin/matchmaking-types";
import { ChevronLeft, Trash2, CalendarClock } from "lucide-react";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-xs text-[#666672] shrink-0 w-44">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-500",
    INTERESTED: "bg-[#ECFDF5] text-[#16815D]",
    NOT_INTERESTED: "bg-[#FFF1F2] text-[#C63B4E]",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[decision] ?? "bg-gray-100 text-gray-500"}`}>
      {decision}
    </span>
  );
}

// PROPOSED/MUTUAL_INTEREST polls actively (decisions can change)
const ACTIVE_INTRO_STATUSES = ["PROPOSED", "MUTUAL_INTEREST"];

export default function IntroDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");

  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: intro, isLoading, isError, refetch } = useQuery<Introduction>({
    queryKey: adminKeys.matchmaking.introductions.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/introductions/${id}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    refetchInterval: (query) => {
      const data = query.state.data as Introduction | undefined;
      return data && ACTIVE_INTRO_STATUSES.includes(data.status) ? 15_000 : false;
    },
  });

  const { data: calls = [] } = useQuery<VideoCall[]>({
    queryKey: adminKeys.matchmaking.videoCalls(id),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/introductions/${id}/video-calls`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!intro,
    refetchInterval: intro && ACTIVE_INTRO_STATUSES.includes(intro.status) ? 15_000 : false,
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/introductions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await parseInternalApiError(res);
        if (err.status === 409) {
          await queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.introductions.detail(id) });
        }
        throw err;
      }
    },
    onSuccess: () => {
      toast.success("Introduction cancelled (call/requests cascade applied)");
      setCancelOpen(false);
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.introductions.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.videoCalls(id) });
      if (intro) {
        queryClient.invalidateQueries({
          queryKey: adminKeys.matchmaking.introductions.forRequest(intro.requester_request_id),
        });
        queryClient.invalidateQueries({
          queryKey: adminKeys.matchmaking.introductions.forRequest(intro.candidate_request_id),
        });
      }
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setCancelOpen(false);
    },
  });

  if (isLoading) return <PageSkeleton rows={6} />;
  if (isError || !intro) return <ErrorState onRetry={refetch} />;

  const isTerminal = ["MATCHED", "CANCELLED", "EXPIRED", "DECLINED"].includes(intro.status);
  const canCancel = !isTerminal;
  const isMutualInterest = intro.status === "MUTUAL_INTEREST";
  const arrangingCall = calls.find((c) => c.status === "ARRANGING");

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
        title="Introduction"
        badge={<IntroStatusBadge status={intro.status} />}
        actions={
          canCancel ? (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl"
            >
              <Trash2 className="h-4 w-4" /> Cancel Intro
            </button>
          ) : null
        }
      />

      {/* Mutual interest CTA — a call row now exists in ARRANGING */}
      {isMutualInterest && (
        <div className="mb-4 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-center gap-3">
          <CalendarClock className="h-5 w-5 text-[#B7791F] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#B7791F]">Both parties are interested!</p>
            <p className="text-xs text-[#B7791F] mt-0.5">
              {arrangingCall
                ? "A video call row is waiting in ARRANGING — expand it below and fill in the Arrange form."
                : "Waiting for the video-call row to appear — polling every 15s."}
            </p>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-4 mb-4">
        <Row label="Introduction ID" value={<CopyIdButton id={intro.id} />} />
        <Row
          label="Requester Request"
          value={
            <Link href={`${adminConsolePath}/matchmaking/requests/${intro.requester_request_id}`} className="text-[#7C3AED] hover:underline font-mono text-xs">
              {intro.requester_request_id.slice(0, 8)}…
            </Link>
          }
        />
        <Row
          label="Candidate Request"
          value={
            <Link href={`${adminConsolePath}/matchmaking/requests/${intro.candidate_request_id}`} className="text-[#7C3AED] hover:underline font-mono text-xs">
              {intro.candidate_request_id.slice(0, 8)}…
            </Link>
          }
        />
        <Row label="Status" value={<IntroStatusBadge status={intro.status} />} />
        <Row label="Search Source" value={intro.search_source ?? "—"} />
        <Row label="Proposed At" value={formatDateTime(intro.proposed_at)} />
        <Row
          label="Decision Expires"
          value={
            intro.decision_expires_at ? (
              <span title={formatDateTime(intro.decision_expires_at)}>
                {formatRelative(intro.decision_expires_at)}
              </span>
            ) : "—"
          }
        />
        {intro.match_id && (
          <Row label="Match ID" value={<CopyIdButton id={intro.match_id} />} />
        )}
      </div>

      {/* Decisions */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-4 mb-4">
        <h3 className="text-sm font-semibold text-[#17171B] mb-3">Decisions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#9CA3AF] mb-1">Requester</p>
            <DecisionBadge decision={intro.requester_decision} />
            {intro.requester_decided_at && (
              <p className="text-[10px] text-[#9CA3AF] mt-1">{formatDateTime(intro.requester_decided_at)}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] mb-1">Candidate</p>
            <DecisionBadge decision={intro.candidate_decision} />
            {intro.candidate_decided_at && (
              <p className="text-[10px] text-[#9CA3AF] mt-1">{formatDateTime(intro.candidate_decided_at)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Filter params diff */}
      {(intro.effective_filter_params || intro.admin_override_params) && (
        <div className="bg-white border border-[#E5E5EA] rounded-xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-[#17171B] mb-3">Filter Params</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-[#666672] mb-1">Effective</p>
              <pre className="text-xs bg-[#F7F7FA] p-2 rounded-lg overflow-auto max-h-48">
                {JSON.stringify(intro.effective_filter_params, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium text-[#666672] mb-1">Admin Overrides</p>
              <pre className="text-xs bg-[#F7F7FA] p-2 rounded-lg overflow-auto max-h-48">
                {JSON.stringify(intro.admin_override_params, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Video calls */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#17171B] mb-3">
          Video Calls {calls.length > 0 && <span className="text-[#9CA3AF]">({calls.length})</span>}
        </h3>
        {calls.length === 0 && (
          <div className="p-4 text-sm text-[#9CA3AF] text-center border border-dashed border-[#E5E5EA] rounded-xl">
            No video calls yet
            {isMutualInterest && " — the call row is created automatically on MUTUAL_INTEREST."}.
          </div>
        )}
        <div className="space-y-2">
          {/* API returns newest first */}
          {calls.map((c) => (
            <VideoCallPanel key={c.id} call={c} introId={id} />
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel Introduction"
        description="This will cancel the introduction, cancel the active video call, and release both requests back to OPEN. Continue?"
        confirmLabel="Cancel Introduction"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
