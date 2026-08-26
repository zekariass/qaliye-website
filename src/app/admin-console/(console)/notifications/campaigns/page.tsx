"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative } from "@/lib/admin/dates";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { InternalApiError, parseInternalApiError } from "@/lib/admin/errors";
import type { NotificationCampaign } from "@/lib/admin/adapters";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const PAGE_SIZE = 20;

export default function NotificationCampaignsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const adminConsolePath = pathname.replace(/\/notifications\/campaigns.*$/, "");

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? "";

  const [actionTarget, setActionTarget] = useState<{ id: string; title: string; action: "start" | "cancel" } | null>(null);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) { if (v) params.set(k, v); else params.delete(k); }
    params.set("page", "1"); router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: adminKeys.notificationCampaigns.list({ page, status }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      qs.set("page", String(page - 1)); qs.set("size", String(PAGE_SIZE));
      if (status) qs.set("status", status);
      const res = await fetch(`/api/internal-admin/notification-campaigns?${qs}`);
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json();
    },
    staleTime: 15_000,
  });

  const signInPath = `${adminConsolePath}/sign-in`;

  // Redirect to sign-in on 401 from the query
  useEffect(() => {
    if (error instanceof InternalApiError && error.status === 401) {
      router.push(signInPath);
    }
  }, [error, router, signInPath]);

  const actionMutation = useMutation({
    mutationFn: async () => {
      if (!actionTarget) return;
      const res = await fetch(`/api/internal-admin/notification-campaigns/${actionTarget.id}/${actionTarget.action}`, { method: "POST" });
      if (!res.ok) throw await parseInternalApiError(res);
    },
    onSuccess: () => {
      toast.success(`Campaign ${actionTarget?.action === "start" ? "started" : "cancelled"}`);
      queryClient.invalidateQueries({ queryKey: adminKeys.notificationCampaigns.list({}) });
      setActionTarget(null);
    },
    onError: (err: Error) => {
      if (err instanceof InternalApiError) {
        if (err.status === 401) { router.push(signInPath); return; }
        if (err.code === "FORBIDDEN") { toast.error("You do not have permission to perform this action."); return; }
      }
      toast.error(err.message);
    },
  });

  const campaigns: NotificationCampaign[] = Array.isArray(data?.content) ? data.content : [];

  const columns: Column<NotificationCampaign>[] = [
    { key: "title", header: "Title", cell: (c) => (
      <div>
        <Link href={`${adminConsolePath}/notifications/campaigns/${c.id}`} className="font-medium text-[#17171B] hover:text-[#7C3AED]">{c.title}</Link>
        {c.campaignKey && <p className="text-xs text-[#666672] mt-0.5 font-mono">{c.campaignKey}</p>}
      </div>
    )},
    { key: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
    { key: "scheduled", header: "Scheduled", cell: (c) => <span className="text-sm text-[#666672]">{c.scheduledAt ? formatDateTime(c.scheduledAt) : "—"}</span> },
    { key: "created", header: "Created", cell: (c) => <span className="text-sm text-[#666672]">{formatRelative(c.createdAt)}</span> },
    { key: "actions", header: "", cell: (c) => (
      <div className="flex gap-2">
        {(c.status === "DRAFT" || c.status === "SCHEDULED") && (
          <button type="button" onClick={() => setActionTarget({ id: c.id, title: c.title, action: "start" })} className="text-xs text-[#16815D] hover:underline">Start</button>
        )}
        {(c.status === "DRAFT" || c.status === "SCHEDULED" || c.status === "SENDING") && (
          <button type="button" onClick={() => setActionTarget({ id: c.id, title: c.title, action: "cancel" })} className="text-xs text-[#C63B4E] hover:underline">Cancel</button>
        )}
      </div>
    ), className: "w-28" },
  ];

  return (
    <div>
      <PageHeader
        title="Notification Campaigns"
        actions={
          <Link href={`${adminConsolePath}/notifications/campaigns/new`} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl">
            <Plus className="h-4 w-4" /> New Campaign
          </Link>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={status} onChange={(e) => updateParams({ status: e.target.value })} className="px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none cursor-pointer">
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="SENDING">Sending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <AdminDataTable columns={columns} data={campaigns} isLoading={isLoading} isError={isError} onRetry={refetch} keyExtractor={(c) => c.id} emptyTitle="No campaigns" emptyDescription="Create your first notification campaign." />

      {actionTarget && (
        <ConfirmDialog
          open={true}
          onClose={() => setActionTarget(null)}
          onConfirm={() => actionMutation.mutate()}
          title={actionTarget.action === "start" ? "Start campaign" : "Cancel campaign"}
          description={`${actionTarget.action === "start" ? "Start" : "Cancel"} the campaign "${actionTarget.title}"?${actionTarget.action === "cancel" ? " This cannot be undone." : ""}`}
          confirmLabel={actionTarget.action === "start" ? "Start" : "Cancel campaign"}
          variant={actionTarget.action === "cancel" ? "danger" : "default"}
          isLoading={actionMutation.isPending}
        />
      )}
    </div>
  );
}
