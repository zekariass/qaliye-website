"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDate, formatDateTime } from "@/lib/admin/dates";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import {
  DecisionBadge,
  IntroStatusBadge,
} from "@/components/admin/matchmaking/MmStatusBadges";
import { PersonInline } from "@/components/admin/matchmaking/PersonCard";
import {
  asPage,
  INTRO_STATUSES,
  normIntroductionRow,
  normStats,
  type IntroductionRow,
} from "@/lib/admin/matchmaking-types";
import { RefreshCw, Search } from "lucide-react";

const PAGE_SIZE = 50;
const STATUS_LABELS: Record<string, string> = {
  PROPOSED: "Proposed",
  MATCHED: "Matched",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export default function IntroductionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");

  const status = (searchParams.get("status") ?? "").toUpperCase();
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  function setParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) setParams({ search: searchInput, page: "0" });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const queryParams = useMemo(() => {
    const p: Record<string, string> = { page: String(page), size: String(PAGE_SIZE) };
    if (status) p.status = status;
    if (search.trim()) p.search = search.trim();
    return p;
  }, [page, status, search]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: adminKeys.matchmaking.introductions.list(queryParams),
    queryFn: async () => {
      const qs = new URLSearchParams(queryParams).toString();
      const res = await fetch(`/api/internal-admin/matchmaking/introductions?${qs}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const raw = asPage<unknown>(await res.json(), PAGE_SIZE);
      return { ...raw, items: raw.items.map(normIntroductionRow) };
    },
    staleTime: 0,
    placeholderData: (prev) => prev,
  });

  const { data: stats } = useQuery({
    queryKey: adminKeys.matchmaking.stats(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/matchmaking/stats", { cache: "no-store" });
      if (!res.ok) return null;
      return normStats(await res.json());
    },
    staleTime: 60_000,
  });

  const items = useMemo(() => {
    const arr = [...(data?.items ?? [])];
    arr.sort((a, b) => {
      const at = a.proposed_at ?? a.created_at ?? "";
      const bt = b.proposed_at ?? b.created_at ?? "";
      return sort === "oldest" ? at.localeCompare(bt) : bt.localeCompare(at);
    });
    return arr;
  }, [data?.items, sort]);

  const total = data?.total ?? null;
  const totalPages =
    total !== null ? Math.max(1, Math.ceil(total / PAGE_SIZE)) : undefined;

  const counts = stats?.introductionsByStatus;
  const tabs = ["", ...INTRO_STATUSES] as const;

  const columns: Column<IntroductionRow>[] = [
    {
      key: "requester",
      header: "Requester",
      cell: (i) =>
        i.requester ? (
          <PersonInline profile={i.requester} />
        ) : (
          <Link
            href={`${adminConsolePath}/matchmaking/requests/${i.requester_request_id}`}
            className="font-mono text-xs text-[#7C3AED] hover:underline"
          >
            {i.requester_request_id.slice(0, 8)}…
          </Link>
        ),
    },
    {
      key: "candidate",
      header: "Candidate",
      cell: (i) =>
        i.candidate ? (
          <PersonInline profile={i.candidate} />
        ) : (
          <Link
            href={`${adminConsolePath}/matchmaking/requests/${i.candidate_request_id}`}
            className="font-mono text-xs text-[#7C3AED] hover:underline"
          >
            {i.candidate_request_id.slice(0, 8)}…
          </Link>
        ),
    },
    {
      key: "overall",
      header: "Overall",
      cell: (i) =>
        i.overall_percentage != null ? (
          <span className="text-sm font-semibold tabular-nums text-[#17171B]">
            {i.overall_percentage}%
          </span>
        ) : (
          <span className="text-sm text-[#9CA3AF]">—</span>
        ),
      className: "w-20",
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => <IntroStatusBadge status={i.status} />,
      className: "w-28",
    },
    {
      key: "requester_decision",
      header: "Requester",
      cell: (i) => <DecisionBadge decision={i.requester_decision} />,
      className: "w-28",
    },
    {
      key: "candidate_decision",
      header: "Candidate",
      cell: (i) => <DecisionBadge decision={i.candidate_decision} />,
      className: "w-28",
    },
    {
      key: "deadline",
      header: "Deadline",
      cell: (i) => (
        <span className="text-sm text-[#666672]" title={formatDateTime(i.decision_expires_at)}>
          {formatDate(i.decision_expires_at)}
        </span>
      ),
    },
    {
      key: "proposed",
      header: "Proposed",
      cell: (i) => (
        <span className="text-sm text-[#666672]" title={formatDateTime(i.proposed_at)}>
          {formatDate(i.proposed_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (i) => (
        <Link
          href={`${adminConsolePath}/matchmaking/introductions/${i.id}`}
          className="text-xs font-medium text-[#7C3AED] hover:underline whitespace-nowrap"
        >
          View
        </Link>
      ),
      className: "w-14",
    },
  ];

  const hasPrev = page > 0;
  const hasNext =
    totalPages !== undefined ? page + 1 < totalPages : items.length === PAGE_SIZE;

  return (
    <div>
      <PageHeader
        title="Introductions"
        description="Monitor matchmaking introductions and user decisions."
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#666672] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        }
      />

      {/* Status tabs */}
      <div className="border-b border-[#E5E5EA] flex gap-1 mb-4 overflow-x-auto">
        {tabs.map((t) => {
          const active = status === t;
          const count = t === "" ? undefined : counts?.[t];
          return (
            <button
              key={t || "all"}
              type="button"
              onClick={() => setParams({ status: t || null, page: "0" })}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                active
                  ? "border-[#7C3AED] text-[#7C3AED]"
                  : "border-transparent text-[#666672] hover:text-[#17171B]"
              }`}
            >
              {t === "" ? "All" : STATUS_LABELS[t] ?? t}
              {count !== undefined && (
                <span className="ml-1.5 text-xs text-[#9CA3AF]">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-56 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by user name or introduction ID…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setParams({ status: e.target.value || null, page: "0" })}
          className="px-3 py-2 text-sm bg-white border border-[#E5E5EA] rounded-xl text-[#666672] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
        >
          <option value="">All statuses</option>
          {INTRO_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setParams({ sort: e.target.value })}
          className="px-3 py-2 text-sm bg-white border border-[#E5E5EA] rounded-xl text-[#666672] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
      </div>

      <AdminDataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        keyExtractor={(i) => i.id}
        emptyTitle="No introductions found"
        emptyDescription="No matchmaking introductions match your current filters."
        pagination={
          totalPages !== undefined && totalPages > 1
            ? {
                page: page + 1,
                totalPages,
                totalItems: total ?? undefined,
                pageSize: PAGE_SIZE,
                onChange: (p) => setParams({ page: String(p - 1) }),
              }
            : undefined
        }
      />

      {totalPages === undefined && (hasPrev || hasNext) && (
        <div className="flex items-center justify-between mt-4 text-sm text-[#666672]">
          <button
            type="button"
            onClick={() => setParams({ page: String(page - 1) })}
            disabled={!hasPrev}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5EA] bg-white disabled:opacity-40 hover:bg-[#F7F7FA]"
          >
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button
            type="button"
            onClick={() => setParams({ page: String(page + 1) })}
            disabled={!hasNext}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5EA] bg-white disabled:opacity-40 hover:bg-[#F7F7FA]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
