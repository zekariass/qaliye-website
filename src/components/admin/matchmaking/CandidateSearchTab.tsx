"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { parseInternalApiError } from "@/lib/admin/errors";
import { OverrideParamsForm } from "./OverrideParamsForm";
import { RequestStatusBadge } from "./MmStatusBadges";
import type { MmRequest, OverrideParams } from "@/lib/admin/matchmaking-types";
import { Search, UserPlus } from "lucide-react";

interface Props {
  requestId: string;
  snapshot: MmRequest["preferences_snapshot"];
  adminConsolePath: string;
  onIntroduce: (candidateRequestId: string) => void;
  isDisabled: boolean;
}

export function CandidateSearchTab({ requestId, snapshot, adminConsolePath, onIntroduce, isDisabled }: Props) {
  const [overrides, setOverrides] = useState<OverrideParams>({});
  const [results, setResults] = useState<MmRequest[] | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const searchMutation = useMutation({
    mutationFn: async () => {
      setFieldError(null);
      // Only send override_params if there are any non-undefined keys
      const dirty = Object.fromEntries(
        Object.entries(overrides).filter(([, v]) => v !== undefined)
      );
      const bodyObj = Object.keys(dirty).length > 0 ? { override_params: dirty } : {};

      const res = await fetch(
        `/api/internal-admin/matchmaking/requests/${requestId}/candidate-search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj),
        }
      );

      if (!res.ok) {
        const err = await parseInternalApiError(res);
        if (err.status === 422) {
          // Surface message verbatim on the form — don't toast
          setFieldError(err.message);
          return null;
        }
        throw err;
      }
      return res.json() as Promise<MmRequest[]>;
    },
    onSuccess: (data) => {
      if (data) setResults(data);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isDisabled) {
    return (
      <div className="p-4 bg-[#F7F7FA] rounded-xl text-sm text-[#666672] text-center">
        Candidate search is only available for <strong>OPEN</strong> requests.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-4">
        <h3 className="text-sm font-semibold text-[#17171B] mb-3">Override Params</h3>
        <p className="text-xs text-[#9CA3AF] mb-3">
          Leave fields blank to use the stored preferences snapshot. Only non-blank values are sent.
        </p>
        <OverrideParamsForm
          snapshot={snapshot}
          value={overrides}
          onChange={setOverrides}
        />

        {fieldError && (
          <div className="mt-3 p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-lg text-sm text-[#C63B4E]">
            {fieldError}
          </div>
        )}

        <button
          type="button"
          onClick={() => searchMutation.mutate()}
          disabled={searchMutation.isPending}
          className="mt-4 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {searchMutation.isPending ? "Searching…" : "Run Search"}
        </button>
      </div>

      {results !== null && (
        <div>
          <p className="text-sm text-[#666672] mb-3">
            {results.length} candidate{results.length !== 1 ? "s" : ""} found
            {results.length === 200 && " (capped at 200)"}
          </p>

          {results.length === 0 && (
            <div className="p-6 text-center text-sm text-[#9CA3AF] border border-dashed border-[#E5E5EA] rounded-xl">
              No matching candidates.
            </div>
          )}

          <div className="space-y-2">
            {results.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 bg-white border border-[#E5E5EA] rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-[#17171B] truncate">{c.user_id}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <RequestStatusBadge status={c.status} />
                    {c.preferences_snapshot?.gender && (
                      <span className="text-xs text-[#666672]">{c.preferences_snapshot.gender}</span>
                    )}
                    {c.preferences_snapshot?.min_age && (
                      <span className="text-xs text-[#666672]">
                        {c.preferences_snapshot.min_age}–{c.preferences_snapshot.max_age ?? "∞"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`${adminConsolePath}/matchmaking/requests/${c.id}`}
                    className="text-xs text-[#7C3AED] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => onIntroduce(c.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Introduce
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
