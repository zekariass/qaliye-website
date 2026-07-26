"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative } from "@/lib/admin/dates";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Drawer } from "@/components/admin/shared/Drawer";
import type { AuditLogEntry } from "@/lib/admin/adapters";
import { Search, FileText } from "lucide-react";

const PAGE_SIZE = 25;

function humanizeAction(action: string): string {
  return action.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export default function AuditLogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const action = searchParams.get("action") ?? "";

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) { if (v) params.set(k, v); else params.delete(k); }
    params.set("page", "1"); router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.auditLog.list({ page, search, action }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (page > 1) qs.set("page", String(page));
      qs.set("pageSize", String(PAGE_SIZE));
      if (search) qs.set("search", search);
      if (action) qs.set("action", action);
      const res = await fetch(`/api/internal-admin/audit-log?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    staleTime: 10_000,
  });

  const entries: AuditLogEntry[] = Array.isArray(data?.entries) ? data.entries
    : Array.isArray(data?.content) ? data.content
    : Array.isArray(data) ? data : [];

  const columns: Column<AuditLogEntry>[] = [
    { key: "actor", header: "Actor", cell: (e) => (
      <div>
        <p className="font-medium text-[#17171B] text-sm">{e.actorDisplayName ?? "System"}</p>
        <p className="text-xs font-mono text-[#9CA3AF]">{e.actorId.slice(0, 8)}…</p>
      </div>
    )},
    { key: "action", header: "Action", cell: (e) => (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#F7F7FA] text-[#666672] rounded font-mono">{e.action}</span>
    )},
    { key: "target", header: "Target", cell: (e) => (
      <span className="text-sm text-[#666672]">
        {e.targetType ? `${e.targetType}${e.targetId ? ` #${e.targetId.slice(0, 8)}…` : ""}` : "—"}
      </span>
    )},
    { key: "ip", header: "IP", cell: (e) => <span className="font-mono text-xs text-[#9CA3AF]">{e.ipAddress ?? "—"}</span> },
    { key: "time", header: "Time", cell: (e) => (
      <span className="text-sm text-[#666672]" title={formatDateTime(e.createdAt)}>{formatRelative(e.createdAt)}</span>
    )},
    { key: "actions", header: "", cell: (e) => (
      <button type="button" onClick={() => setSelectedEntry(e)} className="text-xs text-[#7C3AED] hover:underline">Details</button>
    ), className: "w-16" },
  ];

  return (
    <div>
      <PageHeader title="Audit Log" description="All admin actions recorded for compliance" />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <form onSubmit={(e) => { e.preventDefault(); updateParams({ search: searchInput }); }}>
            <input type="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by actor or action…" className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]" />
          </form>
        </div>
        <input type="text" value={action} onChange={(e) => updateParams({ action: e.target.value })} placeholder="Filter by action…" className="px-3 py-2 text-sm font-mono border border-[#E5E5EA] rounded-xl bg-white focus:outline-none w-48" />
      </div>

      <AdminDataTable
        columns={columns}
        data={entries}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        keyExtractor={(e) => e.id}
        emptyTitle="No audit events"
        emptyDescription="Audit events will appear here as admins take actions."
        pagination={data?.totalPages && data.totalPages > 1 ? { page, totalPages: data.totalPages, totalItems: data.totalElements, pageSize: PAGE_SIZE, onChange: (p) => updateParams({ page: String(p) }) } : undefined}
      />

      <Drawer
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry ? humanizeAction(selectedEntry.action) : ""}
        description={selectedEntry ? formatDateTime(selectedEntry.createdAt) : ""}
        width="lg"
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#666672]">Action</span><span className="font-mono text-xs bg-[#F7F7FA] px-2 py-0.5 rounded">{selectedEntry.action}</span></div>
              <div className="flex justify-between"><span className="text-[#666672]">Actor</span><span className="font-medium">{selectedEntry.actorDisplayName ?? selectedEntry.actorId}</span></div>
              {selectedEntry.targetType && <div className="flex justify-between"><span className="text-[#666672]">Target</span><span>{selectedEntry.targetType}{selectedEntry.targetId ? ` — ${selectedEntry.targetId}` : ""}</span></div>}
              {selectedEntry.requestId && <div className="flex justify-between"><span className="text-[#666672]">Request ID</span><span className="font-mono text-xs">{selectedEntry.requestId}</span></div>}
              {selectedEntry.ipAddress && <div className="flex justify-between"><span className="text-[#666672]">IP Address</span><span className="font-mono text-xs">{selectedEntry.ipAddress}</span></div>}
              <div className="flex justify-between"><span className="text-[#666672]">Timestamp</span><span>{formatDateTime(selectedEntry.createdAt)}</span></div>
            </div>

            {selectedEntry.details && Object.keys(selectedEntry.details).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#666672] uppercase tracking-wider mb-2">Details</p>
                <pre className="text-xs font-mono bg-[#F7F7FA] border border-[#E5E5EA] rounded-xl p-3 overflow-auto whitespace-pre-wrap break-all max-h-80">
                  {JSON.stringify(selectedEntry.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
