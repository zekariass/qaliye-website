"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import { CallStatusBadge } from "./MmStatusBadges";
import { ArrangeCallForm } from "./ArrangeCallForm";
import type { VideoCall, JoinSession } from "@/lib/admin/matchmaking-types";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import {
  Play, CheckCircle, XCircle, Video, ChevronDown, ChevronUp, Copy, ExternalLink
} from "lucide-react";

interface Props {
  call: VideoCall;
  introId: string;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-[#F7F7FA] last:border-0">
      <span className="text-xs text-[#9CA3AF] shrink-0 w-36">{label}</span>
      <span className="text-xs text-[#17171B] min-w-0 break-all">{value ?? "—"}</span>
    </div>
  );
}

export function VideoCallPanel({ call, introId }: Props) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [failReason, setFailReason] = useState("");
  const [joinSession, setJoinSession] = useState<JoinSession | null>(null);

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.videoCalls(introId) });
    queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.introductions.detail(introId) });
  }

  async function handleStatusAction(action: "start" | "complete") {
    const res = await fetch(`/api/internal-admin/matchmaking/video-calls/${call.id}/${action}`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await parseInternalApiError(res);
      if (err.status === 409) {
        invalidateAll();
        toast.error(`${err.message} — refreshed`);
        return;
      }
      toast.error(err.message);
      return;
    }
    toast.success(action === "start" ? "Call started" : "Call completed");
    invalidateAll();
  }

  const startMutation = useMutation({
    mutationFn: () => handleStatusAction("start"),
  });

  const completeMutation = useMutation({
    mutationFn: () => handleStatusAction("complete"),
  });

  const failMutation = useMutation({
    mutationFn: async () => {
      // "NO_SHOW" literal → NO_SHOW status; anything else → FAILED
      const reason = failReason.trim() || "FAILED";
      const res = await fetch(`/api/internal-admin/matchmaking/video-calls/${call.id}/fail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        // 404 on already-terminal → treat as "refresh state", not fatal
        if (res.status === 404) return "ALREADY_TERMINAL" as const;
        throw await parseInternalApiError(res);
      }
      // 200 OK — empty body
      return "OK" as const;
    },
    onSuccess: (result) => {
      setFailOpen(false);
      setFailReason("");
      if (result === "ALREADY_TERMINAL") {
        toast.info("Call already terminal — refreshing state");
      } else {
        toast.success("Call marked as failed / no-show");
      }
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/video-calls/${call.id}/join`, {
        method: "POST",
      });
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json() as Promise<JoinSession>;
    },
    onSuccess: (session) => {
      setJoinSession(session);
      toast.success("Join credentials minted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isActive = ["ARRANGING", "SCHEDULED", "IN_PROGRESS"].includes(call.status);
  const canArrange = ["ARRANGING", "SCHEDULED"].includes(call.status);
  const canStart = call.status === "SCHEDULED";
  const canComplete = call.status === "IN_PROGRESS";
  // Join: IN_APP + WITH_MATCHMAKER + SCHEDULED or IN_PROGRESS
  const canJoin =
    call.platform === "IN_APP" &&
    call.mode === "WITH_MATCHMAKER" &&
    ["SCHEDULED", "IN_PROGRESS"].includes(call.status);

  return (
    <div className="border border-[#E5E5EA] rounded-xl overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#F7F7FA] transition-colors text-left"
      >
        <CallStatusBadge status={call.status} />
        <span className="text-sm text-[#666672] flex-1">
          {call.platform ?? "IN_APP"} · {call.mode ?? "—"}
          {call.scheduled_at && (
            <span className="ml-2 text-[#17171B]">{formatDateTime(call.scheduled_at)}</span>
          )}
          {call.scheduled_tz && (
            <span className="ml-1 text-[#9CA3AF] text-xs">({call.scheduled_tz})</span>
          )}
        </span>
        {expanded ? <ChevronUp className="h-4 w-4 text-[#9CA3AF]" /> : <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />}
      </button>

      {expanded && (
        <div className="border-t border-[#E5E5EA] p-4 space-y-4 bg-white">
          {/* Detail grid */}
          <div>
            <DetailRow label="Call ID" value={<span className="font-mono text-xs">{call.id}</span>} />
            <DetailRow label="Platform" value={call.platform} />
            <DetailRow label="Mode" value={call.mode} />
            {call.channel_name && <DetailRow label="Channel Name" value={call.channel_name} />}
            {call.external_provider && <DetailRow label="Provider" value={call.external_provider} />}
            {call.external_meeting_url && (
              <DetailRow
                label="Meeting URL"
                value={
                  <a href={call.external_meeting_url} target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] hover:underline flex items-center gap-1">
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                }
              />
            )}
            {call.external_access_code && (
              <DetailRow label="Access Code" value={call.external_access_code} />
            )}
            <DetailRow label="Scheduled At" value={formatDateTime(call.scheduled_at)} />
            {call.scheduled_tz && <DetailRow label="Timezone" value={call.scheduled_tz} />}
            {call.started_at && <DetailRow label="Started At" value={formatDateTime(call.started_at)} />}
            {call.ended_at && <DetailRow label="Ended At" value={formatDateTime(call.ended_at)} />}
            {call.requester_outcome && <DetailRow label="Requester Outcome" value={call.requester_outcome} />}
            {call.candidate_outcome && <DetailRow label="Candidate Outcome" value={call.candidate_outcome} />}
            {call.outcome_expires_at && <DetailRow label="Outcome Expires" value={formatDateTime(call.outcome_expires_at)} />}
          </div>

          {/* Arrange form */}
          {canArrange && <ArrangeCallForm call={call} introId={introId} />}

          {/* Action bar */}
          {isActive && (
            <div className="flex flex-wrap gap-2">
              {canStart && (
                <button
                  type="button"
                  onClick={() => startMutation.mutate()}
                  disabled={startMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#16815D] hover:bg-[#15694E] rounded-lg disabled:opacity-50"
                >
                  <Play className="h-4 w-4" /> Start Call
                </button>
              )}
              {canComplete && (
                <button
                  type="button"
                  onClick={() => completeMutation.mutate()}
                  disabled={completeMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#16815D] hover:bg-[#15694E] rounded-lg disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" /> Complete
                </button>
              )}
              {canJoin && (
                <button
                  type="button"
                  onClick={() => joinMutation.mutate()}
                  disabled={joinMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50"
                >
                  <Video className="h-4 w-4" /> Join Call
                </button>
              )}
              <button
                type="button"
                onClick={() => setFailOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-lg"
              >
                <XCircle className="h-4 w-4" /> Fail / No-show
              </button>
            </div>
          )}

          {/* Join session credentials */}
          {joinSession && (
            <div className="p-3 bg-[#EDE2FF] border border-[#C4B5FD] rounded-xl space-y-2">
              <p className="text-xs font-semibold text-[#6D28D9]">Join Credentials</p>
              {[
                { label: "Channel", value: joinSession.channel_name },
                { label: "UID", value: String(joinSession.uid) },
                { label: "Expires", value: formatDateTime(joinSession.expires_at) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs text-[#6D28D9] w-20 shrink-0">{label}</span>
                  <span className="text-xs font-mono text-[#17171B] break-all">{value}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(value)}
                    className="ml-auto shrink-0"
                    aria-label={`Copy ${label}`}
                  >
                    <Copy className="h-3.5 w-3.5 text-[#6D28D9]" />
                  </button>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <span className="text-xs text-[#6D28D9] w-20 shrink-0">Token</span>
                <span className="text-xs font-mono text-[#17171B] break-all truncate max-w-xs">{joinSession.token}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(joinSession.token)}
                  className="ml-auto shrink-0"
                  aria-label="Copy token"
                >
                  <Copy className="h-3.5 w-3.5 text-[#6D28D9]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fail dialog */}
      <ConfirmDialog
        open={failOpen}
        onClose={() => { setFailOpen(false); setFailReason(""); }}
        onConfirm={() => failMutation.mutate()}
        title="Fail / No-show"
        description="Mark this call as failed. Enter 'NO_SHOW' exactly to record a no-show; any other value records as FAILED. The introduction will be cancelled and both requests released."
        confirmLabel="Confirm"
        variant="danger"
        isLoading={failMutation.isPending}
      >
        <div className="mt-3 space-y-2">
          <label className="block text-xs font-medium text-[#666672]">Reason</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFailReason("NO_SHOW")}
              className={`px-3 py-1.5 text-xs rounded-lg border ${failReason === "NO_SHOW" ? "bg-[#C63B4E] text-white border-[#C63B4E]" : "bg-white text-[#666672] border-[#E5E5EA]"}`}
            >
              No Show
            </button>
            <button
              type="button"
              onClick={() => setFailReason("Technical issue")}
              className={`px-3 py-1.5 text-xs rounded-lg border ${failReason === "Technical issue" ? "bg-[#C63B4E] text-white border-[#C63B4E]" : "bg-white text-[#666672] border-[#E5E5EA]"}`}
            >
              Technical issue
            </button>
          </div>
          <input
            type="text"
            value={failReason}
            onChange={(e) => setFailReason(e.target.value)}
            placeholder="Type reason (or 'NO_SHOW' exactly)…"
            className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C63B4E]/30 focus:border-[#C63B4E]"
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
