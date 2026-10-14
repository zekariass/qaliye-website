import type { RequestStatus, IntroStatus, Decision } from "@/lib/admin/matchmaking-types";

// ── Color maps ─────────────────────────────────────────────────────────────────

const REQUEST_STYLES: Record<RequestStatus, string> = {
  OPEN: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  ON_HOLD: "bg-[#FFFBEB] text-[#B7791F] border-[#FDE68A]",
  MATCHED: "bg-[#EDE2FF] text-[#6D28D9] border-[#C4B5FD]",
  COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
  CANCELLED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  EXPIRED: "bg-gray-100 text-gray-500 border-gray-200",
};

const INTRO_STYLES: Record<IntroStatus, string> = {
  PROPOSED: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  MATCHED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  DECLINED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
  EXPIRED: "bg-gray-100 text-gray-500 border-gray-200",
};

const DECISION_STYLES: Record<Decision, string> = {
  PENDING: "bg-gray-100 text-gray-500 border-gray-200",
  INTERESTED: "bg-[#ECFDF5] text-[#16815D] border-[#A7F3D0]",
  NOT_INTERESTED: "bg-[#FFF1F2] text-[#C63B4E] border-[#FECDD3]",
};

const DECISION_LABELS: Record<Decision, string> = {
  PENDING: "Pending",
  INTERESTED: "Interested",
  NOT_INTERESTED: "Not Interested",
};

function Badge({ style, label }: { style: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap ${style}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus | string }) {
  return (
    <Badge
      style={
        REQUEST_STYLES[status as RequestStatus] ??
        "bg-gray-100 text-gray-500 border-gray-200"
      }
      label={status}
    />
  );
}

export function IntroStatusBadge({ status }: { status: IntroStatus | string }) {
  return (
    <Badge
      style={
        INTRO_STYLES[status as IntroStatus] ??
        "bg-gray-100 text-gray-500 border-gray-200"
      }
      label={status}
    />
  );
}

export function DecisionBadge({ decision }: { decision: Decision | string }) {
  const d = (decision || "PENDING") as Decision;
  return (
    <Badge
      style={DECISION_STYLES[d] ?? "bg-gray-100 text-gray-500 border-gray-200"}
      label={DECISION_LABELS[d] ?? decision.replace(/_/g, " ")}
    />
  );
}
