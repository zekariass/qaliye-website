"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { parseInternalApiError } from "@/lib/admin/errors";
import { X } from "lucide-react";
import { OverrideParamsForm } from "./OverrideParamsForm";
import type { Introduction, OverrideParams, PreferenceSnapshot } from "@/lib/admin/matchmaking-types";

interface Props {
  open: boolean;
  onClose: () => void;
  requesterRequestId: string;
  prefilledCandidateId?: string;
  requesterSnapshot?: PreferenceSnapshot;
  adminConsolePath: string;
}

export function CreateIntroDialog({
  open,
  onClose,
  requesterRequestId,
  prefilledCandidateId = "",
  requesterSnapshot,
  adminConsolePath,
}: Props) {
  const router = useRouter();
  const [candidateId, setCandidateId] = useState(prefilledCandidateId);
  const [overrides, setOverrides] = useState<OverrideParams>({});
  const [useOverrides, setUseOverrides] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      setApiError(null);
      const dirty = Object.fromEntries(
        Object.entries(overrides).filter(([, v]) => v !== undefined)
      );
      const body: Record<string, unknown> = {
        requester_request_id: requesterRequestId,
        candidate_request_id: candidateId.trim(),
      };
      if (useOverrides && Object.keys(dirty).length > 0) {
        body.admin_override_params = dirty;
      }
      const res = await fetch("/api/internal-admin/matchmaking/introductions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await parseInternalApiError(res);
        setApiError(err.message);
        throw err;
      }
      return res.json() as Promise<Introduction>;
    },
    onSuccess: (intro) => {
      toast.success("Introduction created");
      onClose();
      router.push(`${adminConsolePath}/matchmaking/introductions/${intro.id}`);
    },
    onError: () => {
      // apiError already shown inline via setApiError
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 mx-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#666672] hover:text-[#17171B] rounded-lg"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-base font-semibold text-[#17171B] mb-4">Create Introduction</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#666672] mb-1">Requester Request ID</label>
            <input
              readOnly
              value={requesterRequestId}
              className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg bg-[#F7F7FA] font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#666672] mb-1">Candidate Request ID</label>
            <input
              type="text"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              placeholder="Paste candidate request UUID…"
              className="w-full px-3 py-1.5 text-sm border border-[#E5E5EA] rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useOverrides}
                onChange={(e) => setUseOverrides(e.target.checked)}
                className="w-4 h-4 accent-[#7C3AED]"
              />
              <span className="text-sm text-[#17171B]">Add admin override params</span>
            </label>
          </div>

          {useOverrides && (
            <div className="p-4 border border-[#E5E5EA] rounded-xl">
              <OverrideParamsForm
                snapshot={requesterSnapshot}
                value={overrides}
                onChange={setOverrides}
              />
            </div>
          )}

          {apiError && (
            <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-lg text-sm text-[#C63B4E]">
              {apiError}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={createMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-[#666672] bg-[#F7F7FA] hover:bg-[#E5E5EA] rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={!candidateId.trim() || createMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Creating…" : "Create Introduction"}
          </button>
        </div>
      </div>
    </div>
  );
}
