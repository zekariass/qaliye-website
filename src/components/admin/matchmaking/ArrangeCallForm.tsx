"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import type { VideoCall, Platform, CallMode, ExtProvider, ArrangeCallBody } from "@/lib/admin/matchmaking-types";
import { CalendarClock } from "lucide-react";

interface Props {
  call: VideoCall;
  introId: string;
}

// Serialize a datetime-local string with the browser's current timezone offset
function toIsoWithOffset(localDatetime: string): string {
  const date = new Date(localDatetime);
  const tzOffset = -date.getTimezoneOffset(); // minutes
  const sign = tzOffset >= 0 ? "+" : "-";
  const abs = Math.abs(tzOffset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${hh}:${mm}`
  );
}

export function ArrangeCallForm({ call, introId }: Props) {
  const queryClient = useQueryClient();
  const [platform, setPlatform] = useState<Platform>("IN_APP");
  const [mode, setMode] = useState<CallMode>("WITH_MATCHMAKER");
  const [provider, setProvider] = useState<ExtProvider>("ZOOM");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduledTz, setScheduledTz] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!scheduledAt) e.scheduledAt = "scheduled_at is required";
    if (!mode) e.mode = "mode is required";
    if (platform === "EXTERNAL") {
      if (!meetingUrl) e.meetingUrl = "external_meeting_url is required for EXTERNAL";
      if (!provider) e.provider = "external_provider is required for EXTERNAL";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const arrangeMutation = useMutation({
    mutationFn: async () => {
      if (!validate()) throw new Error("Form validation failed");
      const body: ArrangeCallBody = {
        mode,
        scheduled_at: toIsoWithOffset(scheduledAt),
        scheduled_tz: scheduledTz.trim() || null,
      };
      if (platform === "EXTERNAL") {
        body.platform = "EXTERNAL";
        body.external_provider = provider;
        body.external_meeting_url = meetingUrl;
        // blank access code → null, never ""
        body.external_access_code = accessCode.trim() || null;
      }
      // IN_APP: omit platform (server defaults to IN_APP)

      const res = await fetch(`/api/internal-admin/matchmaking/video-calls/${call.id}/arrange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await parseInternalApiError(res);
        if (err.status === 422) {
          setErrors({ form: err.message });
          throw err;
        }
        if (err.status === 409) {
          // State moved — re-fetch
          await queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.videoCalls(introId) });
          throw new Error(`Conflict: ${err.message}`);
        }
        throw err;
      }
      return res.json() as Promise<VideoCall>;
    },
    onSuccess: () => {
      toast.success("Call scheduled");
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.videoCalls(introId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.introductions.detail(introId) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="border border-[#E5E5EA] rounded-xl p-4 bg-[#F7F7FA] space-y-4">
      <h4 className="text-sm font-semibold text-[#17171B] flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-[#7C3AED]" /> Arrange Call
      </h4>

      {/* Platform */}
      <div>
        <label className="block text-xs font-medium text-[#666672] mb-1">Platform</label>
        <div className="flex gap-2">
          {(["IN_APP", "EXTERNAL"] as Platform[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                platform === p
                  ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                  : "bg-white text-[#666672] border-[#E5E5EA] hover:border-[#7C3AED]"
              }`}
            >
              {p === "IN_APP" ? "In-App" : "External"}
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <label className="block text-xs font-medium text-[#666672] mb-1">Mode <span className="text-[#C63B4E]">*</span></label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as CallMode)}
          className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
        >
          <option value="PRIVATE">Private (matchmaker not present)</option>
          <option value="WITH_MATCHMAKER">With Matchmaker</option>
        </select>
        {errors.mode && <p className="text-xs text-[#C63B4E] mt-1">{errors.mode}</p>}
      </div>

      {/* External fields */}
      {platform === "EXTERNAL" && (
        <>
          <div>
            <label className="block text-xs font-medium text-[#666672] mb-1">Provider <span className="text-[#C63B4E]">*</span></label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as ExtProvider)}
              className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
            >
              <option value="ZOOM">Zoom</option>
              <option value="GOOGLE_MEET">Google Meet</option>
            </select>
            {errors.provider && <p className="text-xs text-[#C63B4E] mt-1">{errors.provider}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666672] mb-1">Meeting URL <span className="text-[#C63B4E]">*</span></label>
            <input
              type="url"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://zoom.us/j/123456789"
              className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
            />
            {errors.meetingUrl && <p className="text-xs text-[#C63B4E] mt-1">{errors.meetingUrl}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666672] mb-1">Passcode / Access Code (optional)</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Leave blank if none"
              className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
            />
          </div>
        </>
      )}

      {/* Scheduled at */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#666672] mb-1">Date & Time <span className="text-[#C63B4E]">*</span></label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
          />
          {errors.scheduledAt && <p className="text-xs text-[#C63B4E] mt-1">{errors.scheduledAt}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666672] mb-1">Timezone label (optional)</label>
          <input
            type="text"
            value={scheduledTz}
            onChange={(e) => setScheduledTz(e.target.value)}
            placeholder="e.g. Africa/Addis_Ababa"
            className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
          />
        </div>
      </div>

      {errors.form && (
        <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-lg text-sm text-[#C63B4E]">
          {errors.form}
        </div>
      )}

      <button
        type="button"
        onClick={() => arrangeMutation.mutate()}
        disabled={arrangeMutation.isPending}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50"
      >
        {arrangeMutation.isPending ? "Scheduling…" : "Schedule Call"}
      </button>
    </div>
  );
}
