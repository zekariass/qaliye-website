"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseInternalApiError } from "@/lib/admin/errors";
import { Save } from "lucide-react";

interface Props {
  userId: string;
  initialNotes?: string | null;
}

export function MatchmakerNotesEditor({ userId, initialNotes }: Props) {
  const [text, setText] = useState(initialNotes ?? "");
  const [saved, setSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (notes: string) => {
      const res = await fetch(
        `/api/internal-admin/matchmaking/users/${userId}/matchmaking-preferences/notes-update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        }
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error("User has no preference row yet.");
        throw await parseInternalApiError(res);
      }
      // 200 OK — empty body
    },
    onSuccess: () => {
      setSaved(true);
      toast.success("Matchmaker notes saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#666672]">
        Internal notes — never visible to the user. Admins only.
      </p>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        placeholder="e.g. Prefers intro calls on weekends. Strong family emphasis."
        rows={5}
        className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] resize-none"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => saveMutation.mutate(text.trim())}
          disabled={!text.trim() || saveMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? "Saving…" : "Save Notes"}
        </button>
        {saved && <span className="text-xs text-[#16815D]">Saved!</span>}
      </div>
    </div>
  );
}
