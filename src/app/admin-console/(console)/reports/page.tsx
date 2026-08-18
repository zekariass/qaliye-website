"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatRelative, formatDateTime } from "@/lib/admin/dates";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import type { ReportItem } from "@/lib/admin/adapters";
import { Flag, CheckCircle, Ban, X } from "lucide-react";

interface ResolveDialogState {
  report: ReportItem;
}

function ResolveDialog({
  report,
  onClose,
  onResolve,
  isLoading,
}: {
  report: ReportItem;
  onClose: () => void;
  onResolve: (resolution: "RESOLVED_NO_ACTION" | "RESOLVED_BANNED", banReason?: string) => void;
  isLoading: boolean;
}) {
  const [resolution, setResolution] = useState<"RESOLVED_NO_ACTION" | "RESOLVED_BANNED">("RESOLVED_NO_ACTION");
  const [banReason, setBanReason] = useState("");

  const canSubmit = resolution === "RESOLVED_NO_ACTION" || (resolution === "RESOLVED_BANNED" && banReason.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl mx-4">
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5EA]">
          <div>
            <h2 className="text-base font-semibold text-[#17171B]">Resolve Report</h2>
            <p className="text-sm text-[#666672] mt-0.5">
              {report.reportType} report against{" "}
              <span className="font-medium text-[#17171B]">
                {report.reportedDisplayName ?? report.reportedUserId}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#666672] hover:text-[#17171B] hover:bg-[#F7F7FA] rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {report.description && (
            <div className="p-3 bg-[#F7F7FA] rounded-lg border border-[#E5E5EA]">
              <p className="text-xs font-medium text-[#666672] mb-1">Description</p>
              <p className="text-sm text-[#17171B]">{report.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-[#17171B] mb-3">Resolution</p>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                resolution === "RESOLVED_NO_ACTION"
                  ? "border-[#7C3AED] bg-[#F3F0FF]"
                  : "border-[#E5E5EA] hover:border-[#7C3AED]/50"
              }`}>
                <input
                  type="radio"
                  name="resolution"
                  value="RESOLVED_NO_ACTION"
                  checked={resolution === "RESOLVED_NO_ACTION"}
                  onChange={() => setResolution("RESOLVED_NO_ACTION")}
                  className="sr-only"
                />
                <CheckCircle className={`h-5 w-5 shrink-0 ${resolution === "RESOLVED_NO_ACTION" ? "text-[#7C3AED]" : "text-[#9CA3AF]"}`} />
                <div>
                  <p className="text-sm font-medium text-[#17171B]">No action required</p>
                  <p className="text-xs text-[#666672]">Mark as reviewed, no further action taken</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                resolution === "RESOLVED_BANNED"
                  ? "border-[#C63B4E] bg-[#FFF1F2]"
                  : "border-[#E5E5EA] hover:border-[#C63B4E]/50"
              }`}>
                <input
                  type="radio"
                  name="resolution"
                  value="RESOLVED_BANNED"
                  checked={resolution === "RESOLVED_BANNED"}
                  onChange={() => setResolution("RESOLVED_BANNED")}
                  className="sr-only"
                />
                <Ban className={`h-5 w-5 shrink-0 ${resolution === "RESOLVED_BANNED" ? "text-[#C63B4E]" : "text-[#9CA3AF]"}`} />
                <div>
                  <p className="text-sm font-medium text-[#17171B]">Ban reported user</p>
                  <p className="text-xs text-[#666672]">Ban the reported user for violating guidelines</p>
                </div>
              </label>
            </div>
          </div>

          {resolution === "RESOLVED_BANNED" && (
            <div>
              <label className="block text-xs font-medium text-[#17171B] mb-1.5">
                Ban reason <span className="text-[#C63B4E]">*</span>
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason for banning..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C63B4E]/30 focus:border-[#C63B4E] resize-none"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-5 pt-0">
          <CopyIdButton id={report.id} label="Report ID" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onResolve(resolution, banReason.trim() || undefined)}
              disabled={!canSubmit || isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                resolution === "RESOLVED_BANNED"
                  ? "bg-[#C63B4E] hover:bg-[#B03040]"
                  : "bg-[#7C3AED] hover:bg-[#6D28D9]"
              }`}
            >
              {isLoading ? "Resolving…" : "Resolve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  HARASSMENT: "Harassment",
  FAKE_PROFILE: "Fake Profile",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  SPAM: "Spam",
  UNDERAGE: "Underage",
  OTHER: "Other",
};

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const status = searchParams.get("status") ?? "PENDING";
  const [resolving, setResolving] = useState<ResolveDialogState | null>(null);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.moderation.reports({ status }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (status) qs.set("status", status);
      const res = await fetch(`/api/internal-admin/moderation/reports?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json() as Promise<{ items: ReportItem[] }>;
    },
    staleTime: 15_000,
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ reportId, resolution, banReason }: { reportId: string; resolution: string; banReason?: string }) => {
      const res = await fetch(`/api/internal-admin/moderation/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution, banReason }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? "Failed to resolve report");
      }
    },
    onSuccess: () => {
      toast.success("Report resolved");
      queryClient.invalidateQueries({ queryKey: adminKeys.moderation.reports({}) });
      setResolving(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = data?.items ?? [];

  const statusFilters = [
    { label: "Pending", value: "PENDING" },
    { label: "No Action", value: "RESOLVED_NO_ACTION" },
    { label: "Resolved Banned", value: "RESOLVED_BANNED" },
  ];

  const columns: Column<ReportItem>[] = [
    {
      key: "type",
      header: "Type",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-[#B7791F] shrink-0" />
          <span className="text-sm font-medium text-[#17171B]">
            {REPORT_TYPE_LABELS[r.reportType] ?? r.reportType}
          </span>
        </div>
      ),
    },
    {
      key: "reported",
      header: "Reported User",
      cell: (r) => (
        <div>
          <p className="text-sm text-[#17171B]">{r.reportedDisplayName ?? "—"}</p>
          <CopyIdButton id={r.reportedUserId} />
        </div>
      ),
    },
    {
      key: "reporter",
      header: "Reporter",
      cell: (r) => (
        <CopyIdButton id={r.reporterUserId} label="Reporter ID" />
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (r) => (
        <span className="text-sm text-[#666672] line-clamp-2">{r.description ?? "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "submitted",
      header: "Submitted",
      cell: (r) => (
        <span className="text-sm text-[#666672]" title={formatDateTime(r.createdAt)}>
          {formatRelative(r.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (r) =>
        r.status === "PENDING" ? (
          <button
            type="button"
            onClick={() => setResolving({ report: r })}
            className="text-xs text-[#7C3AED] hover:underline"
          >
            Resolve
          </button>
        ) : null,
      className: "w-16",
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Reports"
        description="Review and resolve reports filed by users"
      />

      <div className="flex gap-2 mb-4">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => updateParams({ status: f.value })}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              status === f.value
                ? "border-[#7C3AED] bg-[#F3F0FF] text-[#7C3AED] font-medium"
                : "border-[#E5E5EA] text-[#666672] hover:border-[#7C3AED]/50 hover:text-[#17171B]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AdminDataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        keyExtractor={(r) => r.id}
        emptyTitle="No reports found"
        emptyDescription="No user reports match the current filter."
      />

      {resolving && (
        <ResolveDialog
          report={resolving.report}
          onClose={() => setResolving(null)}
          onResolve={(resolution, banReason) =>
            resolveMutation.mutate({ reportId: resolving.report.id, resolution, banReason })
          }
          isLoading={resolveMutation.isPending}
        />
      )}
    </div>
  );
}
