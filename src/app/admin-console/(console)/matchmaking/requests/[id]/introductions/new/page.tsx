"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { PersonCard, personName } from "@/components/admin/matchmaking/PersonCard";
import { CompatibilityScore } from "@/components/admin/matchmaking/CompatibilityScore";
import { CANDIDATE_SELECTION_KEY } from "@/lib/admin/matchmaking-selection";
import {
  normCandidateView,
  normIntroduction,
  normRequestDetail,
  type CandidateMatchView,
} from "@/lib/admin/matchmaking-types";
import { ArrowDownUp, HeartHandshake } from "lucide-react";

export default function CreateIntroductionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");
  const mm = `${adminConsolePath}/matchmaking`;

  const candidateIdParam = searchParams.get("candidate") ?? "";
  const [candidate, setCandidate] = useState<CandidateMatchView | null | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: detail, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.matchmaking.requests.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return normRequestDetail(await res.json());
    },
    staleTime: 0,
  });

  // Restore the selected candidate stashed by the candidate-search page.
  // sessionStorage is unavailable during prerender, so read it after mount.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = sessionStorage.getItem(CANDIDATE_SELECTION_KEY(id));
        if (raw) {
          const parsed = normCandidateView(JSON.parse(raw));
          if (parsed && (!candidateIdParam || parsed.request.id === candidateIdParam)) {
            setCandidate(parsed);
            return;
          }
        }
      } catch {
        /* corrupted stash — fall through */
      }
      setCandidate(null);
    });
  }, [id, candidateIdParam]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!candidate) throw new Error("No candidate selected");
      const body: Record<string, unknown> = {
        requester_request_id: id,
        candidate_request_id: candidate.request.id,
      };
      if (reason.trim()) body.reason = reason.trim();
      const res = await fetch("/api/internal-admin/matchmaking/introductions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw await parseInternalApiError(res);
      return normIntroduction(await res.json());
    },
    onSuccess: (intro) => {
      toast.success("Introduction created — both users have been notified");
      setConfirmOpen(false);
      try {
        sessionStorage.removeItem(CANDIDATE_SELECTION_KEY(id));
      } catch {
        /* ignore */
      }
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.stats() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.matchmaking.requests.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.matchmaking.introductions.forRequest(id),
      });
      router.push(`${mm}/introductions/${intro.id}`);
    },
    onError: (e: Error) => {
      setConfirmOpen(false);
      toast.error(e.message);
    },
  });

  if (isLoading || candidate === undefined) return <PageSkeleton rows={5} />;
  if (isError || !detail) return <ErrorState onRetry={refetch} />;

  if (candidate === null) {
    return (
      <div>
        <PageHeader title="Create Introduction" />
        <ErrorState
          title="No candidate selected"
          description="Pick a candidate from the search results first."
        />
        <div className="text-center">
          <Link
            href={`${mm}/requests/${id}/candidates`}
            className="text-sm font-medium text-[#7C3AED] hover:underline"
          >
            Go to Candidate Search →
          </Link>
        </div>
      </div>
    );
  }

  const requesterName = personName(detail.profile);
  const candidateName = personName(candidate.profile);
  const requesterLocation = detail.profile;
  const score = {
    forward_percentage: candidate.match.forward_percentage,
    reverse_percentage: candidate.match.reverse_percentage,
    overall_percentage: candidate.match.overall_percentage,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Create Introduction"
        description="Review the pairing before sending the introduction."
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-6">
        {/* Pairing */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <PersonCard profile={requesterLocation} title="Requester" />
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-[#F7F2FF] flex items-center justify-center">
              <ArrowDownUp className="h-5 w-5 text-[#7C3AED]" />
            </div>
          </div>
          <PersonCard profile={candidate.profile} title="Candidate" />
        </div>

        <div className="my-6 border-t border-[#E5E5EA]" />

        {/* Compatibility */}
        <CompatibilityScore
          score={score}
          forwardLabel={`${requesterName} → ${candidateName}`}
          reverseLabel={`${candidateName} → ${requesterName}`}
        />

        <div className="my-6 border-t border-[#E5E5EA]" />

        {/* Reason */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">
            Why this introduction?
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Strong alignment on values, family plans and relocation."
            className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none"
          />
          <p className="mt-1 text-xs text-[#9CA3AF]">
            Optional — when supplied, this message is visible to both users.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Link
            href={`${mm}/requests/${id}/candidates`}
            className="px-4 py-2 text-sm font-medium text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
          >
            <HeartHandshake className="h-4 w-4" /> Create Introduction
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => createMutation.mutate()}
        title="Create introduction?"
        description={`${requesterName} ↔ ${candidateName} · Compatibility: ${score.overall_percentage}%. Both users will be notified and asked whether they are interested — the introduction enters the proposal decision window.`}
        confirmLabel="Create Introduction"
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
