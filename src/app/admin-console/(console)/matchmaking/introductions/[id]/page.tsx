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
import { PersonCard, personName } from "@/components/admin/matchmaking/PersonCard";
import { CompatibilityScore } from "@/components/admin/matchmaking/CompatibilityScore";
import { MatchBreakdown } from "@/components/admin/matchmaking/MatchBreakdown";
import { DecisionFlow } from "@/components/admin/matchmaking/DecisionFlow";
import {
  normIntroductionRow,
  normProfile,
  normRequestDetail,
  type IntroductionRow,
  type ProfileCard,
} from "@/lib/admin/matchmaking-types";
import { ArrowDownUp, ChevronLeft, Trash2 } from "lucide-react";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-xs text-[#666672] shrink-0 w-44">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

/** Fallback profile fetch when the introduction payload doesn't embed cards. */
function useRequestProfile(requestId: string | undefined, enabled: boolean) {
  return useQuery<ProfileCard | null>({
    queryKey: ["mm-request-profile", requestId],
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${requestId}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const detail = normRequestDetail(await res.json());
      if (detail.profile) return detail.profile;
      if (!detail.request.user_id) return null;
      const userRes = await fetch(
        `/api/internal-admin/users/${detail.request.user_id}`,
        { cache: "no-store" }
      );
      if (!userRes.ok) return null;
      return normProfile(await userRes.json());
    },
    enabled: enabled && !!requestId,
    staleTime: 60_000,
  });
}

export default function IntroductionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");
  const mm = `${adminConsolePath}/matchmaking`;

  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: intro, isLoading, isError, refetch } = useQuery<IntroductionRow>({
    queryKey: adminKeys.matchmaking.introductions.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/introductions/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return normIntroductionRow(await res.json());
    },
    staleTime: 0,
    refetchInterval: (query) => {
      const data = query.state.data as IntroductionRow | undefined;
      return data?.status === "PROPOSED" ? 30_000 : false;
    },
  });

  const requesterFallback = useRequestProfile(
    intro?.requester_request_id,
    !!intro && !intro.requester
  );
  const candidateFallback = useRequestProfile(
    intro?.candidate_request_id,
    !!intro && !intro.candidate
  );

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/introductions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await parseInternalApiError(res);
        if (err.status === 409) {
          await queryClient.invalidateQueries({
            queryKey: adminKeys.matchmaking.introductions.detail(id),
          });
        }
        throw err;
      }
    },
    onSuccess: () => {
      toast.success("Introduction cancelled — both requests released back to OPEN");
      setCancelOpen(false);
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.introductions.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.stats() });
      if (intro) {
        queryClient.invalidateQueries({
          queryKey: adminKeys.matchmaking.requests.detail(intro.requester_request_id),
        });
        queryClient.invalidateQueries({
          queryKey: adminKeys.matchmaking.requests.detail(intro.candidate_request_id),
        });
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

  const requester = intro.requester ?? requesterFallback.data ?? null;
  const candidate = intro.candidate ?? candidateFallback.data ?? null;
  const requesterName = personName(requester);
  const candidateName = personName(candidate);
  const canCancel = intro.status === "PROPOSED";

  const hasScore =
    intro.overall_percentage != null ||
    intro.forward_percentage != null ||
    intro.reverse_percentage != null;

  return (
    <div className="max-w-4xl">
      <div className="mb-4">
        <Link
          href={`${mm}/introductions`}
          className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]"
        >
          <ChevronLeft className="h-4 w-4" /> Introductions
        </Link>
      </div>

      <PageHeader
        title={`Introduction #${intro.id.slice(0, 8)}`}
        badge={<IntroStatusBadge status={intro.status} />}
        actions={
          canCancel ? (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Cancel Introduction
            </button>
          ) : null
        }
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-6 mb-5">
        {/* The pair */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <Link href={`${mm}/requests/${intro.requester_request_id}`} className="block">
            <PersonCard profile={requester} title="Requester" />
          </Link>
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-[#F7F2FF] flex items-center justify-center">
              <ArrowDownUp className="h-5 w-5 text-[#7C3AED]" />
            </div>
          </div>
          <Link href={`${mm}/requests/${intro.candidate_request_id}`} className="block">
            <PersonCard profile={candidate} title="Candidate" />
          </Link>
        </div>

        {hasScore && (
          <>
            <div className="my-6 border-t border-[#E5E5EA]" />
            <CompatibilityScore
              score={{
                forward_percentage: intro.forward_percentage ?? 0,
                reverse_percentage: intro.reverse_percentage ?? 0,
                overall_percentage:
                  intro.overall_percentage ??
                  Math.round(
                    ((intro.forward_percentage ?? 0) + (intro.reverse_percentage ?? 0)) / 2
                  ),
              }}
              forwardLabel={`${requesterName} → ${candidateName}`}
              reverseLabel={`${candidateName} → ${requesterName}`}
            />
          </>
        )}

        <div className="my-6 border-t border-[#E5E5EA]" />

        {/* Decisions */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-4">
          Decisions
        </p>
        <DecisionFlow
          requesterName={requesterName}
          candidateName={candidateName}
          requesterDecision={intro.requester_decision}
          candidateDecision={intro.candidate_decision}
          status={intro.status}
          decisionExpiresAt={intro.decision_expires_at}
        />

        {intro.reason && (
          <>
            <div className="my-6 border-t border-[#E5E5EA]" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">
              Why this introduction?
            </p>
            <p className="text-sm text-[#17171B] leading-relaxed">{intro.reason}</p>
          </>
        )}

        {intro.match_details && intro.match_details.length > 0 && (
          <>
            <div className="my-6 border-t border-[#E5E5EA]" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
              Matching breakdown
            </p>
            <MatchBreakdown details={intro.match_details} />
          </>
        )}
      </div>

      {/* Record details */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
          Record
        </p>
        <Row label="Introduction ID" value={<CopyIdButton id={intro.id} />} />
        <Row
          label="Requester request"
          value={
            <Link
              href={`${mm}/requests/${intro.requester_request_id}`}
              className="text-[#7C3AED] hover:underline font-mono text-xs"
            >
              {intro.requester_request_id.slice(0, 8)}…
            </Link>
          }
        />
        <Row
          label="Candidate request"
          value={
            <Link
              href={`${mm}/requests/${intro.candidate_request_id}`}
              className="text-[#7C3AED] hover:underline font-mono text-xs"
            >
              {intro.candidate_request_id.slice(0, 8)}…
            </Link>
          }
        />
        <Row label="Status" value={<IntroStatusBadge status={intro.status} />} />
        <Row label="Proposed" value={formatDateTime(intro.proposed_at)} />
        <Row
          label="Decision deadline"
          value={
            intro.decision_expires_at ? (
              <span title={formatDateTime(intro.decision_expires_at)}>
                {formatRelative(intro.decision_expires_at)}
              </span>
            ) : (
              "—"
            )
          }
        />
        {intro.requester_decided_at && (
          <Row label="Requester decided" value={formatDateTime(intro.requester_decided_at)} />
        )}
        {intro.candidate_decided_at && (
          <Row label="Candidate decided" value={formatDateTime(intro.candidate_decided_at)} />
        )}
        {intro.match_id && (
          <Row label="Match ID" value={<CopyIdButton id={intro.match_id} />} />
        )}
        {intro.completed_at && (
          <Row label="Completed" value={formatDateTime(intro.completed_at)} />
        )}
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel this introduction?"
        description={`${requesterName} ↔ ${candidateName}. Neither user will be able to continue with this proposal — both requests will be released back to OPEN.`}
        confirmLabel="Cancel Introduction"
        cancelLabel="Keep"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
