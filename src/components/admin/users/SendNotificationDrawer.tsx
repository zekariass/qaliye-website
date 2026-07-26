"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Drawer } from "@/components/admin/shared/Drawer";
import { SendHorizonal } from "lucide-react";

interface SendNotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  displayName: string;
}

export function SendNotificationDrawer({
  open,
  onClose,
  userId,
  displayName,
}: SendNotificationDrawerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [data, setData] = useState("");
  const [dataError, setDataError] = useState<string | null>(null);

  function validateData(value: string): boolean {
    if (!value.trim()) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (data.trim() && !validateData(data)) {
        throw new Error("Data field must be valid JSON.");
      }
      const payload: Record<string, unknown> = { title: title.trim(), body: body.trim() };
      if (data.trim()) payload.data = JSON.parse(data);

      const res = await fetch(`/api/internal-admin/users/${userId}/push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to send notification (${res.status})`);
      }
    },
    onSuccess: () => {
      toast.success(`Notification queued for ${displayName}`);
      setTitle("");
      setBody("");
      setData("");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDataError(null);
    if (data.trim() && !validateData(data)) {
      setDataError("Must be valid JSON or empty.");
      return;
    }
    mutation.mutate();
  }

  const isValid = title.trim().length > 0 && body.trim().length > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Notify ${displayName}`}
      description="Send a direct push notification to this user's devices."
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="send-notification-form"
            disabled={!isValid || mutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizonal className="h-4 w-4" />
            {mutation.isPending ? "Sending…" : "Send (queued)"}
          </button>
        </div>
      }
    >
      <form id="send-notification-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1.5" htmlFor="notif-title">
            Title <span className="text-[#C63B4E]">*</span>
          </label>
          <input
            id="notif-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
            placeholder="Notification title"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1.5" htmlFor="notif-body">
            Body <span className="text-[#C63B4E]">*</span>
          </label>
          <textarea
            id="notif-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none"
            placeholder="Notification message body"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#17171B] mb-1.5" htmlFor="notif-data">
            Data payload{" "}
            <span className="text-[#9CA3AF] font-normal">(optional JSON)</span>
          </label>
          <textarea
            id="notif-data"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
              setDataError(null);
            }}
            rows={3}
            className={`w-full px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none ${
              dataError
                ? "border-[#C63B4E] focus:border-[#C63B4E]"
                : "border-[#E5E5EA] focus:border-[#7C3AED]"
            }`}
            placeholder='{"screen": "profile"}'
          />
          {dataError && (
            <p className="mt-1 text-xs text-[#C63B4E]">{dataError}</p>
          )}
        </div>

        <p className="text-xs text-[#9CA3AF] p-3 bg-[#F7F7FA] rounded-lg">
          The notification will be queued and delivered to all active devices registered to this user.
        </p>
      </form>
    </Drawer>
  );
}
