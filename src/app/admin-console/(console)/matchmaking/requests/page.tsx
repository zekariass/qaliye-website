"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative } from "@/lib/admin/dates";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import type { MmRequest, Message } from "@/lib/admin/matchmaking-types";
import { RefreshCw } from "lucide-react";

const PAGE_SIZE = 50;

/**
 * Unread badge: latest message seq vs admin_last_read_message_seq.
 * The queue response doesn't carry the latest seq, so we fetch messages
 * after the admin's read cursor — a non-empty array means unread.
 */
function UnreadBadge({ request }: { request: MmRequest }) {
  const adminRead = request.admin_last_read_message_seq ?? 0;
  const { data } = useQuery<Message[]>({
    queryKey: ["mm-unread", request.id, adminRead],
    queryFn: async () => {
      const res = await fetch(
        `/api/internal-admin/matchmaking/requests/${request.id}/messages?afterSeq=${adminRead}`
      );
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  if (!data || data.length === 0) return null;
  return (
    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#C63B4E] text-white text-[10px] font-bold">
      {data.length > 9 ? "9+" : data.length}
    </span>
  );
}

export default function MatchmakingQueuePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? "0");

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, refetch } = useQuery<MmRequest[]>({
    queryKey: adminKeys.matchmaking.requests.list(page, PAGE_SIZE),
    queryFn: async () => {
      const qs = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) });
      const res = await fetch(`/api/internal-admin/matchmaking/requests?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    refetchInterval: 30_000,
  });

  const adminConsolePath = pathname.replace(/\/matchmaking.*$/, "");

  const columns: Column<MmRequest>[] = [
    {
      key: "user",
      header: "User ID",
      cell: (r) => (
        <div className="flex items-center gap-2 min-w-0">
          <CopyIdButton id={r.user_id} />
          <UnreadBadge request={r} />
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status} />,
      className: "w-32",
    },
    {
      key: "contact",
      header: "Contact",
      cell: (r) => (
        <span className="text-sm text-[#666672]">{r.contact_phone ?? "—"}</span>
      ),
    },
    {
      key: "created",
      header: "Created",
      cell: (r) => (
        <span className="text-sm text-[#666672]" title={formatDateTime(r.created_at)}>
          {formatRelative(r.created_at)}
        </span>
      ),
    },
    {
      key: "expires",
      header: "Expires",
      cell: (r) => (
        <span className="text-sm text-[#666672]">{formatDateTime(r.expires_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <Link
          href={`${adminConsolePath}/matchmaking/requests/${r.id}`}
          className="text-xs text-[#7C3AED] hover:underline whitespace-nowrap"
        >
          Open
        </Link>
      ),
      className: "w-16",
    },
  ];

  const hasPrev = page > 0;
  const hasNext = Array.isArray(data) && data.length === PAGE_SIZE;

  return (
    <div>
      <PageHeader
        title="Matchmaking Queue"
        description="OPEN requests awaiting matchmaker action — oldest first"
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#666672] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        keyExtractor={(r) => r.id}
        emptyTitle="Queue is clear"
        emptyDescription="No OPEN matchmaking requests."
      />

      {/* Simple prev/next — list is a bare array with no total count */}
      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between mt-4 text-sm text-[#666672]">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={!hasPrev}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5EA] bg-white disabled:opacity-40 hover:bg-[#F7F7FA]"
          >
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
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
