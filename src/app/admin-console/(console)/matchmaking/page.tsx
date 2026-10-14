"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDate, formatRelative } from "@/lib/admin/dates";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import {
  RequestStatusBadge,
  IntroStatusBadge,
} from "@/components/admin/matchmaking/MmStatusBadges";
import { PersonInline, personName } from "@/components/admin/matchmaking/PersonCard";
import {
  asPage,
  normIntroductionRow,
  normRequest,
  normStats,
  type IntroductionRow,
  type MmRequest,
} from "@/lib/admin/matchmaking-types";
import {
  HeartHandshake,
  PauseCircle,
  UsersRound,
  CheckCircle2,
  TimerOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const PREVIEW_SIZE = 5;

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5EA]">
      <h2 className="text-sm font-semibold text-[#17171B]">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-xs font-medium text-[#7C3AED] hover:underline"
      >
        View all <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function RequestRow({ r, mm }: { r: MmRequest; mm: string }) {
  return (
    <Link
      href={`${mm}/requests/${r.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7FA] transition-colors"
    >
      <div className="flex-1 min-w-0">
        <PersonInline profile={r.profile} />
      </div>
      <RequestStatusBadge status={r.status} />
      <span className="hidden sm:block text-xs text-[#9CA3AF] w-20 text-right">
        {formatDate(r.created_at)}
      </span>
      <span className="text-xs font-medium text-[#7C3AED] w-14 text-right shrink-0">
        Review →
      </span>
    </Link>
  );
}

function IntroRow({ i, mm }: { i: IntroductionRow; mm: string }) {
  return (
    <Link
      href={`${mm}/introductions/${i.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7FA] transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#17171B] truncate">
          {personName(i.requester)}
          <span className="text-[#9CA3AF] font-normal"> ↔ </span>
          {personName(i.candidate)}
        </p>
      </div>
      <IntroStatusBadge status={i.status} />
      <span className="hidden sm:block text-xs text-[#9CA3AF] w-16 text-right">
        {i.proposed_at ? formatRelative(i.proposed_at) : "—"}
      </span>
    </Link>
  );
}

export default function MatchmakingOverviewPage() {
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");
  const mm = `${adminConsolePath}/matchmaking`;

  const statsQuery = useQuery({
    queryKey: adminKeys.matchmaking.stats(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/matchmaking/stats", { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status}`);
      return normStats(await res.json());
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const openRequestsQuery = useQuery({
    queryKey: adminKeys.matchmaking.requests.list({ status: "OPEN", page: 0, size: PREVIEW_SIZE }),
    queryFn: async () => {
      const res = await fetch(
        `/api/internal-admin/matchmaking/requests?status=OPEN&page=0&size=${PREVIEW_SIZE}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const page = asPage<unknown>(await res.json(), PREVIEW_SIZE);
      return page.items.map(normRequest);
    },
    staleTime: 30_000,
  });

  const proposedQuery = useQuery({
    queryKey: adminKeys.matchmaking.introductions.list({ status: "PROPOSED", page: 0, size: PREVIEW_SIZE }),
    queryFn: async () => {
      const res = await fetch(
        `/api/internal-admin/matchmaking/introductions?status=PROPOSED&page=0&size=${PREVIEW_SIZE}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const page = asPage<unknown>(await res.json(), PREVIEW_SIZE);
      return page.items.map(normIntroductionRow);
    },
    staleTime: 30_000,
  });

  const stats = statsQuery.data;
  const req = stats?.requestsByStatus ?? {};
  const intro = stats?.introductionsByStatus ?? {};

  const kpis = [
    {
      title: "Open",
      value: req["OPEN"] ?? 0,
      description: "Requests",
      icon: <HeartHandshake className="h-5 w-5" />,
      iconBgClass: "bg-[#ECFDF5]",
      iconColorClass: "text-[#16815D]",
      href: `${mm}/requests?status=OPEN`,
    },
    {
      title: "On Hold",
      value: req["ON_HOLD"] ?? 0,
      description: "Requests",
      icon: <PauseCircle className="h-5 w-5" />,
      iconBgClass: "bg-[#FFFBEB]",
      iconColorClass: "text-[#B7791F]",
      href: `${mm}/requests?status=ON_HOLD`,
    },
    {
      title: "Matched",
      value: stats?.totalMatches ?? intro["MATCHED"] ?? req["MATCHED"] ?? 0,
      description: "Matches",
      icon: <UsersRound className="h-5 w-5" />,
      iconBgClass: "bg-[#EDE2FF]",
      iconColorClass: "text-[#6D28D9]",
      href: `${mm}/introductions?status=MATCHED`,
    },
    {
      title: "Completed",
      value: req["COMPLETED"] ?? 0,
      description: "Requests",
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconBgClass: "bg-[#F7F7FA]",
      iconColorClass: "text-[#666672]",
      href: `${mm}/requests?status=COMPLETED`,
    },
    {
      title: "Expired",
      value: req["EXPIRED"] ?? 0,
      description: "Requests",
      icon: <TimerOff className="h-5 w-5" />,
      iconBgClass: "bg-[#F7F7FA]",
      iconColorClass: "text-[#9CA3AF]",
      href: `${mm}/requests?status=EXPIRED`,
    },
    {
      title: "Needs Action",
      value: stats?.awaitingDecisions ?? intro["PROPOSED"] ?? 0,
      description: "Proposals",
      icon: <AlertCircle className="h-5 w-5" />,
      iconBgClass: "bg-[#FFF1F2]",
      iconColorClass: "text-[#C63B4E]",
      href: `${mm}/introductions?status=PROPOSED`,
      alert: true,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Matchmaking"
        description="Manage requests, review candidates and create introductions."
      />

      {statsQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-white border border-[#E5E5EA] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {kpis.map((k) => (
            <MetricCard key={k.title} {...k} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Requests preview */}
        <section className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
          <SectionHeader title="Requests" href={`${mm}/requests?status=OPEN`} />
          {openRequestsQuery.isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#E5E5EA] rounded animate-pulse" />
              ))}
            </div>
          ) : openRequestsQuery.isError ? (
            <ErrorState onRetry={openRequestsQuery.refetch} />
          ) : (openRequestsQuery.data ?? []).length === 0 ? (
            <p className="px-4 py-8 text-sm text-[#9CA3AF] text-center">
              No open requests right now.
            </p>
          ) : (
            <div className="divide-y divide-[#E5E5EA]">
              {openRequestsQuery.data!.map((r) => (
                <RequestRow key={r.id} r={r} mm={mm} />
              ))}
            </div>
          )}
        </section>

        {/* Introductions preview */}
        <section className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
          <SectionHeader title="Introductions" href={`${mm}/introductions?status=PROPOSED`} />
          {proposedQuery.isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#E5E5EA] rounded animate-pulse" />
              ))}
            </div>
          ) : proposedQuery.isError ? (
            <ErrorState onRetry={proposedQuery.refetch} />
          ) : (proposedQuery.data ?? []).length === 0 ? (
            <p className="px-4 py-8 text-sm text-[#9CA3AF] text-center">
              No proposals awaiting decisions.
            </p>
          ) : (
            <div className="divide-y divide-[#E5E5EA]">
              {proposedQuery.data!.map((i) => (
                <IntroRow key={i.id} i={i} mm={mm} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
