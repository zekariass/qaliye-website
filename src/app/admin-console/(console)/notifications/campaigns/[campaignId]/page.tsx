"use client";

import { use, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import { NavigationPayloadEditor, validateNavigationPayload } from "@/components/admin/notifications/NavigationPayloadEditor";
import { AudienceDefinitionEditor, validateAudienceDefinition } from "@/components/admin/notifications/AudienceDefinitionEditor";
import { InternalApiError, parseInternalApiError, parseValidationFieldErrors } from "@/lib/admin/errors";
import type { NotificationCampaign } from "@/lib/admin/adapters";
import { ChevronLeft, Play, XCircle, Calendar, RotateCcw, Pencil, X, Check, Plus } from "lucide-react";
import Link from "next/link";

// ── Shared styles ─────────────────────────────────────────────────────────────
const INPUT = "w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0 gap-4">
      <span className="text-sm text-[#666672] w-44 shrink-0">{label}</span>
      <span className="text-sm text-[#17171B] text-right break-all">{value ?? "—"}</span>
    </div>
  );
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  return (
    <span className={`text-xs tabular-nums ${len > max ? "text-[#C63B4E]" : "text-[#666672]"}`}>{len}/{max}</span>
  );
}

// ── Schedule dialog ───────────────────────────────────────────────────────────
function ScheduleDialog({
  open, onClose, onConfirm, isLoading,
}: {
  open: boolean; onClose: () => void; onConfirm: (scheduledAt: string) => void; isLoading: boolean;
}) {
  const [value, setValue] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-semibold text-[#17171B] mb-1">Schedule Campaign</h2>
        <p className="text-sm text-[#666672] mb-4">Choose when to send this campaign.</p>
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] mb-4"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">
            Cancel
          </button>
          <button
            type="button"
            disabled={!value || isLoading}
            onClick={() => onConfirm(new Date(value).toISOString())}
            className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Scheduling…" : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit form ─────────────────────────────────────────────────────────────────
const editSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title must be at most 120 characters"),
  body: z.string().min(1, "Body is required").max(300, "Body must be at most 300 characters"),
  navigationPayload: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      const err = validateNavigationPayload(val ?? "");
      if (err) ctx.addIssue({ code: "custom", message: err });
    }),
  audienceDefinition: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      const err = validateAudienceDefinition(val ?? "");
      if (err) ctx.addIssue({ code: "custom", message: err });
    }),
});
type EditValues = z.infer<typeof editSchema>;

function EditForm({
  campaign, onSuccess, onCancel, signInPath,
}: {
  campaign: NotificationCampaign; onSuccess: () => void; onCancel: () => void; signInPath: string;
}) {
  const router = useRouter();
  const navInit = campaign.navigationPayload && Object.keys(campaign.navigationPayload).length > 0
    ? JSON.stringify(campaign.navigationPayload, null, 2)
    : "{}";

  const { register, handleSubmit, watch, control, setError, formState: { errors } } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: campaign.title,
      body: campaign.body,
      navigationPayload: navInit,
      audienceDefinition: campaign.audienceDefinition && Object.keys(campaign.audienceDefinition).length > 0
        ? JSON.stringify(campaign.audienceDefinition, null, 2)
        : "{}",
    },
  });

  const titleValue = watch("title") ?? "";
  const bodyValue = watch("body") ?? "";

  const mutation = useMutation({
    mutationFn: async (values: EditValues) => {
      const navStr = values.navigationPayload?.trim();
      const audStr = values.audienceDefinition?.trim();
      const payload: Record<string, unknown> = { title: values.title, body: values.body };
      payload.navigationPayload = navStr && navStr !== "{}" ? JSON.parse(navStr) : {};
      payload.audienceDefinition = audStr ? JSON.parse(audStr) : {};
      const res = await fetch(`/api/internal-admin/notification-campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json();
    },
    onSuccess: () => { toast.success("Campaign updated"); onSuccess(); },
    onError: (err: Error) => {
      if (err instanceof InternalApiError) {
        if (err.status === 401) { router.push(signInPath); return; }
        if (err.code === "VALIDATION_ERROR") {
          const fieldErrors = parseValidationFieldErrors(err.message);
          let mapped = 0;
          for (const [field, message] of Object.entries(fieldErrors)) {
            setError(field as keyof EditValues, { message });
            mapped++;
          }
          if (mapped > 0) { toast.error("Please fix the highlighted fields."); return; }
        }
        if (err.code === "FORBIDDEN") { toast.error("You do not have permission to perform this action."); return; }
        if (err.code === "CONFLICT") { toast.error(err.message); return; }
      }
      toast.error(err.message);
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-5 mt-4">
      <h3 className="text-sm font-semibold text-[#17171B]">Edit Campaign</h3>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-[#17171B] mb-1.5">Notification Title <span className="text-[#C63B4E]">*</span></label>
        <input {...register("title")} className={INPUT} />
        <div className="flex justify-between mt-1">
          {errors.title && <p className="text-xs text-[#C63B4E]">{errors.title.message}</p>}
          <span className="ml-auto"><CharCounter value={titleValue} max={120} /></span>
        </div>
      </div>

      {/* Body */}
      <div>
        <label className="block text-xs font-medium text-[#17171B] mb-1.5">Notification Body <span className="text-[#C63B4E]">*</span></label>
        <textarea {...register("body")} rows={3} className={`${INPUT} resize-none`} />
        <div className="flex justify-between mt-1">
          {errors.body && <p className="text-xs text-[#C63B4E]">{errors.body.message}</p>}
          <span className="ml-auto"><CharCounter value={bodyValue} max={300} /></span>
        </div>
      </div>

      {/* Navigation Payload — full structured editor */}
      <div>
        <p className="text-xs font-medium text-[#17171B] mb-1.5">Navigation Payload</p>
        <p className="text-xs text-[#666672] mb-3">Choose which screen the app opens when a user taps this notification.</p>
        <Controller
          name="navigationPayload"
          control={control}
          render={({ field, fieldState }) => (
            <NavigationPayloadEditor
              value={field.value ?? "{}"}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Audience Definition — structured editor */}
      <div>
        <Controller
          name="audienceDefinition"
          control={control}
          render={({ field, fieldState }) => (
            <AudienceDefinitionEditor
              value={field.value ?? "{}"}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex items-center gap-1 px-3 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg">
          <X className="h-3.5 w-3.5" /> Discard
        </button>
        <button type="submit" disabled={mutation.isPending} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> {mutation.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  const adminConsolePath = pathname.replace(/\/notifications\/campaigns\/.*$/, "");
  const signInPath = `${adminConsolePath}/sign-in`;
  const queryClient = useQueryClient();

  const [confirmAction, setConfirmAction] = useState<"start" | "cancel" | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const { data: campaign, isLoading, isError, error, refetch } = useQuery<NotificationCampaign>({
    queryKey: adminKeys.notificationCampaigns.detail(campaignId),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/notification-campaigns/${campaignId}`);
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json();
    },
  });

  // Redirect to sign-in on 401 from the query
  useEffect(() => {
    if (error instanceof InternalApiError && error.status === 401) {
      router.push(signInPath);
    }
  }, [error, router, signInPath]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: adminKeys.notificationCampaigns.detail(campaignId) });
    queryClient.invalidateQueries({ queryKey: adminKeys.notificationCampaigns.list({}) });
  }

  const actionMutation = useMutation({
    mutationFn: async (action: "start" | "cancel") => {
      const res = await fetch(`/api/internal-admin/notification-campaigns/${campaignId}/${action}`, { method: "POST" });
      if (!res.ok) throw await parseInternalApiError(res);
    },
    onSuccess: (_, action) => {
      toast.success(action === "start" ? "Campaign started" : "Campaign cancelled");
      invalidate();
      setConfirmAction(null);
    },
    onError: (err: Error) => {
      if (err instanceof InternalApiError) {
        if (err.status === 401) { router.push(signInPath); return; }
        if (err.code === "FORBIDDEN") { toast.error("You do not have permission to perform this action."); return; }
      }
      toast.error(err.message);
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async (scheduledAt: string) => {
      const res = await fetch(`/api/internal-admin/notification-campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SCHEDULED", scheduledAt }),
      });
      if (!res.ok) throw await parseInternalApiError(res);
    },
    onSuccess: () => { toast.success("Campaign scheduled"); invalidate(); setShowSchedule(false); },
    onError: (err: Error) => {
      if (err instanceof InternalApiError) {
        if (err.status === 401) { router.push(signInPath); return; }
        if (err.code === "FORBIDDEN") { toast.error("You do not have permission to perform this action."); return; }
      }
      toast.error(err.message);
    },
  });

  const revertMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/notification-campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DRAFT" }),
      });
      if (!res.ok) throw await parseInternalApiError(res);
    },
    onSuccess: () => { toast.success("Campaign reverted to draft"); invalidate(); },
    onError: (err: Error) => {
      if (err instanceof InternalApiError) {
        if (err.status === 401) { router.push(signInPath); return; }
        if (err.code === "FORBIDDEN") { toast.error("You do not have permission to perform this action."); return; }
      }
      toast.error(err.message);
    },
  });

  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !campaign) return <ErrorState onRetry={refetch} />;

  const isEditable = campaign.status === "DRAFT" || campaign.status === "SCHEDULED";
  const isLocked = campaign.status === "SENDING" || campaign.status === "COMPLETED" || campaign.status === "CANCELLED";
  const canStart = campaign.status === "DRAFT" || campaign.status === "SCHEDULED";
  const canSchedule = campaign.status === "DRAFT";
  const canRevert = campaign.status === "SCHEDULED";
  const canCancel = campaign.status === "DRAFT" || campaign.status === "SCHEDULED" || campaign.status === "SENDING";

  const navPayloadJson =
    campaign.navigationPayload && Object.keys(campaign.navigationPayload).length > 0
      ? JSON.stringify(campaign.navigationPayload, null, 2)
      : "{}";

  return (
    <div className="max-w-2xl">
      {/* Back link + create-new action */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href={`${adminConsolePath}/notifications/campaigns`} className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]">
          <ChevronLeft className="h-4 w-4" /> Back to Campaigns
        </Link>
        <Link
          href={`${adminConsolePath}/notifications/campaigns/new`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg"
        >
          <Plus className="h-4 w-4" /> New Campaign
        </Link>
      </div>

      {/* Header + action buttons */}
      <PageHeader
        title={campaign.title}
        badge={<StatusBadge status={campaign.status} />}
        actions={
          <div className="flex flex-wrap gap-2">
            {isEditable && (
              <button type="button" onClick={() => setShowEdit((v) => !v)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#17171B] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl">
                <Pencil className="h-3.5 w-3.5" /> {showEdit ? "Close editor" : "Edit"}
              </button>
            )}
            {canSchedule && (
              <button type="button" onClick={() => setShowSchedule(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#17171B] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl">
                <Calendar className="h-4 w-4" /> Schedule
              </button>
            )}
            {canRevert && (
              <button type="button" onClick={() => revertMutation.mutate()} disabled={revertMutation.isPending} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#17171B] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl disabled:opacity-50">
                <RotateCcw className="h-4 w-4" /> Revert to Draft
              </button>
            )}
            {canStart && (
              <button type="button" onClick={() => setConfirmAction("start")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#16815D] hover:bg-[#15694E] rounded-xl">
                <Play className="h-4 w-4" /> Start Now
              </button>
            )}
            {canCancel && (
              <button type="button" onClick={() => setConfirmAction("cancel")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl">
                <XCircle className="h-4 w-4" /> Cancel
              </button>
            )}
          </div>
        }
      />

      {/* Edit form — shown for DRAFT / SCHEDULED when user clicks Edit */}
      {showEdit && isEditable && (
        <EditForm
          campaign={campaign}
          onSuccess={() => { invalidate(); setShowEdit(false); }}
          onCancel={() => setShowEdit(false)}
          signInPath={signInPath}
        />
      )}

      {/* Read-only details — shown when not in edit mode */}
      {!showEdit && (
        <>
          {/* Compact info rows */}
          <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 mt-4">
            <Row label="Campaign Key" value={<span className="font-mono text-xs">{campaign.campaignKey ?? "—"}</span>} />
            <Row label="Status" value={<StatusBadge status={campaign.status} />} />
            <Row label="Title" value={campaign.title} />
            <Row label="Body" value={<span className="whitespace-pre-wrap">{campaign.body}</span>} />
            <Row label="Scheduled At" value={campaign.scheduledAt ? formatDateTime(campaign.scheduledAt) : "—"} />
            <Row label="Started At" value={campaign.startedAt ? formatDateTime(campaign.startedAt) : "—"} />
            <Row label="Completed At" value={campaign.completedAt ? formatDateTime(campaign.completedAt) : "—"} />
            <Row label="Cancelled At" value={campaign.cancelledAt ? formatDateTime(campaign.cancelledAt) : "—"} />
            <Row label="Created" value={formatDateTime(campaign.createdAt)} />
          </div>

          {/* Navigation Payload — full read-only editor */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-[#17171B] mb-3">Navigation Payload</p>
            <NavigationPayloadEditor
              value={navPayloadJson}
              onChange={() => { /* read-only */ }}
              readOnly={true}
              lockedStatus={isLocked ? campaign.status : undefined}
            />
          </div>

          {/* Audience Definition — full read-only editor */}
          <div className="mt-6">
            <AudienceDefinitionEditor
              value={
                campaign.audienceDefinition && Object.keys(campaign.audienceDefinition).length > 0
                  ? JSON.stringify(campaign.audienceDefinition, null, 2)
                  : "{}"
              }
              onChange={() => { /* read-only */ }}
              readOnly={true}
              lockedStatus={isLocked ? campaign.status : undefined}
            />
          </div>
        </>
      )}

      {/* Confirm start / cancel */}
      {confirmAction && (
        <ConfirmDialog
          open={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => actionMutation.mutate(confirmAction)}
          title={confirmAction === "start" ? "Start campaign" : "Cancel campaign"}
          description={confirmAction === "start"
            ? `Send "${campaign.title}" to all targeted users now?`
            : `Cancel "${campaign.title}"? This cannot be undone.`}
          confirmLabel={confirmAction === "start" ? "Start" : "Cancel campaign"}
          variant={confirmAction === "cancel" ? "danger" : "default"}
          isLoading={actionMutation.isPending}
        />
      )}

      {/* Schedule date-picker dialog */}
      <ScheduleDialog
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        onConfirm={(scheduledAt) => scheduleMutation.mutate(scheduledAt)}
        isLoading={scheduleMutation.isPending}
      />
    </div>
  );
}
