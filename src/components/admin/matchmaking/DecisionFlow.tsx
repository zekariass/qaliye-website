import type { Decision, IntroStatus } from "@/lib/admin/matchmaking-types";
import { formatDateTime } from "@/lib/admin/dates";
import { Check, Circle, X } from "lucide-react";

function DecisionIcon({ decision }: { decision: Decision }) {
  if (decision === "INTERESTED") {
    return (
      <div className="h-9 w-9 rounded-full bg-[#ECFDF5] border-2 border-[#A7F3D0] flex items-center justify-center">
        <Check className="h-5 w-5 text-[#16815D]" />
      </div>
    );
  }
  if (decision === "NOT_INTERESTED") {
    return (
      <div className="h-9 w-9 rounded-full bg-[#FFF1F2] border-2 border-[#FECDD3] flex items-center justify-center">
        <X className="h-5 w-5 text-[#C63B4E]" />
      </div>
    );
  }
  return (
    <div className="h-9 w-9 rounded-full bg-white border-2 border-dashed border-[#E5E5EA] flex items-center justify-center">
      <Circle className="h-4 w-4 text-[#9CA3AF]" />
    </div>
  );
}

function decisionLabel(d: Decision): string {
  if (d === "INTERESTED") return "Interested";
  if (d === "NOT_INTERESTED") return "Not interested";
  return "Pending";
}

interface Props {
  requesterName: string;
  candidateName: string;
  requesterDecision: Decision;
  candidateDecision: Decision;
  status: IntroStatus;
  decisionExpiresAt?: string | null;
}

/** Two-person decision state indicator for a proposed introduction. */
export function DecisionFlow({
  requesterName,
  candidateName,
  requesterDecision,
  candidateDecision,
  status,
  decisionExpiresAt,
}: Props) {
  const center =
    status === "MATCHED"
      ? { text: "Matched", cls: "text-[#16815D]" }
      : status === "DECLINED"
        ? { text: "Declined", cls: "text-[#C63B4E]" }
        : status === "CANCELLED"
          ? { text: "Cancelled", cls: "text-gray-500" }
          : status === "EXPIRED"
            ? { text: "Expired", cls: "text-gray-500" }
            : requesterDecision !== "PENDING" || candidateDecision !== "PENDING"
              ? { text: "Waiting", cls: "text-[#B7791F]" }
              : { text: "Decision", cls: "text-[#666672]" };

  function side(name: string, decision: Decision) {
    return (
      <div className="flex flex-col items-center gap-1.5 min-w-0 w-36">
        <p className="text-sm font-medium text-[#17171B] truncate max-w-full">{name}</p>
        <DecisionIcon decision={decision} />
        <p className="text-xs text-[#666672]">{decisionLabel(decision)}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-center gap-2 sm:gap-6">
        {side(requesterName, requesterDecision)}
        <div className="flex-1 max-w-40 flex flex-col items-center pt-8">
          <div className="w-full flex items-center gap-1">
            <div className="h-px flex-1 bg-[#E5E5EA]" />
            <div className="h-2 w-2 rotate-45 border-t border-r border-[#E5E5EA]" />
            <div className="h-px flex-1 bg-[#E5E5EA]" />
          </div>
          <p className={`mt-2 text-xs font-semibold uppercase tracking-wide ${center.cls}`}>
            {center.text}
          </p>
        </div>
        {side(candidateName, candidateDecision)}
      </div>
      {status === "PROPOSED" && decisionExpiresAt && (
        <p className="mt-3 text-center text-xs text-[#9CA3AF]">
          Decision deadline: {formatDateTime(decisionExpiresAt)}
        </p>
      )}
    </div>
  );
}
