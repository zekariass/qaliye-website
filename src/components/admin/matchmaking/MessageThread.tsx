"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import type { Message } from "@/lib/admin/matchmaking-types";
import { Send, Check } from "lucide-react";

interface Props {
  requestId: string;
}

function roleCls(role: string): string {
  if (role === "ADMIN") return "ml-auto bg-[#7C3AED] text-white";
  if (role === "SYSTEM") return "mx-auto bg-[#F7F7FA] text-[#666672] text-center italic";
  return "mr-auto bg-white border border-[#E5E5EA] text-[#17171B]";
}

export function MessageThread({ requestId }: Props) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: adminKeys.matchmaking.messages(requestId),
    queryFn: async () => {
      // Cursor-load oldest→latest: loop afterSeq until a short page (<50) comes back
      const all: Message[] = [];
      let afterSeq = 0;
      for (let i = 0; i < 20; i++) {
        const res = await fetch(
          `/api/internal-admin/matchmaking/requests/${requestId}/messages?afterSeq=${afterSeq}`
        );
        if (!res.ok) throw new Error(`${res.status}`);
        const batch: Message[] = await res.json();
        all.push(...batch);
        if (batch.length < 50) break;
        afterSeq = batch[batch.length - 1].seq;
      }
      return all;
    },
    refetchInterval: 10_000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${requestId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json() as Promise<Message>;
    },
    onSuccess: (msg) => {
      queryClient.setQueryData<Message[]>(
        adminKeys.matchmaking.messages(requestId),
        (prev = []) => [...prev, msg]
      );
      setBody("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `/api/internal-admin/matchmaking/requests/${requestId}/messages/read`,
        { method: "POST" }
      );
      if (!res.ok) throw await parseInternalApiError(res);
      // 200 OK — empty body
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.matchmaking.requests.detail(requestId) });
      toast.success("Thread marked as read");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSend = useCallback(() => {
    const text = body.trim();
    if (!text) return;
    sendMutation.mutate(text);
  }, [body, sendMutation]);

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-[#E5E5EA] rounded-xl animate-pulse w-3/4" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mark-read button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => markReadMutation.mutate()}
          disabled={markReadMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Mark all read
        </button>
      </div>

      {/* Thread */}
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-[#9CA3AF] text-center py-6">No messages yet.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col max-w-[75%]">
            <div className={`px-3 py-2 rounded-xl text-sm ${roleCls(m.sender_role)}`}>
              {m.body}
            </div>
            <span className={`text-[10px] text-[#9CA3AF] mt-0.5 ${m.sender_role === "ADMIN" ? "text-right self-end" : "self-start"}`}>
              {m.sender_role} · {formatDateTime(m.created_at)}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Composer — enabled even on terminal requests */}
      <div className="flex items-end gap-2 mt-1">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          rows={2}
          className="flex-1 px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!body.trim() || sendMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
