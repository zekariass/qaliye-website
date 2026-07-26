"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { SendHorizonal, Search } from "lucide-react";

export default function DirectNotificationPage() {
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [data, setData] = useState("");
  const [dataError, setDataError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  function validateData(value: string): boolean {
    if (!value.trim()) return true;
    try { JSON.parse(value); return true; } catch { return false; }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!validateData(data)) throw new Error("Data must be valid JSON.");
      const payload: Record<string, unknown> = { title: title.trim(), body: body.trim() };
      if (data.trim()) payload.data = JSON.parse(data);
      const res = await fetch(`/api/internal-admin/users/${userId}/push`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to send"); }
    },
    onSuccess: () => {
      toast.success(`Notification queued for ${displayName || userId}`);
      setTitle(""); setBody(""); setData(""); setDataError(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (userId.trim()) { setSearched(true); setDisplayName(userId); }
  }

  const isValid = searched && userId.trim() && title.trim() && body.trim();

  return (
    <div className="max-w-lg">
      <PageHeader title="Direct Notification" description="Send a push notification to an individual user" />

      <div className="space-y-5">
        <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#17171B] mb-4">Target User</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setSearched(false); }}
                placeholder="Enter user ID…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E5EA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
              />
            </div>
            <button type="submit" className="px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] rounded-xl hover:bg-[#6D28D9]">Look up</button>
          </form>
          {searched && <p className="mt-2 text-sm text-[#16815D]">✓ User {userId} targeted</p>}
        </div>

        <div className={`bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-4 ${!searched ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="text-sm font-semibold text-[#17171B]">Notification Content</h3>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]" placeholder="Notification title" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Body *</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={500} className="w-full px-3 py-2 text-sm border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none" placeholder="Notification body" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#17171B] mb-1.5">Data payload <span className="text-[#9CA3AF] font-normal">(optional JSON)</span></label>
            <textarea value={data} onChange={(e) => { setData(e.target.value); setDataError(null); }} rows={2} className={`w-full px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none ${dataError ? "border-[#C63B4E]" : "border-[#E5E5EA] focus:border-[#7C3AED]"}`} placeholder='{"screen": "profile"}' />
            {dataError && <p className="mt-1 text-xs text-[#C63B4E]">{dataError}</p>}
          </div>
          <button
            type="button"
            onClick={() => {
              setDataError(null);
              if (data.trim() && !validateData(data)) { setDataError("Must be valid JSON."); return; }
              mutation.mutate();
            }}
            disabled={!isValid || mutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizonal className="h-4 w-4" />
            {mutation.isPending ? "Sending…" : "Send notification (queued)"}
          </button>
        </div>
      </div>
    </div>
  );
}
