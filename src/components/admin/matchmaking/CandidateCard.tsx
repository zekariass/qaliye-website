"use client";

import type { CandidateMatchView } from "@/lib/admin/matchmaking-types";
import { PersonAvatar, personLocation, personName } from "./PersonCard";
import { CompatibilityChips } from "./CompatibilityScore";
import { MatchBreakdown } from "./MatchBreakdown";
import { BadgeCheck } from "lucide-react";

interface Props {
  candidate: CandidateMatchView;
  onViewDetails: () => void;
  onSelect: () => void;
}

export function CandidateCard({ candidate, onViewDetails, onSelect }: Props) {
  const p = candidate.profile;
  const matchedDetails = candidate.match.details.filter((d) => d.matched);

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
      <div className="flex items-start gap-4">
        <PersonAvatar profile={p} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-base font-semibold text-[#17171B] truncate">
              {personName(p)}
            </p>
            {p?.is_verified && (
              <BadgeCheck className="h-4 w-4 text-[#2563EB] shrink-0" />
            )}
          </div>
          <p className="text-sm text-[#666672]">
            {[p?.age ? `${p.age}` : null, personLocation(p) !== "—" ? personLocation(p) : null]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>
          {p?.occupation && (
            <p className="text-xs text-[#9CA3AF] mt-0.5">{p.occupation}</p>
          )}
          {p?.is_verified && (
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#16815D]">
              <BadgeCheck className="h-3 w-3" /> Verified
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <CompatibilityChips score={candidate.match} />
      </div>

      {matchedDetails.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-[#666672] mb-2">Why this candidate?</p>
          <MatchBreakdown details={matchedDetails} limit={4} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onViewDetails}
          className="px-3 py-2 text-sm font-medium text-[#666672] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl transition-colors"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={onSelect}
          className="px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
        >
          Select Candidate
        </button>
      </div>
    </div>
  );
}
