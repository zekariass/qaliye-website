"use client";

import Link from "next/link";
import { Drawer } from "@/components/admin/shared/Drawer";
import type { CandidateMatchView } from "@/lib/admin/matchmaking-types";
import { PersonAvatar, personLocation, personName } from "./PersonCard";
import { CompatibilityScore } from "./CompatibilityScore";
import { MatchBreakdown } from "./MatchBreakdown";
import { PreferencesGrid } from "./PreferencesGrid";
import { BadgeCheck, ExternalLink, Lock } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  candidate: CandidateMatchView | null;
  requesterName: string;
  adminConsolePath: string;
  onSelect: (candidate: CandidateMatchView) => void;
}

export function CandidateDetailsDrawer({
  open,
  onClose,
  candidate,
  requesterName,
  adminConsolePath,
  onSelect,
}: Props) {
  if (!candidate) return null;
  const p = candidate.profile;
  const mmNotes = candidate.preferences?.matchmaker_notes;
  const candidateName = personName(p);
  const profileUserId = p?.user_id ?? candidate.request.user_id;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Candidate"
      width="lg"
      footer={
        <div className="flex items-center gap-2">
          <Link
            href={`${adminConsolePath}/users/${profileUserId}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[#666672] bg-white border border-[#E5E5EA] hover:bg-[#F7F7FA] rounded-xl transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> View Full Profile
          </Link>
          <button
            type="button"
            onClick={() => onSelect(candidate)}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors"
          >
            Select Candidate
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Identity */}
        <div className="flex items-start gap-4">
          <PersonAvatar profile={p} size="lg" />
          <div className="min-w-0">
            <p className="text-base font-semibold text-[#17171B] flex items-center gap-1.5">
              {candidateName}
              {p?.is_verified && <BadgeCheck className="h-4 w-4 text-[#2563EB]" />}
            </p>
            <p className="text-sm text-[#666672]">
              {[p?.age ? `${p.age}` : null, personLocation(p) !== "—" ? personLocation(p) : null]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
            {p?.occupation && (
              <p className="text-xs text-[#9CA3AF] mt-0.5">{p.occupation}</p>
            )}
            {p?.is_verified && (
              <p className="mt-1 text-xs font-medium text-[#16815D]">Verified</p>
            )}
          </div>
        </div>

        <hr className="border-[#E5E5EA]" />

        {/* Compatibility */}
        <CompatibilityScore
          score={candidate.match}
          forwardLabel={`${requesterName} → ${candidateName}`}
          reverseLabel={`${candidateName} → ${requesterName}`}
        />

        <hr className="border-[#E5E5EA]" />

        {/* Breakdown */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
            Matching breakdown
          </p>
          <MatchBreakdown details={candidate.match.details} />
        </div>

        <hr className="border-[#E5E5EA]" />

        {/* Candidate preferences */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">
            Candidate preferences
          </p>
          <PreferencesGrid preferences={candidate.preferences} />
        </div>

        {/* Internal notes */}
        {mmNotes && (
          <>
            <hr className="border-[#E5E5EA]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Internal notes
              </p>
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-4 py-3">
                <p className="text-sm text-[#17171B] whitespace-pre-wrap">{mmNotes}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
