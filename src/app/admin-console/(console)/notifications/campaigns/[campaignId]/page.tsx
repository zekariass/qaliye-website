"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import type { NotificationCampaign } from "@/lib/admin/adapters";
import { ChevronLeft, Play, XCircle } from "lucide-react";
import Link from "next/link";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-sm text-[#666672] w-40 shrink-0">{label}</span>
      <span className="text-sm text-[#17171B] text-right">{value ?? "—"}</span>
    </div>
  );
}

export default function CampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/notifications\/campaigns\/.*$/, "");
  const queryClient = useQueryClient();

  const [action, setAction] = useState<"start" | "cancel" | null>(null);

  const { data: campaign, isLoading, isError, refetch } = useQuery<NotificationCampaign>({
    queryKey: adminKeys.notificationCampaigns.detail(campaignId),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/notification-campaigns/${campaignId}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const actionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/notification-campaigns/${campaignId}/${action}`, { method: "POST" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Action failed"); }
    },
    onSuccess: () => {
      toast.success(action === "start" ? "Campaign started" : "Campaign cancelled");
      queryClient.invalidateQueries({ queryKey: adminKeys.notificationCampaigns.detail(campaignId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.notificationCampaigns.list({}) });
      setAction(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !campaign) return <ErrorState onRetry={refetch} />;

  const canStart = campaign.status === "DRAFT";
  const canCancel = campaign.status === "RUNNING" || campaign.status === "SCHEDULED";

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link href={`${adminConsolePath}/notifications/campaigns`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Campaigns
        </Link>
      </div>

      <PageHeader
        title={campaign.name ?? campaign.title}
        badge={<StatusBadge status={campaign.status} />}
        actions={
          <div className="flex gap-2">
            {canStart && (
              <button type="button" onClick={() => setAction("start")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#16815D] hover:bg-[#15694E] rounded-xl">
                <Play className="h-4 w-4" /> Start Campaign
              </button>
            )}
            {canCancel && (
              <button type="button" onClick={() => setAction("cancel")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl">
                <XCircle className="h-4 w-4" /> Cancel
              </button>
            )}
          </div>
        }
      />

      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        <Row label="Status" value={<StatusBadge status={campaign.status} />} />
        <Row label="Title" value={campaign.title} />
        <Row label="Body" value={<span className="text-sm">{campaign.body}</span>} />
        <Row label="Target Audience" value={campaign.targetAudience ?? "All users"} />
        <Row label="Scheduled At" value={campaign.scheduledAt ? formatDateTime(campaign.scheduledAt) : "—"} />
        <Row label="Sent Count" value={campaign.sentCount?.toLocaleString() ?? "—"} />
        <Row label="Created" value={formatDateTime(campaign.createdAt)} />
      </div>

      {action && (
        <ConfirmDialog
          open={true}
          onClose={() => setAction(null)}
          onConfirm={() => actionMutation.mutate()}
          title={action === "start" ? "Start campaign" : "Cancel campaign"}
          description={action === "start"
            ? `Send "${campaign.name}" to all targeted users?`
            : `Cancel "${campaign.name}"? This cannot be undone.`}
          confirmLabel={action === "start" ? "Start" : "Cancel campaign"}
          variant={action === "cancel" ? "danger" : "default"}
          isLoading={actionMutation.isPending}
        />
      )}
    </div>
  );
}
