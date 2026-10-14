"use client";

import { use, useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ErrorState, EmptyState } from "@/components/admin/tables/EmptyState";
import { CandidateSearchOverrides } from "@/components/admin/matchmaking/CandidateSearchOverrides";
import { CandidateCard } from "@/components/admin/matchmaking/CandidateCard";
import { CandidateDetailsDrawer } from "@/components/admin/matchmaking/CandidateDetailsDrawer";
import {
  asPage,
  normCandidateView,
  normRequestDetail,
  type CandidateMatchView,
  type OverrideParams,
} from "@/lib/admin/matchmaking-types";
import { AlertTriangle, ChevronLeft, Search, UserX } from "lucide-react";
import { CANDIDATE_SELECTION_KEY } from "@/lib/admin/matchmaking-selection";

const PAGE_SIZE = 20;

export default function CandidateSearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");
  const mm = `${adminConsolePath}/matchmaking`;

  const [overrides, setOverrides] = useState<OverrideParams>({});
  const [results, setResults] = useState<CandidateMatchView[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [drawerCandidate, setDrawerCandidate] = useState<CandidateMatchView | null>(null);
  const autoRan = useRef(false);

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

  const searchMutation = useMutation({
    mutationFn: async (args: { overrides: OverrideParams; page: number }) => {
      setSearchError(null);
      const dirty = Object.fromEntries(
        Object.entries(args.overrides).filter(([, v]) => v !== undefined)
      );
      const res = await fetch(
        `/api/internal-admin/matchmaking/requests/${id}/candidate-search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            override_params: dirty,
            page: args.page,
            size: PAGE_SIZE,
          }),
        }
      );
      if (!res.ok) {
        const err = await parseInternalApiError(res);
        if (err.status === 404) {
          setSearchError("Request not found.");
          return null;
        }
        if (err.status === 409) {
          setSearchError("This request is no longer open — candidate search is unavailable.");
          queryClient.invalidateQueries({
            queryKey: adminKeys.matchmaking.requests.detail(id),
          });
          return null;
        }
        if (err.status === 422) {
          setSearchError(err.message);
          return null;
        }
        throw err;
      }
      return asPage<unknown>(await res.json(), PAGE_SIZE);
    },
    onSuccess: (data) => {
      if (!data) {
        setResults([]);
        setTotal(null);
        return;
      }
      setResults(
        data.items
          .map(normCandidateView)
          .filter((c): c is CandidateMatchView => c !== null)
      );
      setTotal(data.total);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Auto-run the default search (no overrides) on first load
  useEffect(() => {
    if (
      detail &&
      detail.request.status === "OPEN" &&
      !autoRan.current &&
      !searchMutation.isPending
    ) {
      autoRan.current = true;
      searchMutation.mutate({ overrides: {}, page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  function runSearch(nextPage = 0) {
    setPage(nextPage);
    searchMutation.mutate({ overrides, page: nextPage });
  }

  function reset() {
    setOverrides({});
    setPage(0);
    searchMutation.mutate({ overrides: {}, page: 0 });
  }

  function selectCandidate(c: CandidateMatchView) {
    try {
      sessionStorage.setItem(CANDIDATE_SELECTION_KEY(id), JSON.stringify(c));
    } catch {
      /* sessionStorage unavailable — the review page falls back */
    }
    router.push(`${mm}/requests/${id}/introductions/new?candidate=${c.request.id}`);
  }

  if (isLoading) return <PageSkeleton rows={6} />;
  if (isError || !detail) return <ErrorState onRetry={refetch} />;

  const requesterName = detail.profile?.display_name ?? "Requester";
  const requesterMeta = [
    detail.profile?.age ? `${detail.profile.age}` : null,
    detail.profile?.city ?? detail.profile?.country_name ?? detail.profile?.country_code,
  ]
    .filter(Boolean)
    .join(" · ");

  const overrideCount = Object.keys(overrides).length;
  const hasPrev = page > 0;
  const hasNext =
    total !== null
      ? (page + 1) * PAGE_SIZE < total
      : (results?.length ?? 0) === PAGE_SIZE;

  return (
    <div>
      <PageHeader
        title="Find Potential Matches"
        description={
          [requesterName, requesterMeta].filter(Boolean).join(" · ") ||
          "Ranked candidates based on compatibility."
        }
        actions={
          <Link
            href={`${mm}/requests/${id}`}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#666672] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Request
          </Link>
        }
      />

      {detail.request.status !== "OPEN" && (
        <div className="mb-4 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-center gap-2 text-sm text-[#B7791F]">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          This request is {detail.request.status.replace(/_/g, " ")} — candidate search is
          only available for OPEN requests.
        </div>
      )}

      {detail.request.status === "OPEN" && (
        <>
          {/* Search overrides */}
          <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#17171B]">Search Overrides</h2>
              <p className="text-xs text-[#9CA3AF]">
                OFF uses the requester&apos;s saved preference — overrides never update it.
              </p>
            </div>

            <CandidateSearchOverrides
              preferences={detail.preferences}
              value={overrides}
              onChange={setOverrides}
            />

            {searchError && (
              <div className="mt-4 p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-lg text-sm text-[#C63B4E]">
                {searchError}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={reset}
                disabled={searchMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-[#666672] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => runSearch(0)}
                disabled={searchMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {searchMutation.isPending ? "Searching…" : "Search Candidates"}
              </button>
            </div>
          </div>

          {/* Results — backend-ranked order, never re-sorted client-side */}
          {searchMutation.isPending && results === null && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-44 bg-white border border-[#E5E5EA] rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {results !== null && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#666672]">
                  <span className="font-semibold text-[#17171B]">
                    {total ?? results.length}
                  </span>{" "}
                  eligible candidate{(total ?? results.length) === 1 ? "" : "s"}
                  {overrideCount > 0 && (
                    <span className="text-[#7C3AED]"> · {overrideCount} override{overrideCount === 1 ? "" : "s"}</span>
                  )}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Sort: Overall compatibility (highest first)
                </p>
              </div>

              {results.length === 0 ? (
                <div className="bg-white border border-[#E5E5EA] rounded-xl">
                  <EmptyState
                    icon={<UserX className="h-10 w-10" />}
                    title="No suitable candidates found"
                    description="Try widening the temporary search overrides."
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((c) => (
                    <CandidateCard
                      key={c.request.id}
                      candidate={c}
                      onViewDetails={() => setDrawerCandidate(c)}
                      onSelect={() => selectCandidate(c)}
                    />
                  ))}
                </div>
              )}

              {(hasPrev || hasNext) && (
                <div className="flex items-center justify-between mt-5 text-sm text-[#666672]">
                  <button
                    type="button"
                    onClick={() => runSearch(page - 1)}
                    disabled={!hasPrev || searchMutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E5EA] bg-white disabled:opacity-40 hover:bg-[#F7F7FA]"
                  >
                    Previous
                  </button>
                  <span>Page {page + 1}</span>
                  <button
                    type="button"
                    onClick={() => runSearch(page + 1)}
                    disabled={!hasNext || searchMutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E5EA] bg-white disabled:opacity-40 hover:bg-[#F7F7FA]"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <CandidateDetailsDrawer
        open={drawerCandidate !== null}
        onClose={() => setDrawerCandidate(null)}
        candidate={drawerCandidate}
        requesterName={requesterName}
        adminConsolePath={adminConsolePath}
        onSelect={(c) => {
          setDrawerCandidate(null);
          selectCandidate(c);
        }}
      />
    </div>
  );
}
