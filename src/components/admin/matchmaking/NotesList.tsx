"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseInternalApiError } from "@/lib/admin/errors";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime } from "@/lib/admin/dates";
import type { Note } from "@/lib/admin/matchmaking-types";
import { PlusCircle } from "lucide-react";

interface Props {
  requestId: string;
}

export function NotesList({ requestId }: Props) {
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: adminKeys.matchmaking.notes(requestId),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${requestId}/admin-notes`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/internal-admin/matchmaking/requests/${requestId}/admin-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: text }),
      });
      if (!res.ok) throw await parseInternalApiError(res);
      return res.json() as Promise<Note>;
    },
    onSuccess: (note) => {
      queryClient.setQueryData<Note[]>(
        adminKeys.matchmaking.notes(requestId),
        (prev = []) => [...prev, note]
      );
      setNoteText("");
      toast.success("Note added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-[#E5E5EA] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.length === 0 && (
        <p className="text-sm text-[#9CA3AF] py-4 text-center">No internal notes yet.</p>
      )}

      {notes.map((n) => (
        <div key={n.id} className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-4 py-3">
          <p className="text-sm text-[#17171B] whitespace-pre-wrap">{n.note}</p>
          <p className="text-[10px] text-[#B7791F] mt-1">{formatDateTime(n.created_at)}</p>
        </div>
      ))}

      <div className="mt-2 space-y-2">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add an internal note…"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none"
        />
        <button
          type="button"
          onClick={() => addMutation.mutate(noteText.trim())}
          disabled={!noteText.trim() || addMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircle className="h-4 w-4" /> Add Note
        </button>
      </div>
    </div>
  );
}
